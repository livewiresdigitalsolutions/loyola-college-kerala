import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '@/lib/journal-db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            salutation, first_name, middle_name, last_name,
            designation, affiliation, country, state,
            email, phone, address, password
        } = body;

        // Validation
        if (!first_name || !last_name || !email || !password) {
            return NextResponse.json(
                { error: 'First name, last name, email, and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 12);

        // Create user
        const user = await createUser({
            salutation: salutation || null,
            first_name,
            middle_name: middle_name || null,
            last_name,
            designation: designation || null,
            affiliation: affiliation || null,
            country: country || null,
            state: state || null,
            email: email.toLowerCase().trim(),
            phone: phone || null,
            address: address || null,
            password_hash,
        });

        return NextResponse.json({
            success: true,
            message: 'Registration successful! You can now login.',
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}
