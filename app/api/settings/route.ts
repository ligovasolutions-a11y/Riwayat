import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAllSettings, setSetting } from '@/lib/db'

const PUBLIC_KEYS = [
  'siteName', 'tagline', 'phone', 'email', 'address', 'instagram', 'facebook',
  'youtube', 'whatsapp', 'announcement', 'metaTitle', 'metaDesc',
]

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const all = getAllSettings()
  const settings = Object.fromEntries(PUBLIC_KEYS.map((k) => [k, all[k] ?? '']))
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json().catch(() => null)
  if (!data || typeof data !== 'object') return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })

  for (const key of PUBLIC_KEYS) {
    if (typeof data[key] === 'string') setSetting(key, data[key])
  }
  const all = getAllSettings()
  const settings = Object.fromEntries(PUBLIC_KEYS.map((k) => [k, all[k] ?? '']))
  return NextResponse.json(settings)
}
