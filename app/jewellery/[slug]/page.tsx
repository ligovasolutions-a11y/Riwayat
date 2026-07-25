import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AIConsierge from '@/components/AIConsierge'
import ProductGrid from '@/components/ProductGrid'
import CategoryEmptyState from '@/components/CategoryEmptyState'
import { listPublishedProductsBySubcategorySlug, humanizeSlug } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default function JewellerySubcategoryPage({ params }: { params: { slug: string } }) {
  const products = listPublishedProductsBySubcategorySlug('Jewellery', params.slug)
  const title = humanizeSlug(params.slug)

  return (
    <main>
      <Navigation />
      <section className="relative pt-32 lg:pt-44 pb-16 lg:pb-24 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <p className="section-label mb-4">Jewellery</p>
        <h1 className="luxury-heading text-5xl lg:text-7xl text-rw-black leading-none mb-6">
          {title}
        </h1>
        <p className="text-rw-gray font-sans font-light text-base lg:text-xl max-w-xl leading-relaxed">
          Explore our {title.toLowerCase()} collection, handcrafted with generations of Indian goldsmithing expertise.
        </p>
      </section>

      {products.length > 0 ? (
        <section className="px-6 lg:px-12 pb-20 lg:pb-32 max-w-screen-2xl mx-auto">
          <ProductGrid products={products} />
        </section>
      ) : (
        <CategoryEmptyState backHref="/jewellery" backLabel="Browse All Jewellery" />
      )}

      <Footer />
      <AIConsierge />
    </main>
  )
}
