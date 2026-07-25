import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AIConsierge from '@/components/AIConsierge'
import CategoryEmptyState from '@/components/CategoryEmptyState'
import Link from 'next/link'
import { listCollections, slugify, humanizeSlug } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const collection = listCollections().find(
    (c) => c.status === 'active' && (slugify(c.name) === params.slug || String(c.id) === params.slug)
  )
  const title = collection?.name ?? humanizeSlug(params.slug)
  const subtitle = collection?.subtitle

  return (
    <main>
      <Navigation />
      <section className="relative pt-32 lg:pt-44 pb-12 lg:pb-16 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <p className="section-label mb-4">Collection</p>
        <h1 className="luxury-heading text-4xl lg:text-7xl text-rw-black leading-none mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-rw-gray font-sans font-light text-base lg:text-xl max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </section>

      {collection?.image && (
        <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto mb-12 lg:mb-16">
          <div className="overflow-hidden" style={{ aspectRatio: '21/9' }}>
            <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
          </div>
        </section>
      )}

      {collection && collection.href && collection.href !== `/collections/${params.slug}` ? (
        <section className="px-6 lg:px-12 pb-20 lg:pb-32 max-w-screen-2xl mx-auto text-center">
          <Link href={collection.href} className="btn-gold">Shop This Collection</Link>
        </section>
      ) : (
        <CategoryEmptyState backHref="/collections" backLabel="Browse All Collections" />
      )}

      <Footer />
      <AIConsierge />
    </main>
  )
}
