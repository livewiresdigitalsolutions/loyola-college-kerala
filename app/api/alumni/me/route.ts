import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.ALUMNI_JWT_SECRET || 'alumni-secret-2025')

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('alumni_token')?.value
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return NextResponse.json({
      user: {
        id: payload.id,
        name: payload.name,
        email: payload.email,
      }
    })
  } catch {
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
