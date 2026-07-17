import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/adminGuard';
import { processAndStoreImage, UploadError } from '@/lib/upload';
import { plainText } from '@/lib/sanitize';
import { logAction } from '@/lib/audit';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const media = await prisma.mediaAsset.findMany({
    where: q ? { originalName: { contains: q } } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ media });
}

export async function POST(request: Request) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid upload.' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  try {
    const stored = await processAndStoreImage(file);
    const asset = await prisma.mediaAsset.create({
      data: {
        filename: stored.filename,
        originalName: plainText(stored.originalName, 200),
        mime: stored.mime,
        size: stored.size,
        width: stored.width,
        height: stored.height,
        uploadedBy: result.session.user.username,
      },
    });
    await logAction(result.session.user.username, 'media_upload', asset.originalName);
    return NextResponse.json({ ok: true, asset });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error('Upload failed:', err);
    return NextResponse.json({ error: 'Upload failed. Please try a different file.' }, { status: 500 });
  }
}
