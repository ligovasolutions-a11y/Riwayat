import { NextRequest, NextResponse } from 'next/server'
import { getSession, verifyPassword, hashPassword } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json().catch(() => null)
  const currentPassword = typeof data?.currentPassword === 'string' ? data.currentPassword : ''
  const newPassword = typeof data?.newPassword === 'string' ? data.newPassword : ''

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Current and new password are required.' }, { status: 400 })
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })
  }

  const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(session.email) as
    | { id: number; password_hash: string }
    | undefined
  if (!user || !verifyPassword(currentPassword, user.password_hash)) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 })
  }

  db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(hashPassword(newPassword), user.id)
  return NextResponse.json({ ok: true })
}
