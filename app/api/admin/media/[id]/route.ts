import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/adminGuard';
import { deleteStoredFile } from '@/lib/upload';
import { logAction } from '@/lib/audit';

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, { params }: Params) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  const { id } = await params;
  const assetId = Number(id);
  if (!Number.isInteger(assetId)) return NextResponse.json({ error: 'Invalid media id.' }, { status: 400 });

  const asset = await prisma.mediaAsset.findUnique({ where: { id: assetId } });
  if (!asset) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  // Refuse to delete an image that's still referenced somewhere, so a
  // stray delete doesn't leave a broken <img> on the live site.
  const [inUseByProduct, inUseByBlogCover] = await Promise.all([
    prisma.product.findFirst({ where: { image: asset.filename } }),
    prisma.blogPost.findFirst({ where: { coverImage: asset.filename } }),
  ]);
  if (inUseByProduct || inUseByBlogCover) {
    return NextResponse.json({ error: 'This image is still in use by a product or blog post. Remove it there first.' }, { status: 409 });
  }

  await prisma.mediaAsset.delete({ where: { id: assetId } });
  await deleteStoredFile(asset.filename);
  await logAction(result.session.user.username, 'media_delete', asset.originalName);
  return NextResponse.json({ ok: true });
}
