import { NextRequest, NextResponse } from 'next/server'
import { deleteAlumniGalleryItem } from '@/lib/alumni-db'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteAlumniGalleryItem(parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}
