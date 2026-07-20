import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AIConsierge from '@/components/AIConsierge'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const brands = [
  { name: 'Rolex', desc: 'The Crown Jewel of Watchmaking', count: '25+', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=85&auto=format&fit=crop' },
  { name: 'Omega', desc: 'Precision Swiss Engineering', count: '40+', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700&q=85&auto=format&fit=crop' },
  { name: 'TAG Heuer', desc: 'Swiss Avant-Garde', count: '35+', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=700&q=85&auto=format&fit=crop' },
  { name: 'Longines', desc: 'Elegance is an Attitude', count: '30+', image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=700&q=85&auto=format&fit=crop' },
  { name: 'IWC', desc: 'Probus Scafusia', count: '20+', image: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=700&q=85&auto=format&fit=crop' },
  { name: 'Tissot', desc: 'Innovators by Tradition', count: '45+', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700&q=85&auto=format&fit=crop' },
]

export default function WatchesPage() {
  return (
    <main>
      <Navigation />
      <section className="relative pt-32 lg:pt-44 pb-16 lg:pb-24 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <p className="section-label mb-4">Authorised Retailer</p>
        <h1 className="luxury-heading text-5xl lg:text-8xl xl:text-9xl text-rw-black leading-none mb-6">
          Swiss<br /><em className="italic">Timepieces</em>
        </h1>
        <p className="text-rw-gray font-sans font-light text-base lg:text-xl max-w-xl leading-relaxed">
          Authorised dealers for the world's most prestigious watch brands. 
          Every timepiece authenticated, serviced, and backed by our personal guarantee.
        </p>
      </section>

      <section className="px-6 lg:px-12 pb-20 lg:pb-32 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {brands.map((brand) => (
            <Link key={brand.name} href={`/watches/${brand.name.toLowerCase().replace(' ', '-')}`} className="group block">
              <div className="relative overflow-hidden bg-rw-light mb-4" style={{ aspectRatio: '1/1' }}>
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-rw-gold text-[10px] tracking-[0.3em] uppercase font-sans mb-1">Authorised Dealer</p>
                  <h2 className="font-serif text-2xl font-light text-white mb-1">{brand.name}</h2>
                  <p className="text-white/60 text-xs font-sans">{brand.desc}</p>
                </div>
              </div>
              <p className="text-rw-gray text-xs font-sans tracking-wider">{brand.count} models available</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
      <AIConsierge />
    </main>
  )
}
