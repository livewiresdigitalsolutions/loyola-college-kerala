import { NextRequest, NextResponse } from 'next/server'
import { updateAlumniUser } from '@/lib/alumni-db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json()
    const user = await updateAlumniUser(parseInt(id), body)
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
