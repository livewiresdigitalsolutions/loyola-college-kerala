import { NextRequest, NextResponse } from 'next/server'
import { deleteAlumniGalleryItem } from '@/lib/alumni-db'

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteAlumniGalleryItem(parseInt(params.id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}
