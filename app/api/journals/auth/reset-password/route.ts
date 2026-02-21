import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { findUserByEmail, updateUser, deleteOTPsByEmail } from '@/lib/journal-db';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JOURNAL_JWT_SECRET || process.env.JWT_SECRET || 'loyola-journal-secret-key-min-32-characters'
);

export async function POST(request: NextRequest) {
    try {
        const { resetToken, newPassword, confirmPassword } = await request.json();

        if (!resetToken || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: 'Reset token, new password, and confirmation are required' },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Verify reset token
        let payload;
        try {
            const verified = await jwtVerify(resetToken, JWT_SECRET);
            payload = verified.payload;
        } catch {
            return NextResponse.json(
                { error: 'Reset token has expired or is invalid. Please start over.' },
                { status: 400 }
            );
        }

        if (payload.purpose !== 'password_reset' || !payload.email) {
            return NextResponse.json(
                { error: 'Invalid reset token' },
                { status: 400 }
            );
        }

        const email = payload.email as string;

        // Find user
        const user = await findUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Hash new password
        const password_hash = await bcrypt.hash(newPassword, 12);

        // Update user password
        await updateUser(user.id, { password_hash });

        // Clean up OTPs for this email
        await deleteOTPsByEmail(email);

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully! You can now login with your new password.',
        });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Password reset failed. Please try again.' },
            { status: 500 }
        );
    }
}
