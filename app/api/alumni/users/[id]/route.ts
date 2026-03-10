import { NextRequest, NextResponse } from 'next/server'
import { updateAlumniUser } from '@/lib/alumni-db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const user = await updateAlumniUser(parseInt(params.id), body)
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
