import { NextRequest, NextResponse } from 'next/server'
import { updateAlumniOfficeBearer, deleteAlumniOfficeBearer } from '@/lib/alumni-db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json()
    return NextResponse.json(await updateAlumniOfficeBearer(parseInt(id), body))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update office bearer' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteAlumniOfficeBearer(parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete office bearer' }, { status: 500 })
  }
}
