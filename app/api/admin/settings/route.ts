import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireApiSession } from '@/lib/adminGuard';
import { plainText } from '@/lib/sanitize';
import { logAction } from '@/lib/audit';

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex color like #b7913f');

const schema = z.object({
  siteName: z.string().min(1).max(100),
  logoText1: z.string().min(1).max(50),
  logoText2: z.string().min(1).max(50),
  logoImage: z.string().max(200).optional().nullable(),
  favicon: z.string().max(200).optional().nullable(),
  colorGold: hexColor,
  colorMaroon: hexColor,
  colorCream: hexColor,
  colorBlack: hexColor,
});

export async function PATCH(request: Request) {
  const result = await requireApiSession(request);
  if ('error' in result) return result.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid settings.' }, { status: 400 });

  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      siteName: plainText(parsed.data.siteName, 100),
      logoText1: plainText(parsed.data.logoText1, 50),
      logoText2: plainText(parsed.data.logoText2, 50),
      logoImage: parsed.data.logoImage || null,
      favicon: parsed.data.favicon || null,
      colorGold: parsed.data.colorGold,
      colorMaroon: parsed.data.colorMaroon,
      colorCream: parsed.data.colorCream,
      colorBlack: parsed.data.colorBlack,
    },
    update: {
      siteName: plainText(parsed.data.siteName, 100),
      logoText1: plainText(parsed.data.logoText1, 50),
      logoText2: plainText(parsed.data.logoText2, 50),
      logoImage: parsed.data.logoImage || null,
      favicon: parsed.data.favicon || null,
      colorGold: parsed.data.colorGold,
      colorMaroon: parsed.data.colorMaroon,
      colorCream: parsed.data.colorCream,
      colorBlack: parsed.data.colorBlack,
    },
  });

  await logAction(result.session.user.username, 'settings_update');
  return NextResponse.json({ ok: true, settings });
}
