import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { findUserByEmail } from '@/lib/journal-db';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JOURNAL_JWT_SECRET || process.env.JWT_SECRET || 'loyola-journal-secret-key-min-32-characters'
);

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await findUserByEmail(email.toLowerCase().trim());

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if account is active
        if (!user.is_active) {
            return NextResponse.json(
                { error: 'Your account has been deactivated. Please contact the administrator.' },
                { status: 403 }
            );
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: 'journal_user',
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('8h')
            .sign(JWT_SECRET);

        // Set cookie and return response
        const response = NextResponse.json({
            success: true,
            message: 'Login successful!',
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
        });

        response.cookies.set('journal_auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 8, // 8 hours
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed. Please try again.' },
            { status: 500 }
        );
    }
}
