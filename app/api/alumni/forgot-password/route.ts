import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sendAlumniOTPEmail } from '@/lib/alumniEmail'
import { findAlumniByEmail, createAlumniOTP, deleteAlumniOTPsByEmail } from '@/lib/alumni-db'

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const user = await findAlumniByEmail(email)
    if (!user) {
      // We still return success to avoid email enumeration
      return NextResponse.json({ success: true, message: 'If this email is registered, an OTP has been sent.' })
    }

    const otp = generateOTP()
    const otpHash = await bcrypt.hash(otp, 10)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Remove old OTPs for this email
    await deleteAlumniOTPsByEmail(email)
    await createAlumniOTP(email, otpHash, expiresAt)

    await sendAlumniOTPEmail(email, otp, user.name)

    return NextResponse.json({ success: true, message: 'OTP sent to your email.' })
  } catch (error) {
    console.error('Alumni forgot-password error:', error)
    return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 })
  }
}
