import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/adminGuard';
import { logAction } from '@/lib/audit';

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(request: Request) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  const { searchParams } = new URL(request.url);
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } });

  if (searchParams.get('format') === 'csv') {
    const header = ['Date', 'Source', 'Name', 'Email', 'Phone', 'Message'];
    const rows = enquiries.map((e) => [
      e.createdAt.toISOString(), e.source, e.name, e.email, e.phone || '', e.message,
    ].map(csvEscape).join(','));
    const csv = [header.join(','), ...rows].join('\r\n');

    await logAction(result.session.user.username, 'enquiries_export_csv', `${enquiries.length} rows`);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="riwayat-enquiries-${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json({ enquiries });
}
