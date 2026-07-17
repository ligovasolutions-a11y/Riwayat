import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import './globals.css';

const DEFAULT_FAVICON = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E%F0%9F%92%8D%3C/text%3E%3C/svg%3E';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } }).catch(() => null);
  return {
    metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
    title: { default: settings?.siteName || 'Riwayat Jewels', template: `%s | ${settings?.siteName || 'Riwayat Jewels'}` },
    icons: { icon: settings?.favicon ? `/uploads/${settings.favicon}` : DEFAULT_FAVICON },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } }).catch(() => null);

  // Theme colors are admin-editable (Settings page); override the CSS
  // custom properties from the DB value only when it differs from the
  // compiled-in default, so the design stays identical until changed.
  const themeVars = settings
    ? `:root{--gold:${settings.colorGold};--maroon:${settings.colorMaroon};--cream:${settings.colorCream};--black:${settings.colorBlack};}`
    : '';

  return (
    <html lang="en">
      <head>{themeVars && <style dangerouslySetInnerHTML={{ __html: themeVars }} />}</head>
      <body>{children}</body>
    </html>
  );
}
