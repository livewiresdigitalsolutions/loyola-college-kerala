import { NextRequest, NextResponse } from 'next/server'
import { updateAlumniPresident, deleteAlumniPresident } from '@/lib/alumni-db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    return NextResponse.json(await updateAlumniPresident(parseInt(params.id), body))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update president record' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteAlumniPresident(parseInt(params.id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete president record' }, { status: 500 })
  }
}
