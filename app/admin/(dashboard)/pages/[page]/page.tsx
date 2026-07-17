import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PageBlocksEditor from './PageBlocksEditor';

const VALID_PAGES = ['home', 'shop', 'about', 'contact'];
const PAGE_TITLES: Record<string, string> = { home: 'Home Page', shop: 'Shop Page', about: 'Our Story Page', contact: 'Contact Page' };

type Params = { params: Promise<{ page: string }> };

export default async function PageEditorPage({ params }: Params) {
  const { page } = await params;
  if (!VALID_PAGES.includes(page)) notFound();

  const blocks = await prisma.contentBlock.findMany({ where: { page }, orderBy: { position: 'asc' } });

  return (
    <>
      <h2 style={{ fontFamily: 'var(--a-font-serif)', fontSize: 22, marginBottom: 18 }}>{PAGE_TITLES[page]}</h2>
      <PageBlocksEditor page={page} blocks={blocks} />
    </>
  );
}
