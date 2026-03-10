import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getLatestAlumniOTP, markAlumniOTPUsed } from '@/lib/alumni-db'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 })
    }

    const record = await getLatestAlumniOTP(email)
    if (!record) {
      return NextResponse.json({ error: 'No OTP found. Please request a new one.' }, { status: 400 })
    }

    const expires = new Date(record.expires_at).getTime()
    if (Date.now() > expires) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 })
    }

    const match = await bcrypt.compare(otp.trim(), record.otp_hash)
    if (!match) {
      return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 })
    }

    await markAlumniOTPUsed(record.id)

    return NextResponse.json({ success: true, message: 'OTP verified successfully.' })
  } catch (error) {
    console.error('Alumni verify-otp error:', error)
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 })
  }
}
