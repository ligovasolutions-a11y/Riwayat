import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/adminGuard';
import { plainText } from '@/lib/sanitize';
import { deleteStoredFile } from '@/lib/upload';
import { ICON_KEYS } from '@/lib/icons';
import { logAction } from '@/lib/audit';

const schema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  icon: z.enum(ICON_KEYS as [string, ...string[]]),
  price: z.string().min(1).max(50),
  oldPrice: z.string().max(50).optional().nullable(),
  badge: z.string().max(50).optional().nullable(),
  rating: z.number().int().min(1).max(5),
  description: z.string().max(2000),
  metals: z.array(z.string().max(50)),
  sizes: z.array(z.string().max(20)),
  stockNote: z.string().max(200),
  detailsText: z.string().max(1000),
  shippingText: z.string().max(1000),
  careText: z.string().max(1000),
  reviewCount: z.number().int().min(0).max(100000),
  image: z.string().max(200).optional().nullable(),
  featured: z.boolean(),
  enabled: z.boolean(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 });

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

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

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
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
    },
  });

  // If the image was changed/removed, delete the old uploaded file so
  // media doesn't accumulate unreferenced on disk.
  if (existing.image && existing.image !== product.image) {
    deleteStoredFile(existing.image).catch(() => undefined);
  }

  await logAction(result.session.user.username, 'product_update', product.name);
  return NextResponse.json({ ok: true, product });
}

export async function DELETE(request: Request, { params }: Params) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 });

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

  await prisma.product.delete({ where: { id: productId } });
  if (existing.image) await deleteStoredFile(existing.image).catch(() => undefined);

  await logAction(result.session.user.username, 'product_delete', existing.name);
  return NextResponse.json({ ok: true });
}
