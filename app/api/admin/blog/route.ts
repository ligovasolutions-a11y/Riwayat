import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/adminGuard';
import { plainText, richTextBlock, slugify } from '@/lib/sanitize';
import { logAction } from '@/lib/audit';

const schema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional().default(''),
  contentHtml: z.string().max(50000).optional().default(''),
  coverImage: z.string().max(200).optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
  seoTitle: z.string().max(200).optional().default(''),
  seoDescription: z.string().max(300).optional().default(''),
});

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json({ posts });
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
  if (!parsed.success) return NextResponse.json({ error: 'Please check the post fields.' }, { status: 400 });

  const baseSlug = slugify(parsed.data.title) || `post-${Date.now()}`;
  let slug = baseSlug;
  let n = 1;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title: plainText(parsed.data.title, 200),
      excerpt: plainText(parsed.data.excerpt, 500),
      contentHtml: richTextBlock(parsed.data.contentHtml),
      coverImage: parsed.data.coverImage || null,
      status: parsed.data.status,
      seoTitle: plainText(parsed.data.seoTitle, 200),
      seoDescription: plainText(parsed.data.seoDescription, 300),
      publishedAt: parsed.data.status === 'published' ? new Date() : null,
    },
  });

  await logAction(result.session.user.username, 'blog_create', post.title);
  return NextResponse.json({ ok: true, post });
}
