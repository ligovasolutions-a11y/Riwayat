import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/adminGuard';
import { plainText, richTextBlock } from '@/lib/sanitize';
import { logAction } from '@/lib/audit';

const schema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500),
  contentHtml: z.string().max(50000),
  coverImage: z.string().max(200).optional().nullable(),
  status: z.enum(['draft', 'published']),
  seoTitle: z.string().max(200),
  seoDescription: z.string().max(300),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });

  const existing = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!existing) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Please check the post fields.' }, { status: 400 });

  const becomingPublished = parsed.data.status === 'published' && existing.status !== 'published';

  const post = await prisma.blogPost.update({
    where: { id: postId },
    data: {
      title: plainText(parsed.data.title, 200),
      excerpt: plainText(parsed.data.excerpt, 500),
      contentHtml: richTextBlock(parsed.data.contentHtml),
      coverImage: parsed.data.coverImage || null,
      status: parsed.data.status,
      seoTitle: plainText(parsed.data.seoTitle, 200),
      seoDescription: plainText(parsed.data.seoDescription, 300),
      publishedAt: becomingPublished ? new Date() : existing.publishedAt,
    },
  });

  await logAction(result.session.user.username, 'blog_update', post.title);
  return NextResponse.json({ ok: true, post });
}

export async function DELETE(request: Request, { params }: Params) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });

  const existing = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!existing) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });

  await prisma.blogPost.delete({ where: { id: postId } });
  await logAction(result.session.user.username, 'blog_delete', existing.title);
  return NextResponse.json({ ok: true });
}
