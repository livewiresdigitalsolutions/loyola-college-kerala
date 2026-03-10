import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { findAlumniByEmail } from '@/lib/alumni-db'

const JWT_SECRET = new TextEncoder().encode(process.env.ALUMNI_JWT_SECRET || 'alumni-secret-2025')

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const user = await findAlumniByEmail(email)
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const token = await new SignJWT({ id: user.id, name: user.name, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    const response = NextResponse.json({ success: true, name: user.name, email: user.email })
    response.cookies.set('alumni_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (error) {
    console.error('Alumni login error:', error)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}
