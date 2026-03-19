import { NextRequest, NextResponse } from 'next/server'
import { getAlumniWorldStats, createAlumniWorldStat } from '@/lib/alumni-db'

export async function GET() {
  try {
    const items = await getAlumniWorldStats()
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch world stats' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const item = await createAlumniWorldStat(body)
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create world stat' }, { status: 500 })
  }
}
