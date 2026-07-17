import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/adminGuard';
import { logAction } from '@/lib/audit';

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, { params }: Params) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  const { id } = await params;
  const enquiryId = Number(id);
  if (!Number.isInteger(enquiryId)) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });

  const existing = await prisma.enquiry.findUnique({ where: { id: enquiryId } });
  if (!existing) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  await prisma.enquiry.delete({ where: { id: enquiryId } });
  await logAction(result.session.user.username, 'enquiry_delete', `${existing.name} <${existing.email}>`);
  return NextResponse.json({ ok: true });
}
