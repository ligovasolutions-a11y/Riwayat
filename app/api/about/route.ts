import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { setSetting } from '@/lib/db'
import { getAboutContent } from '@/lib/about'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(getAboutContent())
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json().catch(() => null)
  if (!data || typeof data !== 'object') return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })

  setSetting('about_page', JSON.stringify({
    hero: data.hero ?? {},
    founder: data.founder ?? {},
    values: data.values ?? {},
    cta: data.cta ?? {},
  }))
  return NextResponse.json(getAboutContent())
}
