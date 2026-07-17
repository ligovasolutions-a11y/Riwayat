import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/adminGuard';
import { logAction } from '@/lib/audit';

const schema = z.object({
  draftJson: z.string().max(200000).optional(),
  enabled: z.boolean().optional(),
  action: z.enum(['publish', 'discard']).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  const { id } = await params;
  const blockId = Number(id);
  if (!Number.isInteger(blockId)) return NextResponse.json({ error: 'Invalid block id.' }, { status: 400 });

  const block = await prisma.contentBlock.findUnique({ where: { id: blockId } });
  if (!block) return NextResponse.json({ error: 'Block not found.' }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data.' }, { status: 400 });

  if (parsed.data.draftJson) {
    try {
      JSON.parse(parsed.data.draftJson);
    } catch {
      return NextResponse.json({ error: 'Malformed content data.' }, { status: 400 });
    }
  }

  const data: { draftJson?: string; publishedJson?: string; enabled?: boolean; updatedBy: string } = {
    updatedBy: result.session.user.username,
  };
  if (parsed.data.draftJson !== undefined) data.draftJson = parsed.data.draftJson;
  if (parsed.data.enabled !== undefined) data.enabled = parsed.data.enabled;

  if (parsed.data.action === 'publish') {
    data.publishedJson = data.draftJson ?? block.draftJson;
  } else if (parsed.data.action === 'discard') {
    data.draftJson = block.publishedJson;
  }

  const updated = await prisma.contentBlock.update({ where: { id: blockId }, data });

  await logAction(
    result.session.user.username,
    parsed.data.action ? `block_${parsed.data.action}` : 'block_save_draft',
    `${block.page}/${block.blockKey}`,
  );

  return NextResponse.json({ ok: true, block: updated });
}
