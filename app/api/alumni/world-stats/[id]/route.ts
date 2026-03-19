import { NextRequest, NextResponse } from 'next/server'
import { updateAlumniWorldStat, deleteAlumniWorldStat } from '@/lib/alumni-db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const item = await updateAlumniWorldStat(parseInt(params.id), body)
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update world stat' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteAlumniWorldStat(parseInt(params.id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete world stat' }, { status: 500 })
  }
}
