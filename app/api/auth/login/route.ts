import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email) as
    | { id: number; email: string; password_hash: string }
    | undefined

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  const token = await createSessionToken(user.email)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  return res
}
