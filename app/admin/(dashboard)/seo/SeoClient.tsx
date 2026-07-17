'use client';

import { useState } from 'react';
import { useAdminApi, useToast } from '@/components/admin/CsrfContext';
import Toast from '@/components/admin/Toast';
import { TextField, TextAreaField } from '@/components/admin/fields';
import ImagePicker from '@/components/admin/ImagePicker';

type SeoRow = { page: string; title: string; description: string; keywords: string; ogImage: string | null };

const LABELS: Record<string, string> = { home: 'Home Page', shop: 'Shop Page', about: 'Our Story Page', contact: 'Contact Page', blog: 'Journal (Blog List)' };

function SeoCard({ row, onToast }: { row: SeoRow; onToast: (t: string, e?: boolean) => void }) {
  const { call } = useAdminApi();
  const [data, setData] = useState(row);
  const [saving, setSaving] = useState(false);

  async function onSave() {
    setSaving(true);
    try {
      await call(`/api/admin/seo/${row.page}`, { method: 'PATCH', body: data });
      onToast(`${LABELS[row.page]}: SEO saved`);
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Failed to save', true);
    }
    setSaving(false);
  }

  return (
    <div className="a-card">
      <div className="a-card-header"><h2>{LABELS[row.page]}</h2></div>
      <div className="a-card-body">
        <TextField label="Meta Title" value={data.title} onChange={(v) => setData({ ...data, title: v })} />
        <TextAreaField label="Meta Description" value={data.description} onChange={(v) => setData({ ...data, description: v })} />
        <TextField label="Keywords (comma-separated)" value={data.keywords} onChange={(v) => setData({ ...data, keywords: v })} />
        <ImagePicker label="Open Graph / Social Share Image" value={data.ogImage} onChange={(v) => setData({ ...data, ogImage: v })} />
        <button type="button" className="a-btn a-btn-gold" onClick={onSave} disabled={saving}>Save SEO</button>
      </div>
    </div>
  );
}

export default function SeoClient({ rows }: { rows: SeoRow[] }) {
  const { message, show } = useToast();
  return (
    <>
      {rows.map((r) => <SeoCard key={r.page} row={r} onToast={show} />)}
      <Toast message={message} />
    </>
  );
}
