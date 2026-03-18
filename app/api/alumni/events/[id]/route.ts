import { NextRequest, NextResponse } from 'next/server'
import { updateAlumniEvent, deleteAlumniEvent } from '@/lib/alumni-db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json()
    const item = await updateAlumniEvent(parseInt(id), body)
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteAlumniEvent(parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
