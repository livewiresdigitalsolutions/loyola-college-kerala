import { NextRequest, NextResponse } from 'next/server'
import { getAlumniOfficeBearers, createAlumniOfficeBearer } from '@/lib/alumni-db'

export async function GET() {
  try {
    const items = await getAlumniOfficeBearers()
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch office bearers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const item = await createAlumniOfficeBearer(body)
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create office bearer' }, { status: 500 })
  }
}
