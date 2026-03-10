import { NextRequest, NextResponse } from 'next/server'
import { updateAlumniOfficeBearer, deleteAlumniOfficeBearer } from '@/lib/alumni-db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    return NextResponse.json(await updateAlumniOfficeBearer(parseInt(params.id), body))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update office bearer' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteAlumniOfficeBearer(parseInt(params.id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete office bearer' }, { status: 500 })
  }
}
