import { prisma } from '@/lib/prisma';
import PageBlocksEditor from '../pages/[page]/PageBlocksEditor';

export default async function FooterAdminPage() {
  const blocks = await prisma.contentBlock.findMany({ where: { page: 'global', blockKey: 'footer' } });
  return (
    <>
      <h2 style={{ fontFamily: 'var(--a-font-serif)', fontSize: 22, marginBottom: 18 }}>Footer</h2>
      <PageBlocksEditor page="global" blocks={blocks} />
    </>
  );
}
