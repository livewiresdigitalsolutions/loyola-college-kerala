import { NextRequest, NextResponse } from 'next/server'
import { getAlumniPresidents, createAlumniPresident } from '@/lib/alumni-db'

export async function GET() {
  try {
    const items = await getAlumniPresidents()
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch presidents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const item = await createAlumniPresident(body)
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create president record' }, { status: 500 })
  }
}
