import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/adminGuard';
import { plainText } from '@/lib/sanitize';
import { logAction } from '@/lib/audit';

const schema = z.object({
  title: z.string().max(200),
  description: z.string().max(300),
  keywords: z.string().max(300),
  ogImage: z.string().max(200).optional().nullable(),
});

const VALID_PAGES = ['home', 'shop', 'about', 'contact', 'blog'];

type Params = { params: Promise<{ page: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  const { page } = await params;
  if (!VALID_PAGES.includes(page)) return NextResponse.json({ error: 'Invalid page.' }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Please check the SEO fields.' }, { status: 400 });

  const seo = await prisma.seoMeta.upsert({
    where: { page },
    create: {
      page,
      title: plainText(parsed.data.title, 200),
      description: plainText(parsed.data.description, 300),
      keywords: plainText(parsed.data.keywords, 300),
      ogImage: parsed.data.ogImage || null,
    },
    update: {
      title: plainText(parsed.data.title, 200),
      description: plainText(parsed.data.description, 300),
      keywords: plainText(parsed.data.keywords, 300),
      ogImage: parsed.data.ogImage || null,
    },
  });

  await logAction(result.session.user.username, 'seo_update', page);
  return NextResponse.json({ ok: true, seo });
}
