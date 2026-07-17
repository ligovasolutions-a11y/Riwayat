import 'server-only';
import { NextResponse } from 'next/server';
import { getSession, verifyCsrf, type SessionWithUser } from './auth';

/* For Route Handlers under /api/admin/*. Every mutating request must
   supply a valid session AND (for non-GET methods) a matching CSRF
   token, or it's rejected. Returns the session on success, or an
   NextResponse to return immediately on failure. */
export async function requireApiSession(
  request: Request
): Promise<{ session: SessionWithUser } | { error: NextResponse }> {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: 'Not authenticated.' }, { status: 401 }) };
  }

  // All admin-dashboard client code (JSON fetches and multipart file
  // uploads alike) sends the CSRF token as this header — kept out of
  // the body so it works uniformly regardless of payload shape.
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const token = request.headers.get('x-csrf-token') || undefined;
    if (!verifyCsrf(session, token)) {
      return { error: NextResponse.json({ error: 'Invalid or missing CSRF token.' }, { status: 403 }) };
    }
  }

  return { session };
}

export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
