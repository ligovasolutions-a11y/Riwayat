import { prisma } from '@/lib/prisma';
import MediaLibraryClient from './MediaLibraryClient';

export default async function MediaLibraryPage() {
  const media = await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
  return <MediaLibraryClient initial={media.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))} />;
}
