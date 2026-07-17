import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/*
 * Runs on the Edge runtime (no Prisma/filesystem access here — that's
 * why auth is NOT checked in this file; see lib/adminGuard.ts and
 * app/admin/(dashboard)/layout.tsx for the real auth gate, which needs
 * the Node.js runtime that Prisma requires).
 *
 * This middleware's only job is issuing a fresh CSP nonce per request.
 * Next.js detects the nonce in the CSP response header and automatically
 * applies it to the script tags it injects for hydration, so script-src
 * can stay nonce-only (no 'unsafe-inline') without breaking the app.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // React's development mode uses eval() for debugging (stack trace
  // reconstruction) and never does in production builds — so
  // 'unsafe-eval' is scoped to dev only, production stays nonce-only.
  const scriptSrc = process.env.NODE_ENV === 'production'
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`;

  const directives = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  // Production-only: Safari (unlike Chrome/Firefox) applies this directive
  // even on http://localhost, silently rewriting every CSS/JS asset request
  // to https:// — which the plain-http dev server can't answer, so local
  // development renders as an unstyled page. In production the site sits
  // behind HTTPS anyway, which is where this directive belongs.
  if (process.env.NODE_ENV === 'production') {
    directives.push('upgrade-insecure-requests');
  }

  const csp = directives.join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [
    // Skip static assets so the nonce work only happens on page/API requests.
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
