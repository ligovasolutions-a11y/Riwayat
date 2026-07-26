import Link from 'next/link'
import { listPublishedProducts, slugify } from '@/lib/content'

export default function LuxuryWatches() {
  const watches = listPublishedProducts().filter((p) => p.category === 'Watches')
  if (watches.length === 0) return null

  const brands = Array.from(new Set(watches.map((w) => w.subcategory).filter(Boolean)))
  const featured = watches.slice(0, 3)

  return (
    <section className="py-20 lg:py-32 bg-rw-light">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-end mb-16 lg:mb-24">
          <div>
            <p className="section-label mb-4">Authorised Retailer</p>
            <h2 className="luxury-heading text-4xl lg:text-6xl xl:text-7xl text-rw-black leading-none">
              Timekeeping<br />as an <em className="italic">Art Form</em>
            </h2>
          </div>
          <div>
            <p className="text-rw-gray font-sans font-light text-base lg:text-lg leading-relaxed mb-8">
              We are proud authorised retailers of the world's most prestigious Swiss and luxury watch brands.
              Each timepiece in our collection is a testament to centuries of horological mastery.
            </p>
            <Link href="/watches" className="btn-dark">
              Explore All Watches
            </Link>
          </div>
        </div>

        {/* Brand bar */}
        {brands.length > 0 && (
          <div className="flex items-center gap-8 lg:gap-16 overflow-x-auto pb-4 mb-16 lg:mb-20 border-b border-rw-border">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/watches/${slugify(brand)}`}
                className="text-xs tracking-[0.3em] uppercase font-sans font-medium text-rw-gray hover:text-rw-black transition-colors whitespace-nowrap"
              >
                {brand}
              </Link>
            ))}
          </div>
        )}

        {/* Watch grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {featured.map((watch) => (
            <div key={watch.id} className="group cursor-pointer">
              <div className="relative overflow-hidden bg-white mb-5" style={{ aspectRatio: '1/1' }}>
                {watch.image && (
                  <img
                    src={watch.image}
                    alt={watch.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                {watch.subcategory && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-rw-black text-[9px] tracking-[0.2em] uppercase font-sans px-3 py-1">
                      {watch.subcategory}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href={`/get-a-quote?category=Watches&product=${encodeURIComponent(watch.name)}&brand=${encodeURIComponent(watch.subcategory)}&ref=${encodeURIComponent(watch.sku)}`} className="bg-rw-gold text-white text-[10px] tracking-[0.2em] uppercase font-sans px-4 py-2">
                    Enquire
                  </Link>
                </div>
              </div>
              <div>
                {watch.sku && (
                  <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray mb-1">Ref. {watch.sku}</p>
                )}
                <Link href={`/product/${watch.id}`}>
                  <h3 className="font-serif text-xl font-light text-rw-black mb-2 group-hover:text-rw-gold transition-colors">
                    {watch.name}
                  </h3>
                </Link>
                <p className="font-sans text-rw-black font-medium">{watch.price || 'Price on Request'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
