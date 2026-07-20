import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getCollection, updateCollection, deleteCollection } from '@/lib/content'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const collection = getCollection(Number(params.id))
  if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(collection)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json().catch(() => null)
  const collection = updateCollection(Number(params.id), data ?? {})
  if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(collection)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  deleteCollection(Number(params.id))
  return NextResponse.json({ ok: true })
}
