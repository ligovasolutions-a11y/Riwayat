'use client'

import Link from 'next/link'

const pieces = [
  {
    tag: 'Bridal',
    title: 'Royal Bridal Sets',
    description: 'Meticulously crafted for the most important day of your life. Our bridal collections blend traditional Indian artistry with contemporary elegance.',
    details: ['22K & 18K Gold', 'GIA Certified Diamonds', 'Custom sizing available'],
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=85&auto=format&fit=crop',
    href: '/jewellery/bridal',
    reverse: false,
  },
  {
    tag: 'Diamond',
    title: 'Diamond Atelier',
    description: 'Every diamond tells a story of light, fire and brilliance. Our certified diamonds are hand-selected for exceptional quality and character.',
    details: ['GIA & IGI Certified', 'D-F Color Grade', 'VS1-VS2 Clarity'],
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=85&auto=format&fit=crop',
    href: '/jewellery/diamond',
    reverse: true,
  },
  {
    tag: 'Heritage',
    title: 'Heritage Gold Craft',
    description: 'Celebrating the timeless traditions of Indian goldsmithing. Each piece carries the spirit of generations of master craftsmen.',
    details: ['Hallmarked BIS 916', 'Handcrafted', 'Traditional & Modern Designs'],
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=85&auto=format&fit=crop',
    href: '/jewellery/gold',
    reverse: false,
  },
]

export default function SignatureJewellery() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 lg:mb-24">
          <p className="section-label mb-4">Handcrafted Excellence</p>
          <h2 className="luxury-heading text-4xl lg:text-6xl xl:text-7xl text-rw-black leading-none">
            Signature<br /><em className="italic">Jewellery</em>
          </h2>
        </div>

        <div className="space-y-20 lg:space-y-32">
          {pieces.map((piece, i) => (
            <div
              key={piece.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center ${
                piece.reverse ? 'lg:grid-flow-dense' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${piece.reverse ? 'lg:col-start-2' : ''}`} style={{ aspectRatio: '4/5' }}>
                <img
                  src={piece.image}
                  alt={piece.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white text-rw-black text-[9px] tracking-[0.3em] uppercase font-sans px-4 py-2">
                    {piece.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className={`${piece.reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <span className="section-label mb-4 block">{piece.tag}</span>
                <h3 className="luxury-heading text-3xl lg:text-5xl xl:text-6xl text-rw-black leading-none mb-6 lg:mb-8">
                  {piece.title}
                </h3>
                <p className="text-rw-gray font-sans font-light text-base lg:text-lg leading-relaxed mb-8 lg:mb-10 max-w-md">
                  {piece.description}
                </p>
                <div className="space-y-3 mb-10 lg:mb-12">
                  {piece.details.map((d) => (
                    <div key={d} className="flex items-center gap-3">
                      <div className="w-1 h-1 rounded-full bg-rw-gold flex-shrink-0" />
                      <span className="text-xs tracking-wider uppercase font-sans text-rw-gray">{d}</span>
                    </div>
                  ))}
                </div>
                <Link href={piece.href} className="btn-outline-gold">
                  Explore {piece.tag} Collection
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
