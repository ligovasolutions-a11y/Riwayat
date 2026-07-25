import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AIConsierge from '@/components/AIConsierge'
import ProductGallery from '@/components/ProductGallery'
import { getProduct, slugify } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProduct(Number(params.id))

  if (!product || product.status !== 'active') {
    return (
      <main>
        <Navigation />
        <section className="pt-32 lg:pt-44 pb-20 lg:pb-32 px-6 lg:px-12 max-w-screen-xl mx-auto text-center">
          <p className="section-label mb-4">Not Found</p>
          <h1 className="luxury-heading text-3xl lg:text-5xl text-rw-black leading-tight mb-6">
            This product isn't available
          </h1>
          <p className="text-rw-gray font-sans font-light text-base max-w-md mx-auto mb-10">
            It may have been removed or is no longer in stock. Take a look at the rest of our collection instead.
          </p>
          <Link href="/jewellery" className="btn-dark">Browse Jewellery</Link>
        </section>
        <Footer />
        <AIConsierge />
      </main>
    )
  }

  const images = [product.image, ...product.images].filter(Boolean)
  const categoryHref = product.category === 'Watches'
    ? `/watches/${slugify(product.subcategory || product.name)}`
    : `/jewellery/${slugify(product.subcategory || product.name)}`

  const specs = [
    { label: 'Material', value: product.material },
    { label: 'Weight', value: product.weight },
    { label: 'Certification', value: product.certification },
    { label: 'Warranty', value: product.warranty },
    { label: 'SKU / Reference', value: product.sku },
  ].filter((s) => s.value)

  return (
    <main>
      <Navigation />
      <section className="pt-32 lg:pt-44 pb-20 lg:pb-32 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <Link href={categoryHref} className="text-xs tracking-widest uppercase font-sans text-rw-gray hover:text-rw-gold transition-colors mb-8 inline-block">
          ← Back to {product.category}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-4">
          <ProductGallery images={images} name={product.name} />

          <div>
            {product.subcategory && <p className="section-label mb-4">{product.subcategory}</p>}
            <h1 className="luxury-heading text-3xl lg:text-5xl text-rw-black leading-tight mb-4">
              {product.name}
            </h1>
            <p className="font-sans text-2xl text-rw-black font-medium mb-2">
              {product.price || 'Price on Request'}
            </p>
            <p className="text-xs tracking-wider uppercase font-sans text-rw-gray mb-8">{product.stock}</p>

            {product.description && (
              <p className="text-rw-gray font-sans font-light text-base leading-relaxed mb-8 max-w-md">
                {product.description}
              </p>
            )}

            {product.story && (
              <p className="text-rw-gray font-sans font-light text-sm leading-relaxed mb-8 max-w-md italic">
                {product.story}
              </p>
            )}

            {specs.length > 0 && (
              <div className="space-y-3 mb-10 border-t border-rw-border pt-8">
                {specs.map((s) => (
                  <div key={s.label} className="flex justify-between max-w-md text-sm font-sans">
                    <span className="text-rw-gray">{s.label}</span>
                    <span className="text-rw-black font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            )}

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {product.tags.map((t) => (
                  <span key={t} className="text-[10px] tracking-wider uppercase font-sans text-rw-gray border border-rw-border px-3 py-1.5">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <Link
              href={`/get-a-quote?product=${encodeURIComponent(product.name)}`}
              className="btn-gold inline-block"
            >
              Enquire About This Piece
            </Link>
          </div>
        </div>
      </section>
      <Footer />
      <AIConsierge />
    </main>
  )
}
