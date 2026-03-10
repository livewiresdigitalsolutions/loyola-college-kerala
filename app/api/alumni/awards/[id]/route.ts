import { NextRequest, NextResponse } from 'next/server'
import { updateAlumniAward, deleteAlumniAward } from '@/lib/alumni-db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const item = await updateAlumniAward(parseInt(params.id), body)
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update award' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteAlumniAward(parseInt(params.id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete award' }, { status: 500 })
  }
}
