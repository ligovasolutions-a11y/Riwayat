import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { listAppointments, createAppointment } from '@/lib/content'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(listAppointments())
}

// Public: used by the booking form on /appointments. No auth required.
export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null)
  if (!data?.name || !data?.email || !data?.phone) {
    return NextResponse.json({ error: 'Name, email and phone are required.' }, { status: 400 })
  }
  const appointment = createAppointment({
    name: String(data.name).slice(0, 200),
    email: String(data.email).slice(0, 200),
    phone: String(data.phone).slice(0, 50),
    type: String(data.type ?? '').slice(0, 100),
    date: String(data.date ?? '').slice(0, 50),
    time: String(data.time ?? '').slice(0, 50),
    message: String(data.message ?? '').slice(0, 2000),
    status: 'pending',
  })
  return NextResponse.json(appointment, { status: 201 })
}
