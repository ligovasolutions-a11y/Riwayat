import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, isLocked, recordFailedLogin, resetFailedLogins, createSession } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { logAction } from '@/lib/audit';

const schema = z.object({ username: z.string().min(1).max(100), password: z.string().min(1).max(200) });

export async function POST(request: Request) {
  const ip = clientIp(request.headers);

  // Two independent brakes: an IP-based rate limit (defense against
  // distributed guessing / scripscript noise) and a per-account lockout
  // after repeated failures (defense against a single account being
  // targeted from many IPs).
  const limit = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) {
    await logAction(null, 'login_rate_limited', undefined, ip);
    return NextResponse.json({ error: 'Too many login attempts. Please try again in a few minutes.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
  }
  const { username, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { username } });

  // Constant-shaped response whether the username exists or not, to
  // avoid leaking which usernames are valid via response differences.
  const genericError = 'Incorrect username or password.';

  if (!user) {
    await logAction(username, 'login_failed', 'unknown username', ip);
    return NextResponse.json({ error: genericError }, { status: 401 });
  }

  if (isLocked(user)) {
    await logAction(username, 'login_blocked_locked', undefined, ip);
    return NextResponse.json({ error: 'This account is temporarily locked due to repeated failed logins. Try again later.' }, { status: 423 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    await recordFailedLogin(username);
    await logAction(username, 'login_failed', 'wrong password', ip);
    return NextResponse.json({ error: genericError }, { status: 401 });
  }

  await resetFailedLogins(user.id);
  await createSession(user.id, ip, request.headers.get('user-agent'));
  await logAction(username, 'login_success', undefined, ip);

  return NextResponse.json({ ok: true, mustChangePassword: user.mustChangePassword });
}
