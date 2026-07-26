import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AIConsierge from '@/components/AIConsierge'
import Link from 'next/link'
import { listActiveJewelleryCategories, listPublishedProductsBySubcategorySlug, slugify } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default function JewelleryPage() {
  const categories = listActiveJewelleryCategories()

  return (
    <main>
      <Navigation />
      {/* Hero */}
      <section className="relative pt-32 lg:pt-44 pb-16 lg:pb-24 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <p className="section-label mb-4">Handcrafted Excellence</p>
        <h1 className="luxury-heading text-5xl lg:text-8xl xl:text-9xl text-rw-black leading-none mb-6">
          Our<br /><em className="italic">Jewellery</em>
        </h1>
        <p className="text-rw-gray font-sans font-light text-base lg:text-xl max-w-xl leading-relaxed">
          Six decades of Indian goldsmithing tradition, expressed through contemporary design.
          Explore collections crafted for every milestone of your life.
        </p>
      </section>

      {/* Categories grid */}
      <section className="px-6 lg:px-12 pb-20 lg:pb-32 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => {
            const slug = slugify(cat.name)
            const count = listPublishedProductsBySubcategorySlug('Jewellery', slug).length
            return (
              <Link key={cat.id} href={`/jewellery/${slug}`} className="group block">
                <div className="relative overflow-hidden mb-4 bg-rw-light" style={{ aspectRatio: '3/4' }}>
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rw-gray text-xs font-sans uppercase tracking-wider">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="font-serif text-2xl font-light text-white mb-1">{cat.name}</h2>
                    <p className="text-white/60 text-xs font-sans tracking-wider">
                      {count > 0 ? `${count} piece${count === 1 ? '' : 's'}` : 'Coming soon'}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <Footer />
      <AIConsierge />
    </main>
  )
}
