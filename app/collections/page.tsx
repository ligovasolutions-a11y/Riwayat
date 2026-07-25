import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AIConsierge from '@/components/AIConsierge'
import CategoryEmptyState from '@/components/CategoryEmptyState'
import Link from 'next/link'
import { listCollections } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default function CollectionsPage() {
  const collections = listCollections().filter((c) => c.status === 'active')

  return (
    <main>
      <Navigation />
      <section className="relative pt-32 lg:pt-44 pb-16 lg:pb-24 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <p className="section-label mb-4">Curated For You</p>
        <h1 className="luxury-heading text-5xl lg:text-8xl text-rw-black leading-none mb-6">
          Our<br /><em className="italic">Collections</em>
        </h1>
        <p className="text-rw-gray font-sans font-light text-base lg:text-xl max-w-xl leading-relaxed">
          Every collection, curated by our team and kept up to date from the Riwaayat boutique.
        </p>
      </section>

      {collections.length > 0 ? (
        <section className="px-6 lg:px-12 pb-20 lg:pb-32 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {collections.map((c) => (
              <Link key={c.id} href={c.href || `/collections/${c.id}`} className="group block">
                <div className="relative overflow-hidden bg-rw-light mb-4" style={{ aspectRatio: '4/5' }}>
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rw-gray text-xs font-sans uppercase tracking-wider">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    {c.tag && <p className="text-rw-gold text-[10px] tracking-[0.3em] uppercase font-sans mb-1">{c.tag}</p>}
                    <h2 className="font-serif text-2xl font-light text-white mb-1">{c.name}</h2>
                    {c.subtitle && <p className="text-white/60 text-xs font-sans">{c.subtitle}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <CategoryEmptyState backHref="/" backLabel="Back to Home" />
      )}

      <Footer />
      <AIConsierge />
    </main>
  )
}
