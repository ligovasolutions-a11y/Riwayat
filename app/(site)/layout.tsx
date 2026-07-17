import { headers } from 'next/headers';
import { getPublishedBlock } from '@/lib/content';
import { prisma } from '@/lib/prisma';
import { safeJsonLd } from '@/lib/sanitize';
import { CartProvider } from '@/components/site/CartProvider';
import SiteChrome from '@/components/site/SiteChrome';
import SiteFooter from '@/components/site/SiteFooter';
import type { NavBlock, FooterBlock, ContactInfoBlock } from '@/lib/blockTypes';
import { DEFAULT_NAV, DEFAULT_FOOTER, DEFAULT_CONTACT_INFO } from '@/lib/blockDefaults';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [nav, footer, contactInfo, settings] = await Promise.all([
    getPublishedBlock<NavBlock>('global', 'nav'),
    getPublishedBlock<FooterBlock>('global', 'footer'),
    getPublishedBlock<ContactInfoBlock>('global', 'contact_info'),
    prisma.siteSettings.findUnique({ where: { id: 1 } }).catch(() => null),
  ]);

  const navData = nav || DEFAULT_NAV;
  const footerData = footer || DEFAULT_FOOTER;
  const contactData = contactInfo || DEFAULT_CONTACT_INFO;
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const nonce = (await headers()).get('x-nonce') || undefined;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: settings?.siteName || `${navData.logoLine1} ${navData.logoLine2}`,
    url: siteUrl,
    telephone: contactData.phone || undefined,
    email: contactData.email || undefined,
    address: contactData.address ? { '@type': 'PostalAddress', streetAddress: contactData.address } : undefined,
  };

  return (
    <CartProvider>
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationSchema) }}
      />
      <SiteChrome nav={navData} logoImage={settings?.logoImage} />
      {children}
      <SiteFooter footer={footerData} nav={navData} />
    </CartProvider>
  );
}
