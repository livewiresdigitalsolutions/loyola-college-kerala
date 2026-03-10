import { NextRequest, NextResponse } from 'next/server'
import { createAlumniMessage, getAllAlumniMessages } from '@/lib/alumni-db'

export async function GET() {
  try {
    const messages = await getAllAlumniMessages()
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }
    const saved = await createAlumniMessage({ name, email, subject, message })
    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}
