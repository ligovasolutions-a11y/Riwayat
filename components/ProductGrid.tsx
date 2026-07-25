import Link from 'next/link'
import type { Product } from '@/lib/content'

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {products.map((p) => (
        <Link key={p.id} href={`/product/${p.id}`} className="group block">
          <div className="relative overflow-hidden bg-rw-light mb-4" style={{ aspectRatio: '1/1' }}>
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-rw-gray text-xs font-sans uppercase tracking-wider">
                No Image
              </div>
            )}
            {p.subcategory && (
              <div className="absolute top-4 left-4">
                <span className="bg-white text-rw-black text-[9px] tracking-[0.2em] uppercase font-sans px-3 py-1">
                  {p.subcategory}
                </span>
              </div>
            )}
          </div>
          <h3 className="font-serif text-xl font-light text-rw-black mb-1 group-hover:text-rw-gold transition-colors">
            {p.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="font-sans text-rw-black font-medium">{p.price || 'Price on Request'}</p>
            <p className="text-[10px] tracking-wider uppercase font-sans text-rw-gray">{p.stock}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
