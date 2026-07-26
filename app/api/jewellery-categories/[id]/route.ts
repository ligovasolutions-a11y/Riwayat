import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getJewelleryCategory, updateJewelleryCategory, deleteJewelleryCategory } from '@/lib/content'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const category = getJewelleryCategory(Number(params.id))
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(category)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json().catch(() => null)
  const category = updateJewelleryCategory(Number(params.id), data ?? {})
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(category)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  deleteJewelleryCategory(Number(params.id))
  return NextResponse.json({ ok: true })
}
