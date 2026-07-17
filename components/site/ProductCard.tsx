'use client';

import Link from 'next/link';
import { useState } from 'react';
import { IconGlyph } from '@/lib/icons';
import { useCart } from './CartProvider';
import type { Product } from '@prisma/client';

/* NOTE: matches the original static site's behavior exactly — home page
   bestseller cards were never links, only the shop grid and "related
   products" cards were (`linked` controls this per call site). */
export default function ProductCard({ product, linked = false }: { product: Product; linked?: boolean }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addOne } = useCart();

  const inner = (
    <>
      <div className="product-media">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className="product-wishlist"
          aria-label="Wishlist"
          onClick={(e) => { e.preventDefault(); setWishlisted((w) => !w); }}
          style={wishlisted ? { opacity: 1, transform: 'translateY(0)', color: 'var(--maroon)' } : undefined}
        >
          <svg viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
            <path d="M12 21s-7-4.6-9.5-8.8C.6 8.4 2 5 5.4 4.4 7.7 4 9.9 5.2 12 7.5c2.1-2.3 4.3-3.5 6.6-3.1C22 5 23.4 8.4 21.5 12.2 19 16.4 12 21 12 21z" />
          </svg>
        </button>
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/uploads/${product.image}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <IconGlyph name={product.icon} />
        )}
        <button
          className="product-quickadd"
          onClick={(e) => { e.preventDefault(); addOne(); setJustAdded(true); setTimeout(() => setJustAdded(false), 1500); }}
        >
          {justAdded ? 'Added ✓' : 'Quick Add'}
        </button>
      </div>
      <div className="product-info">
        <p className="cat">{product.category}</p>
        <h4>{product.name}</h4>
        <div className="price">
          {product.oldPrice && <span className="old">{product.oldPrice}</span>}
          <span className="now">{product.price}</span>
        </div>
        <div className="stars">{'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}</div>
      </div>
    </>
  );

  if (linked) {
    return <Link href={`/product/${product.slug}`} className="product-card">{inner}</Link>;
  }
  return <div className="product-card">{inner}</div>;
}
