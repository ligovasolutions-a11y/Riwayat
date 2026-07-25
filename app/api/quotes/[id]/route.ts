import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { updateQuoteStatus, deleteQuote } from '@/lib/content'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json().catch(() => null)
  if (!data?.status) return NextResponse.json({ error: 'Status is required.' }, { status: 400 })
  const quote = updateQuoteStatus(Number(params.id), data.status)
  if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(quote)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  deleteQuote(Number(params.id))
  return NextResponse.json({ ok: true })
}
