import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getPublishedBlock } from '@/lib/content';
import Hero from '@/components/site/Hero';
import TrustStrip from '@/components/site/TrustStrip';
import CategoryGrid from '@/components/site/CategoryGrid';
import CollectionBanners from '@/components/site/CollectionBanners';
import TabList from '@/components/site/TabList';
import ProductCard from '@/components/site/ProductCard';
import StorySplit from '@/components/site/StorySplit';
import Testimonials from '@/components/site/Testimonials';
import NewsletterForm from '@/components/site/NewsletterForm';
import type { HeroBlock, TrustStripBlock, CategoriesBlock, CollectionsBlock, StoryBlock, TestimonialsBlock, NewsletterBlock } from '@/lib/blockTypes';
import {
  DEFAULT_HERO, DEFAULT_TRUST_STRIP, DEFAULT_CATEGORIES, DEFAULT_COLLECTIONS,
  DEFAULT_STORY, DEFAULT_TESTIMONIALS, DEFAULT_NEWSLETTER,
} from '@/lib/blockDefaults';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await prisma.seoMeta.findUnique({ where: { page: 'home' } });
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: { title: seo.title, description: seo.description, images: seo.ogImage ? [`/uploads/${seo.ogImage}`] : undefined },
  };
}

export default async function HomePage() {
  const [hero, trustStrip, categories, collections, story, testimonials, newsletter, featuredProducts] = await Promise.all([
    getPublishedBlock<HeroBlock>('home', 'hero'),
    getPublishedBlock<TrustStripBlock>('home', 'trust_strip'),
    getPublishedBlock<CategoriesBlock>('home', 'categories'),
    getPublishedBlock<CollectionsBlock>('home', 'collections'),
    getPublishedBlock<StoryBlock>('home', 'story'),
    getPublishedBlock<TestimonialsBlock>('home', 'testimonials'),
    getPublishedBlock<NewsletterBlock>('home', 'newsletter'),
    prisma.product.findMany({ where: { featured: true, enabled: true }, orderBy: { position: 'asc' } }),
  ]);

  return (
    <>
      <Hero hero={hero || DEFAULT_HERO} />
      <TrustStrip data={trustStrip || DEFAULT_TRUST_STRIP} />
      <CategoryGrid data={categories || DEFAULT_CATEGORIES} />
      <CollectionBanners data={collections || DEFAULT_COLLECTIONS} />

      <section className="section">
        <div className="container">
          <div className="product-toolbar">
            <div className="section-heading mt-0" style={{ textAlign: 'left', marginBottom: 0 }}>
              <span className="eyebrow">Handpicked For You</span>
              <h2>Bestsellers</h2>
            </div>
            <TabList tabs={['All', 'Rings', 'Necklaces', 'Earrings', 'Bangles']} />
          </div>
          <div className="product-grid">
            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center" style={{ marginTop: 48 }}>
            <Link href="/shop" className="btn btn-primary">View All Products</Link>
          </div>
        </div>
      </section>

      <StorySplit data={story || DEFAULT_STORY} />
      <Testimonials data={testimonials || DEFAULT_TESTIMONIALS} />
      <NewsletterForm data={newsletter || DEFAULT_NEWSLETTER} />
    </>
  );
}
