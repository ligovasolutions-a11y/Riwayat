import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AIConsierge from '@/components/AIConsierge'
import Link from 'next/link'

const collections = [
  { name: 'Bridal', count: '120+ pieces', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=85&auto=format&fit=crop', href: '/jewellery/bridal' },
  { name: 'Diamond', count: '80+ pieces', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=85&auto=format&fit=crop', href: '/jewellery/diamond' },
  { name: 'Gold', count: '200+ pieces', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=85&auto=format&fit=crop', href: '/jewellery/gold' },
  { name: 'Polki', count: '60+ pieces', image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=700&q=85&auto=format&fit=crop', href: '/jewellery/polki' },
  { name: 'Kundan', count: '45+ pieces', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=700&q=85&auto=format&fit=crop', href: '/jewellery/kundan' },
  { name: 'Earrings', count: '150+ pieces', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=700&q=85&auto=format&fit=crop', href: '/jewellery/earrings' },
]

export default function JewelleryPage() {
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

      {/* Collections grid */}
      <section className="px-6 lg:px-12 pb-20 lg:pb-32 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((col) => (
            <Link key={col.name} href={col.href} className="group block">
              <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '3/4' }}>
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="font-serif text-2xl font-light text-white mb-1">{col.name}</h2>
                  <p className="text-white/60 text-xs font-sans tracking-wider">{col.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
      <AIConsierge />
    </main>
  )
}
