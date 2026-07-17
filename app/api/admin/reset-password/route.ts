import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { consumePasswordResetToken, hashPassword, validatePasswordStrength, destroyOtherSessions } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { logAction } from '@/lib/audit';

const schema = z.object({ token: z.string().min(1), newPassword: z.string().min(1) });

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`reset:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const strength = validatePasswordStrength(parsed.data.newPassword);
  if (!strength.valid) {
    return NextResponse.json({ error: 'Password is not strong enough.', reasons: strength.reasons }, { status: 400 });
  }

  const user = await consumePasswordResetToken(parsed.data.token);
  if (!user) {
    return NextResponse.json({ error: 'This reset link is invalid or has expired. Please request a new one.' }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, mustChangePassword: false, failedAttempts: 0, lockedUntil: null },
  });

  // A password reset invalidates every existing session for the
  // account — anyone who had a stolen/stale session is logged out.
  await destroyOtherSessions(user.id);
  await logAction(user.username, 'password_reset_completed', undefined, ip);

  return NextResponse.json({ ok: true });
}
