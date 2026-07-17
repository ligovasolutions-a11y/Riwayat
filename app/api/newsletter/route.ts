import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { plainText } from '@/lib/sanitize';
import { rateLimit, clientIp } from '@/lib/rateLimit';

const schema = z.object({ email: z.string().email().max(200) });

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`newsletter:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  await prisma.enquiry.create({
    data: { name: 'Newsletter Signup', email: plainText(parsed.data.email, 200), message: '', source: 'newsletter' },
  });

  return NextResponse.json({ ok: true });
}
