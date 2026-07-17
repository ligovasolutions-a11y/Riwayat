'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminApi, useToast } from '@/components/admin/CsrfContext';
import Toast from '@/components/admin/Toast';
import { TextField, TextAreaField, LinesField, IconPicker, ToggleField, NumberField } from '@/components/admin/fields';
import ImagePicker from '@/components/admin/ImagePicker';

export type ProductFormData = {
  name: string; category: string; icon: string; price: string; oldPrice: string; badge: string;
  rating: number; description: string; metals: string[]; sizes: string[]; stockNote: string;
  detailsText: string; shippingText: string; careText: string; reviewCount: number;
  image: string | null; featured: boolean; enabled: boolean;
};

export default function ProductForm({ productId, initial }: { productId?: number; initial: ProductFormData }) {
  const router = useRouter();
  const { call } = useAdminApi();
  const { message, show } = useToast();
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);

  function set(patch: Partial<ProductFormData>) {
    setData((d) => ({ ...d, ...patch }));
  }

  async function onSave() {
    setSaving(true);
    try {
      if (productId) {
        await call(`/api/admin/products/${productId}`, { method: 'PATCH', body: data });
        show('Product updated');
      } else {
        const res = await call('/api/admin/products', { method: 'POST', body: data });
        show('Product created');
        router.push(`/admin/products/${res.product.id}`);
        router.refresh();
        return;
      }
      router.refresh();
    } catch (err) {
      show(err instanceof Error ? err.message : 'Failed to save', true);
    }
    setSaving(false);
  }

  async function onDelete() {
    if (!productId) return;
    if (!confirm(`Delete "${data.name}"? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await call(`/api/admin/products/${productId}`, { method: 'DELETE' });
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      show(err instanceof Error ? err.message : 'Failed to delete', true);
      setSaving(false);
    }
  }

  return (
    <div className="a-card">
      <div className="a-card-header">
        <h2>{productId ? 'Edit Product' : 'New Product'}</h2>
        <ToggleField label="Show on site" checked={data.enabled} onChange={(v) => set({ enabled: v })} />
      </div>
      <div className="a-card-body">
        <div className="a-row">
          <TextField label="Name" value={data.name} onChange={(v) => set({ name: v })} />
          <TextField label="Category" value={data.category} onChange={(v) => set({ category: v })} />
        </div>
        <div className="a-row">
          <TextField label="Price" value={data.price} onChange={(v) => set({ price: v })} placeholder="₹54,400" />
          <TextField label="Old Price (optional, for a strikethrough)" value={data.oldPrice} onChange={(v) => set({ oldPrice: v })} placeholder="₹68,000" />
        </div>
        <div className="a-row">
          <TextField label="Badge (optional)" value={data.badge} onChange={(v) => set({ badge: v })} placeholder="New / Sale / Bestseller" />
          <NumberField label="Rating (1-5)" value={data.rating} min={1} max={5} onChange={(v) => set({ rating: v })} />
        </div>
        <div className="a-row">
          <NumberField label="Review Count" value={data.reviewCount} min={0} onChange={(v) => set({ reviewCount: v })} />
          <ToggleField label="Feature on Home Page (Bestsellers)" checked={data.featured} onChange={(v) => set({ featured: v })} />
        </div>
        <IconPicker label="Icon (shown if no photo is set)" value={data.icon} onChange={(v) => set({ icon: v })} />
        <ImagePicker label="Product Photo" value={data.image} onChange={(v) => set({ image: v })} />
        <TextAreaField label="Description" value={data.description} onChange={(v) => set({ description: v })} />
        <LinesField label="Metal Options" value={data.metals} onChange={(v) => set({ metals: v })} />
        <LinesField label="Size Options" value={data.sizes} onChange={(v) => set({ sizes: v })} />
        <TextField label="Stock Note" value={data.stockNote} onChange={(v) => set({ stockNote: v })} placeholder="Only 4 left in stock" />
        <TextAreaField label="Product Details Text" value={data.detailsText} onChange={(v) => set({ detailsText: v })} />
        <TextAreaField label="Shipping & Returns Text" value={data.shippingText} onChange={(v) => set({ shippingText: v })} />
        <TextAreaField label="Care Instructions Text" value={data.careText} onChange={(v) => set({ careText: v })} />

        <div className="a-row" style={{ marginTop: 8 }}>
          <button type="button" className="a-btn a-btn-gold" onClick={onSave} disabled={saving}>{productId ? 'Save Changes' : 'Create Product'}</button>
          {productId && <button type="button" className="a-btn a-btn-danger" onClick={onDelete} disabled={saving}>🗑 Delete Product</button>}
        </div>
      </div>
      <Toast message={message} />
    </div>
  );
}
