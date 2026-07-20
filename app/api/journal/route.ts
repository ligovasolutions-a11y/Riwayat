import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { listJournalPosts, createJournalPost } from '@/lib/content'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(listJournalPosts())
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json().catch(() => null)
  if (!data?.title) return NextResponse.json({ error: 'Article title is required.' }, { status: 400 })
  return NextResponse.json(createJournalPost(data), { status: 201 })
}
