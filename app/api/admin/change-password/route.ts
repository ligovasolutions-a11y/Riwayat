import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, hashPassword, validatePasswordStrength, destroyOtherSessions } from '@/lib/auth';
import { requireApiSession, clientIpFromRequest } from '@/lib/adminGuard';
import { logAction } from '@/lib/audit';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export async function POST(request: Request) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;
  const { session } = result;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please fill in both password fields.' }, { status: 400 });
  }

  const validCurrent = await verifyPassword(parsed.data.currentPassword, session.user.passwordHash);
  if (!validCurrent) {
    await logAction(session.user.username, 'change_password_failed', 'wrong current password', clientIpFromRequest(request));
    return NextResponse.json({ error: 'Your current password is incorrect.' }, { status: 401 });
  }

  const strength = validatePasswordStrength(parsed.data.newPassword);
  if (!strength.valid) {
    return NextResponse.json({ error: 'Password is not strong enough.', reasons: strength.reasons }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash, mustChangePassword: false },
  });

  // Changing the password invalidates every other logged-in session for
  // this account, keeping only the one making this request.
  await destroyOtherSessions(session.user.id, session.id);
  await logAction(session.user.username, 'change_password_success', undefined, clientIpFromRequest(request));

  return NextResponse.json({ ok: true });
}
