import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createPasswordResetToken } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { logAction } from '@/lib/audit';

const schema = z.object({ username: z.string().min(1).max(100) });

/*
 * No email provider is configured for this deployment (see README /
 * .env.example — SMTP_* vars are optional). Rather than either skip
 * this feature or the far worse alternative of returning the reset
 * link in the HTTP response (which would let anyone take over the
 * admin account just by requesting a reset for "admin"), the link is
 * printed to the server console/log only. Only someone with access to
 * the server's logs — i.e. whoever is actually running this deployment
 * — can retrieve it. Wire up real email later by replacing the
 * console.log below with your provider's send call.
 */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`forgot:${ip}`, 5, 15 * 60 * 1000);
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
    return NextResponse.json({ error: 'Please enter a username.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username: parsed.data.username } });

  if (user) {
    const { id, expiresAt } = await createPasswordResetToken(user.id);
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    const resetUrl = `${siteUrl}/admin/reset-password/${id}`;
    console.log('\n=== PASSWORD RESET REQUESTED ===');
    console.log(`User: ${user.username}`);
    console.log(`Reset link (expires ${expiresAt.toISOString()}): ${resetUrl}`);
    console.log('=================================\n');
    await logAction(user.username, 'password_reset_requested', undefined, ip);
  }

  // Same response whether or not the username exists, so this endpoint
  // can't be used to enumerate valid usernames.
  return NextResponse.json({ ok: true, message: 'If that account exists, a reset link has been generated. Contact your site administrator to retrieve it from the server logs.' });
}
