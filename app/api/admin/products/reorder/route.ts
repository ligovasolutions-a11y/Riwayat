import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/adminGuard';

const schema = z.object({ order: z.array(z.number().int()).max(1000) });

export async function POST(request: Request) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid order data.' }, { status: 400 });

  await prisma.$transaction(
    parsed.data.order.map((id, index) => prisma.product.update({ where: { id }, data: { position: index } }))
  );

  return NextResponse.json({ ok: true });
}
