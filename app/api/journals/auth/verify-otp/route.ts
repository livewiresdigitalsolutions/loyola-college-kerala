import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { getLatestOTP, incrementOTPAttempts, markOTPUsed } from '@/lib/journal-db';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JOURNAL_JWT_SECRET || process.env.JWT_SECRET || 'loyola-journal-secret-key-min-32-characters'
);

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Get latest OTP for this email
        const otpRecord = await getLatestOTP(normalizedEmail);

        if (!otpRecord) {
            return NextResponse.json(
                { error: 'No OTP found. Please request a new one.' },
                { status: 400 }
            );
        }

        // Check expiry
        const expiresAt = new Date(otpRecord.expires_at).getTime();
        if (Date.now() > expiresAt) {
            return NextResponse.json(
                { error: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Check attempts
        if (otpRecord.attempts >= 5) {
            return NextResponse.json(
                { error: 'Too many failed attempts. Please request a new OTP.' },
                { status: 429 }
            );
        }

        // Verify OTP
        const isValid = await bcrypt.compare(otp.toString(), otpRecord.otp_hash);

        if (!isValid) {
            // Increment attempt counter
            await incrementOTPAttempts(otpRecord.id);
            const remaining = 4 - otpRecord.attempts;
            return NextResponse.json(
                { error: `Invalid OTP. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Please request a new OTP.'}` },
                { status: 400 }
            );
        }

        // OTP is valid — mark as used
        await markOTPUsed(otpRecord.id);

        // Generate a short-lived reset token (5 minutes)
        const resetToken = await new SignJWT({
            email: normalizedEmail,
            purpose: 'password_reset',
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('5m')
            .sign(JWT_SECRET);

        return NextResponse.json({
            success: true,
            message: 'OTP verified successfully.',
            resetToken,
        });
    } catch (error: any) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: 'Verification failed. Please try again.' },
            { status: 500 }
        );
    }
}
