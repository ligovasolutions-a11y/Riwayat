import 'server-only';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import type { User } from '@prisma/client';

export const SESSION_COOKIE = 'riwayat_session';
const SESSION_MINUTES = 30; // inactivity timeout — rolling, extended on each request
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const BCRYPT_ROUNDS = 12;

function isProd() {
  return process.env.NODE_ENV === 'production';
}

/* ---------- Passwords ---------- */

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function validatePasswordStrength(pw: string): { valid: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (pw.length < 12) reasons.push('Must be at least 12 characters long.');
  if (!/[a-z]/.test(pw)) reasons.push('Must include a lowercase letter.');
  if (!/[A-Z]/.test(pw)) reasons.push('Must include an uppercase letter.');
  if (!/[0-9]/.test(pw)) reasons.push('Must include a number.');
  if (!/[^a-zA-Z0-9]/.test(pw)) reasons.push('Must include a symbol.');
  return { valid: reasons.length === 0, reasons };
}

/* ---------- Account lockout ---------- */

export function isLocked(user: Pick<User, 'lockedUntil'>): boolean {
  return !!user.lockedUntil && user.lockedUntil.getTime() > Date.now();
}

export async function recordFailedLogin(username: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return; // don't reveal whether the username exists via timing/state changes
  const failedAttempts = user.failedAttempts + 1;
  const shouldLock = failedAttempts >= MAX_FAILED_ATTEMPTS;
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedAttempts: shouldLock ? 0 : failedAttempts,
      lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000) : user.lockedUntil,
    },
  });
}

export async function resetFailedLogins(userId: number): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { failedAttempts: 0, lockedUntil: null } });
}

/* ---------- Sessions ---------- */

export type SessionWithUser = {
  id: string;
  csrfToken: string;
  expiresAt: Date;
  user: User;
};

export async function createSession(userId: number, ip: string | null, userAgent: string | null) {
  const id = crypto.randomBytes(32).toString('hex');
  const csrfToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_MINUTES * 60 * 1000);

  await prisma.session.create({ data: { id, userId, csrfToken, ip, userAgent, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, id, {
    httpOnly: true,
    secure: isProd(),
    sameSite: 'strict',
    path: '/',
    expires: expiresAt,
  });

  return { id, csrfToken, expiresAt };
}

/* Reads the session cookie, validates + extends it (rolling inactivity
   timeout). Returns null if there is no session, it expired, or the
   linked user no longer exists — callers should redirect to /admin/login. */
export async function getSession(): Promise<SessionWithUser | null> {
  const cookieStore = await cookies();
  const sid = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sid) return null;

  const session = await prisma.session.findUnique({ where: { id: sid }, include: { user: true } });
  if (!session) return null;

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { id: sid } }).catch(() => undefined);
    return null;
  }

  // Rolling expiry: extend on activity so an active admin session doesn't
  // time out mid-edit, but an idle one expires after SESSION_MINUTES.
  const newExpiry = new Date(Date.now() + SESSION_MINUTES * 60 * 1000);
  await prisma.session.update({ where: { id: sid }, data: { expiresAt: newExpiry } }).catch(() => undefined);

  return { id: session.id, csrfToken: session.csrfToken, expiresAt: newExpiry, user: session.user };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sid = cookieStore.get(SESSION_COOKIE)?.value;
  if (sid) await prisma.session.delete({ where: { id: sid } }).catch(() => undefined);
  cookieStore.set(SESSION_COOKIE, '', { httpOnly: true, secure: isProd(), sameSite: 'strict', path: '/', expires: new Date(0) });
}

/* Invalidates every other session for this user (e.g. on password
   change), keeping only the current one if keepSessionId is given. */
export async function destroyOtherSessions(userId: number, keepSessionId?: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId, ...(keepSessionId ? { id: { not: keepSessionId } } : {}) } });
}

/* ---------- CSRF (synchronizer token pattern) ---------- */

export function verifyCsrf(session: SessionWithUser | null, submittedToken: unknown): boolean {
  if (!session || typeof submittedToken !== 'string') return false;
  const a = Buffer.from(submittedToken);
  const b = Buffer.from(session.csrfToken);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ---------- Password reset tokens (no email provider configured) ---------- */

export async function createPasswordResetToken(userId: number) {
  const id = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  await prisma.passwordResetToken.create({ data: { id, userId, expiresAt } });
  return { id, expiresAt };
}

export async function consumePasswordResetToken(token: string) {
  const row = await prisma.passwordResetToken.findUnique({ where: { id: token }, include: { user: true } });
  if (!row || row.usedAt || row.expiresAt.getTime() < Date.now()) return null;
  await prisma.passwordResetToken.update({ where: { id: token }, data: { usedAt: new Date() } });
  return row.user;
}
