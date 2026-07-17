'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminApi, useToast } from '@/components/admin/CsrfContext';
import Toast from '@/components/admin/Toast';

type ProductRow = { id: number; name: string; category: string; price: string; enabled: boolean; featured: boolean; image: string | null };

export default function ProductsListClient({ products: initial }: { products: ProductRow[] }) {
  const [products, setProducts] = useState(initial);
  const [dragId, setDragId] = useState<number | null>(null);
  const { call } = useAdminApi();
  const { message, show } = useToast();

  function onDrop(targetId: number) {
    if (dragId === null || dragId === targetId) return;
    const fromIndex = products.findIndex((p) => p.id === dragId);
    const toIndex = products.findIndex((p) => p.id === targetId);
    const next = products.slice();
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setProducts(next);
    setDragId(null);
    call('/api/admin/products/reorder', { method: 'POST', body: { order: next.map((p) => p.id) } })
      .then(() => show('Order saved'))
      .catch(() => show('Failed to save order', true));
  }

  return (
    <div className="a-card">
      <div className="a-card-header">
        <h2>Products ({products.length})</h2>
        <Link href="/admin/products/new" className="a-btn a-btn-gold">+ New Product</Link>
      </div>
      <table className="a-table">
        <thead><tr><th style={{ width: 30 }}></th><th>Photo</th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              draggable
              onDragStart={() => setDragId(p.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(p.id)}
              style={{ cursor: 'grab', opacity: dragId === p.id ? 0.5 : 1 }}
            >
              <td style={{ color: 'var(--a-text-muted)' }}>⠿</td>
              <td>
                <div className="a-media-thumb" style={{ width: 40, height: 40 }}>
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/uploads/${p.image}`} alt="" />
                  )}
                </div>
              </td>
              <td>{p.name}{p.featured && <span className="a-badge a-badge-published" style={{ marginLeft: 8 }}>Featured</span>}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td><span className={`a-badge ${p.enabled ? 'a-badge-published' : 'a-badge-off'}`}>{p.enabled ? 'Live' : 'Hidden'}</span></td>
              <td><Link href={`/admin/products/${p.id}`} className="a-btn a-btn-sm">Edit</Link></td>
            </tr>
          ))}
          {products.length === 0 && <tr><td colSpan={7} style={{ color: 'var(--a-text-muted)' }}>No products yet.</td></tr>}
        </tbody>
      </table>
      <Toast message={message} />
    </div>
  );
}
