import { NextRequest, NextResponse } from 'next/server'
import { getAlumniAwards, createAlumniAward } from '@/lib/alumni-db'

export async function GET() {
  try {
    const items = await getAlumniAwards()
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch awards' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const item = await createAlumniAward(body)
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create award' }, { status: 500 })
  }
}
