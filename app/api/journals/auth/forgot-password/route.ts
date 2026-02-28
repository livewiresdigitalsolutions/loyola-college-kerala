import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createOTP, getLatestOTP } from '@/lib/journal-db';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists
        const user = await findUserByEmail(normalizedEmail);
        if (!user) {
            // Don't reveal if email exists — return success anyway
            return NextResponse.json({
                success: true,
                message: 'If an account with this email exists, an OTP has been sent.',
            });
        }

        // Rate limiting — check if OTP was sent in last 60 seconds
        const existingOTP = await getLatestOTP(normalizedEmail);
        if (existingOTP) {
            const createdAt = new Date(existingOTP.created_at).getTime();
            const now = Date.now();
            const diffSeconds = (now - createdAt) / 1000;

            if (diffSeconds < 60) {
                return NextResponse.json(
                    { error: `Please wait ${Math.ceil(60 - diffSeconds)} seconds before requesting a new OTP` },
                    { status: 429 }
                );
            }
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP before storing
        const otpHash = await bcrypt.hash(otp, 10);

        // Expiry: 10 minutes from now
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Store OTP in database
        await createOTP(normalizedEmail, otpHash, expiresAt);

        // Send OTP via email
        try {
            await sendOTPEmail(normalizedEmail, otp);
        } catch (emailError) {
            return NextResponse.json(
                { error: 'Failed to send OTP email. Please try again later.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent to your email address.',
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
