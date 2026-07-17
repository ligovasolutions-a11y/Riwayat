import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/adminGuard';
import { plainText, slugify } from '@/lib/sanitize';
import { ICON_KEYS } from '@/lib/icons';
import { logAction } from '@/lib/audit';

const schema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  icon: z.enum(ICON_KEYS as [string, ...string[]]).default('ring'),
  price: z.string().min(1).max(50),
  oldPrice: z.string().max(50).optional().nullable(),
  badge: z.string().max(50).optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  description: z.string().max(2000).optional().default(''),
  metals: z.array(z.string().max(50)).default([]),
  sizes: z.array(z.string().max(20)).default([]),
  stockNote: z.string().max(200).optional().default(''),
  detailsText: z.string().max(1000).optional().default(''),
  shippingText: z.string().max(1000).optional().default(''),
  careText: z.string().max(1000).optional().default(''),
  reviewCount: z.number().int().min(0).max(100000).default(0),
  image: z.string().max(200).optional().nullable(),
  featured: z.boolean().default(false),
  enabled: z.boolean().default(true),
});

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { position: 'asc' } });
  return NextResponse.json({ products });
}

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
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the product fields.', issues: parsed.error.issues }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.name) || `product-${Date.now()}`;
  let slug = baseSlug;
  let n = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const maxPos = await prisma.product.aggregate({ _max: { position: true } });

  const product = await prisma.product.create({
    data: {
      slug,
      name: plainText(parsed.data.name, 200),
      category: plainText(parsed.data.category, 100),
      icon: parsed.data.icon,
      price: plainText(parsed.data.price, 50),
      oldPrice: parsed.data.oldPrice ? plainText(parsed.data.oldPrice, 50) : null,
      badge: parsed.data.badge ? plainText(parsed.data.badge, 50) : null,
      rating: parsed.data.rating,
      description: plainText(parsed.data.description, 2000),
      metals: JSON.stringify(parsed.data.metals.map((m) => plainText(m, 50))),
      sizes: JSON.stringify(parsed.data.sizes.map((s) => plainText(s, 20))),
      stockNote: plainText(parsed.data.stockNote, 200),
      detailsText: plainText(parsed.data.detailsText, 1000),
      shippingText: plainText(parsed.data.shippingText, 1000),
      careText: plainText(parsed.data.careText, 1000),
      reviewCount: parsed.data.reviewCount,
      image: parsed.data.image || null,
      featured: parsed.data.featured,
      enabled: parsed.data.enabled,
      position: (maxPos._max.position ?? -1) + 1,
    },
  });

  await logAction(result.session.user.username, 'product_create', product.name);
  return NextResponse.json({ ok: true, product });
}
