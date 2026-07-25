import Link from 'next/link'
import { listPublishedProducts, slugify } from '@/lib/content'

const DEFAULT_DETAILS = ['Handcrafted', 'Certified Quality', 'Custom sizing available']

export default function SignatureJewellery() {
  const pieces = listPublishedProducts()
    .filter((p) => p.category === 'Jewellery')
    .slice(0, 4)

  if (pieces.length === 0) return null

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
          {pieces.map((piece, i) => {
            const reverse = i % 2 === 1
            const details = [piece.material, piece.certification, piece.warranty].filter(Boolean)
            const description = piece.description || piece.story ||
              'Handcrafted with meticulous attention to detail, blending traditional artistry with contemporary elegance.'
            const href = `/jewellery/${slugify(piece.subcategory || piece.name)}`

            return (
              <div
                key={piece.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center ${
                  reverse ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative overflow-hidden bg-rw-light ${reverse ? 'lg:col-start-2' : ''}`} style={{ aspectRatio: '4/5' }}>
                  {piece.image && (
                    <img
                      src={piece.image}
                      alt={piece.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {piece.subcategory && (
                    <div className="absolute top-6 left-6">
                      <span className="bg-white text-rw-black text-[9px] tracking-[0.3em] uppercase font-sans px-4 py-2">
                        {piece.subcategory}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  {piece.subcategory && <span className="section-label mb-4 block">{piece.subcategory}</span>}
                  <h3 className="luxury-heading text-3xl lg:text-5xl xl:text-6xl text-rw-black leading-none mb-6 lg:mb-8">
                    {piece.name}
                  </h3>
                  <p className="text-rw-gray font-sans font-light text-base lg:text-lg leading-relaxed mb-8 lg:mb-10 max-w-md">
                    {description}
                  </p>
                  <div className="space-y-3 mb-10 lg:mb-12">
                    {(details.length > 0 ? details : DEFAULT_DETAILS).map((d) => (
                      <div key={d} className="flex items-center gap-3">
                        <div className="w-1 h-1 rounded-full bg-rw-gold flex-shrink-0" />
                        <span className="text-xs tracking-wider uppercase font-sans text-rw-gray">{d}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={href} className="btn-outline-gold">
                    Explore {piece.subcategory || 'This'} Collection
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
