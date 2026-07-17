import { prisma } from '@/lib/prisma';
import PageBlocksEditor from '../pages/[page]/PageBlocksEditor';

export default async function ContactInfoAdminPage() {
  const blocks = await prisma.contentBlock.findMany({ where: { page: 'global', blockKey: 'contact_info' } });
  return (
    <>
      <h2 style={{ fontFamily: 'var(--a-font-serif)', fontSize: 22, marginBottom: 18 }}>Contact Information</h2>
      <PageBlocksEditor page="global" blocks={blocks} />
    </>
  );
}
