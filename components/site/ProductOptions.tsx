'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';

export default function ProductOptions({ metals, sizes, stockNote }: { metals: string[]; sizes: string[]; stockNote: string }) {
  const [metal, setMetal] = useState(0);
  const [size, setSize] = useState(Math.min(1, sizes.length - 1));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addOne } = useCart();

  return (
    <>
      {metals.length > 0 && (
        <div className="option-group">
          <div className="label-row"><span>Metal</span></div>
          <div className="size-row">
            {metals.map((m, i) => (
              <div key={m} className={`size-chip${i === metal ? ' active' : ''}`} onClick={() => setMetal(i)}>{m}</div>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="option-group">
          <div className="label-row"><span>Size</span><a href="#" style={{ color: 'var(--gold-dark)' }}>Size Guide</a></div>
          <div className="size-row">
            {sizes.map((s, i) => (
              <div key={s} className={`size-chip${i === size ? ' active' : ''}`} onClick={() => setSize(i)}>{s}</div>
            ))}
          </div>
        </div>
      )}

      <div className="qty-row">
        <div className="qty-control">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <input type="text" readOnly value={qty} />
          <button onClick={() => setQty((q) => q + 1)}>+</button>
        </div>
        {stockNote && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{stockNote}</span>}
      </div>

      <div className="pd-actions">
        <button
          className="btn btn-primary btn-block"
          onClick={() => { addOne(); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
        >
          {added ? 'Added ✓' : 'Add To Cart'}
        </button>
        <button className="btn btn-block">Buy Now</button>
      </div>
    </>
  );
}
