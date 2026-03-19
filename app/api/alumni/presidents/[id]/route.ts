import { NextRequest, NextResponse } from 'next/server'
import { updateAlumniPresident, deleteAlumniPresident } from '@/lib/alumni-db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json()
    return NextResponse.json(await updateAlumniPresident(parseInt(id), body))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update president record' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteAlumniPresident(parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete president record' }, { status: 500 })
  }
}
