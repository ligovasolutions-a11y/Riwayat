'use client'

import Link from 'next/link'

const timeline = [
  { year: '1974', event: 'Founded in Mumbai with a single vision: to bring world-class jewellery to India.' },
  { year: '1988', event: 'Expanded to watches — becoming one of the first authorised Rolex dealers in India.' },
  { year: '2001', event: 'Opened our flagship boutique on Mumbai\'s most prestigious shopping avenue.' },
  { year: '2015', event: 'Launched our bridal couture division, crafting dreams for 500+ brides a year.' },
  { year: '2024', event: 'Celebrating 50 years of excellence with our Golden Jubilee Collection.' },
]

export default function Heritage() {
  return (
    <section className="py-20 lg:py-32 px-6 lg:px-12 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left content */}
        <div>
          <p className="section-label mb-4">Est. 1974</p>
          <h2 className="luxury-heading text-4xl lg:text-6xl xl:text-7xl text-rw-black leading-none mb-8">
            A Legacy of<br /><em className="italic">Excellence</em>
          </h2>
          <p className="text-rw-gray font-sans font-light text-base lg:text-lg leading-relaxed mb-6 max-w-md">
            Riwaayat Jewels was born from a simple belief: that every person deserves to own something truly 
            extraordinary. For fifty years, we have translated that belief into pieces of enduring beauty.
          </p>
          <p className="text-rw-gray font-sans font-light text-base lg:text-lg leading-relaxed mb-12 max-w-md">
            Today, we stand as India's most trusted name in luxury jewellery and curated timepieces, 
            serving generations of discerning customers who demand nothing but the finest.
          </p>

          {/* Timeline */}
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div key={item.year} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-rw-gold mt-1 flex-shrink-0 group-hover:scale-150 transition-transform" />
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-rw-border mt-2" />}
                </div>
                <div className="pb-6">
                  <span className="text-rw-gold text-xs tracking-[0.3em] uppercase font-sans font-medium">{item.year}</span>
                  <p className="text-rw-gray font-sans font-light text-sm leading-relaxed mt-1">{item.event}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/about" className="btn-dark mt-8 inline-block">
            Our Full Story
          </Link>
        </div>

        {/* Right: photo grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <img
                src="https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=500&q=85&auto=format&fit=crop"
                alt="Heritage"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img
                src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&q=85&auto=format&fit=crop"
                alt="Craftsmanship"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          <div className="space-y-4 mt-8">
            <div className="overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=85&auto=format&fit=crop"
                alt="Jewellery"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <img
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=85&auto=format&fit=crop"
                alt="Luxury"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
