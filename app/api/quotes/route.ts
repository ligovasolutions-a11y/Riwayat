import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { listQuotes, createQuote } from '@/lib/content'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(listQuotes())
}

// Public: used by the "Get a Quote" form. No auth required.
export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null)
  if (!data?.name || !data?.email || !data?.phone) {
    return NextResponse.json({ error: 'Name, email and phone are required.' }, { status: 400 })
  }
  const quote = createQuote({
    name: String(data.name).slice(0, 200),
    email: String(data.email).slice(0, 200),
    phone: String(data.phone).slice(0, 50),
    company: String(data.company ?? '').slice(0, 200),
    product_interest: String(data.product_interest ?? '').slice(0, 200),
    message: String(data.message ?? '').slice(0, 2000),
    status: 'new',
  })
  return NextResponse.json(quote, { status: 201 })
}
