'use client'

import Link from 'next/link'

const brands = ['Rolex', 'Omega', 'TAG Heuer', 'Longines', 'IWC', 'Tissot']

const featuredWatches = [
  {
    name: 'Rolex Submariner',
    price: '₹12,50,000',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=85&auto=format&fit=crop',
    brand: 'Rolex',
    ref: 'Ref. 126610LN',
  },
  {
    name: 'Omega Seamaster',
    price: '₹5,80,000',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=85&auto=format&fit=crop',
    brand: 'Omega',
    ref: 'Ref. 210.30.42',
  },
  {
    name: 'TAG Heuer Carrera',
    price: '₹3,20,000',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=85&auto=format&fit=crop',
    brand: 'TAG Heuer',
    ref: 'Ref. CBN2A1A',
  },
]

export default function LuxuryWatches() {
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
        <div className="flex items-center gap-8 lg:gap-16 overflow-x-auto pb-4 mb-16 lg:mb-20 border-b border-rw-border">
          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/watches/${brand.toLowerCase().replace(' ', '-')}`}
              className="text-xs tracking-[0.3em] uppercase font-sans font-medium text-rw-gray hover:text-rw-black transition-colors whitespace-nowrap"
            >
              {brand}
            </Link>
          ))}
        </div>

        {/* Watch grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {featuredWatches.map((watch) => (
            <div key={watch.name} className="group cursor-pointer">
              <div className="relative overflow-hidden bg-white mb-5" style={{ aspectRatio: '1/1' }}>
                <img
                  src={watch.image}
                  alt={watch.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-rw-black text-[9px] tracking-[0.2em] uppercase font-sans px-3 py-1">
                    {watch.brand}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href="/appointments" className="bg-rw-gold text-white text-[10px] tracking-[0.2em] uppercase font-sans px-4 py-2">
                    Enquire
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray mb-1">{watch.ref}</p>
                <h3 className="font-serif text-xl font-light text-rw-black mb-2 group-hover:text-rw-gold transition-colors">
                  {watch.name}
                </h3>
                <p className="font-sans text-rw-black font-medium">{watch.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
