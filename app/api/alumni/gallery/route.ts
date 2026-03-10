import { NextRequest, NextResponse } from 'next/server'
import { getAlumniGallery, createAlumniGalleryItem } from '@/lib/alumni-db'

export async function GET() {
  try {
    const items = await getAlumniGallery()
    return NextResponse.json(items)
  } catch (error) {
    console.error('Gallery GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const item = await createAlumniGalleryItem(body)
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Gallery POST error:', error)
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 })
  }
}
