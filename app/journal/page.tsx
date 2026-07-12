import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'

const articles = [
  { category: 'Watch Guide', title: 'The Ultimate Guide to Buying Your First Rolex', date: 'June 2024', readTime: '8 min', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=85&auto=format&fit=crop', excerpt: 'Everything you need to know about references, movement types, and what to expect when purchasing your first Rolex.' },
  { category: 'Bridal', title: 'How to Choose Your Wedding Jewellery Set', date: 'May 2024', readTime: '6 min', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=85&auto=format&fit=crop', excerpt: 'Expert advice on selecting the perfect bridal ensemble that complements your wedding outfit and personal style.' },
  { category: 'Diamond Education', title: 'Understanding the 4Cs of Diamond Quality', date: 'April 2024', readTime: '10 min', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=85&auto=format&fit=crop', excerpt: 'A comprehensive breakdown of Cut, Color, Clarity, and Carat — and why they matter for your purchase.' },
  { category: 'Jewellery Guide', title: 'Polki vs Kundan: What\'s the Difference?', date: 'March 2024', readTime: '5 min', image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=700&q=85&auto=format&fit=crop', excerpt: 'Demystifying India\'s two most beloved traditional jewellery styles for the modern bride.' },
  { category: 'Watch Guide', title: 'Omega Seamaster vs Rolex Submariner: A Deep Dive', date: 'February 2024', readTime: '12 min', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700&q=85&auto=format&fit=crop', excerpt: 'Two icons, one decision. Our horology team breaks down the differences for serious watch buyers.' },
  { category: 'Luxury Lifestyle', title: 'The Art of Gifting Jewellery — A Complete Guide', date: 'January 2024', readTime: '7 min', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=700&q=85&auto=format&fit=crop', excerpt: 'From anniversary gifts to milestone celebrations — how to choose a piece that will be cherished forever.' },
]

export default function JournalPage() {
  const [featured, ...rest] = articles
  return (
    <main>
      <Navigation />
      <section className="pt-32 lg:pt-44 pb-16 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <p className="section-label mb-4">Riwaayat Journal</p>
        <h1 className="luxury-heading text-5xl lg:text-8xl text-rw-black leading-none">
          Stories &<br /><em className="italic">Expertise</em>
        </h1>
      </section>

      {/* Featured */}
      <section className="px-6 lg:px-12 pb-16 lg:pb-24 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 pb-16 border-b border-rw-border">
          <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="section-label mb-4">{featured.category}</p>
            <h2 className="luxury-heading text-3xl lg:text-5xl text-rw-black leading-tight mb-6">{featured.title}</h2>
            <p className="text-rw-gray font-sans font-light text-base leading-relaxed mb-8">{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase font-sans text-rw-gray mb-8">
              <span>{featured.date}</span><span>·</span><span>{featured.readTime} read</span>
            </div>
            <Link href="#" className="btn-dark self-start">Read Article</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {rest.map((a) => (
            <div key={a.title} className="group">
              <div className="overflow-hidden mb-5" style={{ aspectRatio: '4/3' }}>
                <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="section-label mb-3">{a.category}</p>
              <h3 className="luxury-heading text-xl lg:text-2xl text-rw-black leading-tight mb-3 group-hover:text-rw-gold transition-colors">{a.title}</h3>
              <p className="text-rw-gray font-sans font-light text-sm leading-relaxed mb-4">{a.excerpt}</p>
              <div className="flex items-center gap-3 text-[10px] tracking-wider uppercase font-sans text-rw-gray">
                <span>{a.date}</span><span>·</span><span>{a.readTime} read</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
