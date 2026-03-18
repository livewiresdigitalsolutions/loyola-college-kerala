import { NextRequest, NextResponse } from 'next/server'
import { updateAlumniAward, deleteAlumniAward } from '@/lib/alumni-db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json()
    const item = await updateAlumniAward(parseInt(id), body)
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update award' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteAlumniAward(parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete award' }, { status: 500 })
  }
}
