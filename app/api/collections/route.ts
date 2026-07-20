import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { listCollections, createCollection } from '@/lib/content'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(listCollections())
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json().catch(() => null)
  if (!data?.name) return NextResponse.json({ error: 'Collection name is required.' }, { status: 400 })
  return NextResponse.json(createCollection(data), { status: 201 })
}
