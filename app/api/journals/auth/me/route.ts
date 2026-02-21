import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { findUserById, updateUser } from '@/lib/journal-db';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JOURNAL_JWT_SECRET || process.env.JWT_SECRET || 'loyola-journal-secret-key-min-32-characters'
);

async function getAuthUser(request: NextRequest) {
    const token = request.cookies.get('journal_auth_token')?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    try {
        const authUser = await getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const user = await findUserById(authUser.id as number);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        if (!user.is_active) {
            return NextResponse.json({ error: 'Account deactivated' }, { status: 403 });
        }

        const { password_hash, ...safeUser } = user;
        return NextResponse.json({ success: true, user: safeUser });
    } catch (error: any) {
        console.error('Auth check error:', error);
        return NextResponse.json({ error: 'Session expired or invalid' }, { status: 401 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const authUser = await getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const allowedFields = [
            'salutation', 'first_name', 'middle_name', 'last_name',
            'designation', 'affiliation', 'country', 'state', 'city',
            'phone', 'address', 'bio',
        ];

        const updates: Record<string, any> = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates[field] = body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        await updateUser(authUser.id as number, updates);

        return NextResponse.json({ success: true, message: 'Profile updated successfully' });
    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}

