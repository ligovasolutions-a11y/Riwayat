import { prisma } from '@/lib/prisma';
import SeoClient from './SeoClient';

const PAGES = ['home', 'shop', 'about', 'contact', 'blog'];

export default async function SeoPage() {
  const existing = await prisma.seoMeta.findMany();
  const byPage = new Map(existing.map((s) => [s.page, s]));
  const rows = PAGES.map((page) => {
    const found = byPage.get(page);
    return { page, title: found?.title || '', description: found?.description || '', keywords: found?.keywords || '', ogImage: found?.ogImage || null };
  });
  return <SeoClient rows={rows} />;
}
