import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';
import { requireApiSession, clientIpFromRequest } from '@/lib/adminGuard';
import { logAction } from '@/lib/audit';

export async function POST(request: Request) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  await destroySession();
  await logAction(result.session.user.username, 'logout', undefined, clientIpFromRequest(request));
  return NextResponse.json({ ok: true });
}
