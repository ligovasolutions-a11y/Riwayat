import { prisma } from './prisma';

/* Public-facing reads always use publishedJson — draft edits never
   appear on the live site until an admin explicitly publishes them. */
export async function getPublishedBlock<T>(page: string, blockKey: string): Promise<T | null> {
  const block = await prisma.contentBlock.findUnique({ where: { page_blockKey: { page, blockKey } } });
  if (!block || !block.enabled) return null;
  try {
    return JSON.parse(block.publishedJson) as T;
  } catch {
    return null;
  }
}

export async function getPublishedBlocksForPage(page: string) {
  return prisma.contentBlock.findMany({ where: { page }, orderBy: { position: 'asc' } });
}

export function parseBlock<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
