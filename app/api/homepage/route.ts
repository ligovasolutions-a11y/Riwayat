import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { setSetting } from '@/lib/db'
import { getHomepageContent } from '@/lib/homepage'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(getHomepageContent())
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json().catch(() => null)
  if (!data || typeof data !== 'object') return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })

  if (Array.isArray(data.heroSlides)) setSetting('hero_slides', JSON.stringify(data.heroSlides))
  if (data.heroButtons && typeof data.heroButtons === 'object') {
    if (typeof data.heroButtons.btn1 === 'string') setSetting('hero_btn1', data.heroButtons.btn1)
    if (typeof data.heroButtons.btn2 === 'string') setSetting('hero_btn2', data.heroButtons.btn2)
    if (typeof data.heroButtons.btn3 === 'string') setSetting('hero_btn3', data.heroButtons.btn3)
  }
  if (typeof data.announcement === 'string') setSetting('announcement', data.announcement)
  if (data.sections && typeof data.sections === 'object') setSetting('homepage_sections', JSON.stringify(data.sections))

  return NextResponse.json(getHomepageContent())
}
