import { prisma } from '@/lib/prisma';
import EnquiriesClient from './EnquiriesClient';

export default async function EnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } });
  return <EnquiriesClient enquiries={enquiries.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() }))} />;
}
