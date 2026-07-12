'use client'

import Link from 'next/link'

const stats = [
  { value: '50+', label: 'Years of Legacy' },
  { value: '10K+', label: 'Pieces Crafted' },
  { value: '500+', label: 'Unique Designs' },
  { value: '100%', label: 'Certified Gems' },
]

export default function Craftsmanship() {
  return (
    <section className="bg-rw-black py-20 lg:py-32 relative overflow-hidden">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #C8A96A 40px, #C8A96A 41px)',
        }}
      />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left text */}
          <div>
            <p className="section-label mb-6">Our Philosophy</p>
            <h2 className="luxury-heading text-4xl lg:text-6xl xl:text-7xl text-white leading-none mb-8">
              The Art of<br /><em className="italic text-rw-gold">Perfection</em>
            </h2>
            <p className="text-white/60 font-sans font-light text-base lg:text-lg leading-relaxed mb-6 max-w-md">
              For over five decades, Riwaayat Jewels has been synonymous with uncompromising quality and 
              timeless design. Every piece that leaves our atelier carries with it the weight of tradition 
              and the promise of perfection.
            </p>
            <p className="text-white/60 font-sans font-light text-base lg:text-lg leading-relaxed mb-12 max-w-md">
              Our master craftsmen — many carrying skills passed down through three generations — spend 
              hundreds of hours on a single creation. This is not mass production. This is devotion.
            </p>
            <Link href="/about" className="btn-outline-gold border-white text-white hover:bg-white hover:text-rw-black">
              Our Heritage
            </Link>
          </div>

          {/* Right: stats + image */}
          <div>
            <div className="relative mb-12">
              <img
                src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=85&auto=format&fit=crop"
                alt="Craftsmanship"
                className="w-full object-cover"
                style={{ aspectRatio: '4/3' }}
              />
              <div className="absolute -bottom-6 -right-6 bg-rw-gold p-8 hidden lg:block">
                <p className="text-white font-serif text-xl font-light italic">
                  "Every gem has a soul.<br />We simply help it shine."
                </p>
                <p className="text-white/70 text-xs font-sans mt-3 tracking-wider uppercase">— Riwaayat Atelier</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-white/10 mt-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-rw-black p-8 text-center">
                  <div className="luxury-heading text-4xl lg:text-5xl text-rw-gold mb-2">{stat.value}</div>
                  <div className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-sans">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
