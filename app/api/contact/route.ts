import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { plainText } from '@/lib/sanitize';
import { rateLimit, clientIp } from '@/lib/rateLimit';

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().default(''),
  message: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000); // 5 submissions / 10 min / IP
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
    return NextResponse.json({ error: 'Please fill in all required fields correctly.' }, { status: 400 });
  }

  await prisma.enquiry.create({
    data: {
      name: plainText(parsed.data.name, 200),
      email: plainText(parsed.data.email, 200),
      phone: plainText(parsed.data.phone, 40),
      message: plainText(parsed.data.message, 5000),
      source: 'contact',
    },
  });

  return NextResponse.json({ ok: true });
}
