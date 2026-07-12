'use client'

import Link from 'next/link'

const collections = [
  {
    id: 1,
    title: 'Bridal Couture',
    subtitle: 'For the most precious day of your life',
    tag: 'New Season',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=85&auto=format&fit=crop',
    href: '/jewellery/bridal',
    size: 'large',
  },
  {
    id: 2,
    title: 'Swiss Timepieces',
    subtitle: 'Precision engineering meets artistry',
    tag: 'Authorised Dealer',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85&auto=format&fit=crop',
    href: '/watches',
    size: 'large',
  },
  {
    id: 3,
    title: 'Diamond Atelier',
    subtitle: 'GIA certified brilliance',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=85&auto=format&fit=crop',
    href: '/jewellery/diamond',
    size: 'small',
  },
  {
    id: 4,
    title: 'Heritage Gold',
    subtitle: 'Handcrafted Indian traditions',
    tag: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=85&auto=format&fit=crop',
    href: '/jewellery/gold',
    size: 'small',
  },
]

export default function FeaturedCollections() {
  return (
    <section className="py-20 lg:py-32 px-6 lg:px-12 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-12 lg:mb-16">
        <div>
          <p className="section-label mb-3">Curated For You</p>
          <h2 className="luxury-heading text-4xl lg:text-6xl xl:text-7xl text-rw-black leading-none">
            Featured<br /><em className="italic">Collections</em>
          </h2>
        </div>
        <Link
          href="/collections"
          className="hidden lg:block text-xs tracking-widest uppercase font-sans text-rw-black hover:text-rw-gold transition-colors border-b border-rw-black hover:border-rw-gold pb-1"
        >
          View All Collections
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Large cards */}
        <div className="group relative overflow-hidden cursor-pointer" style={{ aspectRatio: '4/5' }}>
          <img
            src={collections[0].image}
            alt={collections[0].title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <span className="text-rw-gold text-[10px] tracking-[0.3em] uppercase font-sans">{collections[0].tag}</span>
            <h3 className="font-serif text-3xl lg:text-4xl font-light text-white mt-2 mb-1">{collections[0].title}</h3>
            <p className="text-white/70 text-sm font-sans mb-4">{collections[0].subtitle}</p>
            <Link
              href={collections[0].href}
              className="text-white text-xs tracking-[0.25em] uppercase font-sans border-b border-white/50 hover:border-rw-gold hover:text-rw-gold transition-colors pb-1"
            >
              Explore Collection
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:gap-6">
          {/* Second large card */}
          <div className="group relative overflow-hidden cursor-pointer flex-1" style={{ minHeight: '300px' }}>
            <img
              src={collections[1].image}
              alt={collections[1].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <span className="text-rw-gold text-[10px] tracking-[0.3em] uppercase font-sans">{collections[1].tag}</span>
              <h3 className="font-serif text-3xl lg:text-4xl font-light text-white mt-2 mb-1">{collections[1].title}</h3>
              <p className="text-white/70 text-sm font-sans mb-4">{collections[1].subtitle}</p>
              <Link
                href={collections[1].href}
                className="text-white text-xs tracking-[0.25em] uppercase font-sans border-b border-white/50 hover:border-rw-gold hover:text-rw-gold transition-colors pb-1"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          {/* Two small cards */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {collections.slice(2).map((col) => (
              <div key={col.id} className="group relative overflow-hidden cursor-pointer" style={{ aspectRatio: '1/1' }}>
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <span className="text-rw-gold text-[9px] tracking-[0.3em] uppercase font-sans">{col.tag}</span>
                  <h3 className="font-serif text-xl font-light text-white mt-1 mb-1">{col.title}</h3>
                  <Link
                    href={col.href}
                    className="text-white/80 text-[10px] tracking-[0.2em] uppercase font-sans hover:text-rw-gold transition-colors"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden mt-8 text-center">
        <Link href="/collections" className="btn-outline-gold">
          View All Collections
        </Link>
      </div>
    </section>
  )
}
