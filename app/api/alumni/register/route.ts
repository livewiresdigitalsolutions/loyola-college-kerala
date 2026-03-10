import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { createAlumniUser, findAlumniByEmail } from '@/lib/alumni-db'

const JWT_SECRET = new TextEncoder().encode(process.env.ALUMNI_JWT_SECRET || 'alumni-secret-2025')

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, country, city } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await findAlumniByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const user = await createAlumniUser({ name, email, password_hash, phone, country, city })

    // Issue JWT
    const token = await new SignJWT({ id: user.id, name: user.name, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    const response = NextResponse.json({ success: true, name: user.name, email: user.email }, { status: 201 })
    response.cookies.set('alumni_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return response
  } catch (error) {
    console.error('Alumni register error:', error)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
