/** @type {import('next').NextConfig} */

// Content-Security-Policy is set per-request in middleware.ts (it needs a
// fresh nonce every request for Next.js's own hydration scripts). The
// headers below are static and don't need a nonce, so they stay here.
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  // Only meaningful once the site is actually served over HTTPS in
  // production, but safe to always send — browsers ignore it over plain
  // HTTP on localhost/dev.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // don't leak "X-Powered-By: Next.js"
  images: {
    // Uploaded/optimized images are always served from our own /uploads.
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
