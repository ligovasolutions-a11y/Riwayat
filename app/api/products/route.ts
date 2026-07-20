import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { listProducts, createProduct } from '@/lib/content'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(listProducts())
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json().catch(() => null)
  if (!data?.name) return NextResponse.json({ error: 'Product name is required.' }, { status: 400 })
  return NextResponse.json(createProduct(data), { status: 201 })
}
