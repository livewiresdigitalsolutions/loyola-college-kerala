import { NextRequest, NextResponse } from 'next/server'
import { getAllAlumniUsers } from '@/lib/alumni-db'

export async function GET() {
  try {
    const users = await getAllAlumniUsers()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch alumni users' }, { status: 500 })
  }
}
