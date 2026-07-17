import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { IconGlyph } from '@/lib/icons';
import { safeJsonLd } from '@/lib/sanitize';
import ProductCard from '@/components/site/ProductCard';
import ProductOptions from '@/components/site/ProductOptions';
import Accordion from '@/components/site/Accordion';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: `${product.name} | Riwayat Jewels`,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: product.image ? [`/uploads/${product.image}`] : undefined },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.enabled) notFound();

  const related = await prisma.product.findMany({
    where: { enabled: true, id: { not: product.id } },
    orderBy: { position: 'asc' },
    take: 4,
  });

  const metals: string[] = JSON.parse(product.metals || '[]');
  const sizes: string[] = JSON.parse(product.sizes || '[]');
  const nonce = (await headers()).get('x-nonce') || undefined;
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const numericPrice = product.price.replace(/[^0-9.]/g, '') || '0';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image ? `${siteUrl}/uploads/${product.image}` : undefined,
    category: product.category,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: numericPrice,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/product/${product.slug}`,
    },
    aggregateRating: product.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: safeJsonLd(productSchema) }}
      />
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container">
          <div className="breadcrumb" style={{ color: 'var(--text-muted)', marginBottom: 30 }}>
            <Link href="/">Home</Link> / <Link href="/shop">{product.category}</Link> / {product.name}
          </div>

          <div className="product-detail">
            <div>
              <div className="gallery-main">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/uploads/${product.image}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <IconGlyph name={product.icon} />
                )}
              </div>
              <div className="gallery-thumbs">
                <div className="thumb active"><IconGlyph name={product.icon} /></div>
                <div className="thumb"><IconGlyph name={product.icon} /></div>
                <div className="thumb"><IconGlyph name={product.icon} /></div>
                <div className="thumb"><IconGlyph name={product.icon} /></div>
              </div>
            </div>

            <div className="pd-info">
              <p className="cat">{product.category}</p>
              <h1>{product.name}</h1>
              <div className="stars">
                {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}{' '}
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>({product.reviewCount} reviews)</span>
              </div>
              <div className="price" style={{ marginTop: 14 }}>
                {product.oldPrice && <span className="old">{product.oldPrice}</span>}
                <span className="now">{product.price}</span>
              </div>
              <p className="desc">{product.description}</p>

              <ProductOptions metals={metals} sizes={sizes} stockNote={product.stockNote} />

              <ul className="trust-list">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /></svg> BIS Hallmarked gold &amp; IGI certified diamonds</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="7" width="15" height="11" rx="1" /><path d="M17 10h3l2 3v5h-5z" /><circle cx="7" cy="19" r="1.6" /><circle cx="18" cy="19" r="1.6" /></svg> Free insured shipping across India</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12a9 9 0 1 1 3 6.7" /><path d="M3 17v-4h4" /></svg> 15-day easy exchange</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" /></svg> Lifetime maintenance &amp; certification</li>
              </ul>

              <Accordion
                items={[
                  { title: 'Product Details', content: product.detailsText },
                  { title: 'Shipping & Returns', content: product.shippingText },
                  { title: 'Care Instructions', content: product.careText },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">You May Also Like</span>
              <h2>Complete The Look</h2>
            </div>
            <div className="product-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} linked />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
