import { NextRequest, NextResponse } from 'next/server'
import { getAlumniEvents, createAlumniEvent } from '@/lib/alumni-db'

export async function GET() {
  try {
    const items = await getAlumniEvents()
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const item = await createAlumniEvent(body)
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
