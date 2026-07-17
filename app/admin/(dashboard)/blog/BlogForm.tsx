'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminApi, useToast } from '@/components/admin/CsrfContext';
import Toast from '@/components/admin/Toast';
import { TextField, TextAreaField } from '@/components/admin/fields';
import ImagePicker from '@/components/admin/ImagePicker';
import RichTextEditor from '@/components/admin/RichTextEditor';

export type BlogFormData = {
  title: string; excerpt: string; contentHtml: string; coverImage: string | null;
  status: 'draft' | 'published'; seoTitle: string; seoDescription: string;
};

export default function BlogForm({ postId, slug, initial }: { postId?: number; slug?: string; initial: BlogFormData }) {
  const router = useRouter();
  const { call } = useAdminApi();
  const { message, show } = useToast();
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);

  function set(patch: Partial<BlogFormData>) {
    setData((d) => ({ ...d, ...patch }));
  }

  async function onSave(status?: 'draft' | 'published') {
    setSaving(true);
    const payload = { ...data, status: status || data.status };
    try {
      if (postId) {
        const res = await call(`/api/admin/blog/${postId}`, { method: 'PATCH', body: payload });
        setData((d) => ({ ...d, status: res.post.status }));
        show(status === 'published' ? 'Post published — now live' : 'Post saved');
      } else {
        const res = await call('/api/admin/blog', { method: 'POST', body: payload });
        show('Post created');
        router.push(`/admin/blog/${res.post.id}`);
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
    if (!postId) return;
    if (!confirm(`Delete "${data.title}"? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await call(`/api/admin/blog/${postId}`, { method: 'DELETE' });
      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      show(err instanceof Error ? err.message : 'Failed to delete', true);
      setSaving(false);
    }
  }

  return (
    <div className="a-card">
      <div className="a-card-header">
        <h2>{postId ? 'Edit Post' : 'New Post'}</h2>
        <span className={`a-badge ${data.status === 'published' ? 'a-badge-published' : 'a-badge-draft'}`}>
          {data.status === 'published' ? 'Published' : 'Draft'}
        </span>
      </div>
      <div className="a-card-body">
        <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
        {slug && <p style={{ fontSize: 12, color: 'var(--a-text-muted)', marginTop: -12, marginBottom: 16 }}>URL: /blog/{slug}</p>}
        <TextAreaField label="Excerpt (shown on the Journal list page)" value={data.excerpt} onChange={(v) => set({ excerpt: v })} />
        <ImagePicker label="Cover Image" value={data.coverImage} onChange={(v) => set({ coverImage: v })} />
        <RichTextEditor value={data.contentHtml} onChange={(v) => set({ contentHtml: v })} />
        <TextField label="SEO Title (optional, defaults to post title)" value={data.seoTitle} onChange={(v) => set({ seoTitle: v })} />
        <TextAreaField label="SEO Description (optional, defaults to excerpt)" value={data.seoDescription} onChange={(v) => set({ seoDescription: v })} />

        <div className="a-row" style={{ marginTop: 8 }}>
          <button type="button" className="a-btn" onClick={() => onSave('draft')} disabled={saving}>Save Draft</button>
          <button type="button" className="a-btn a-btn-gold" onClick={() => onSave('published')} disabled={saving}>Publish</button>
          {postId && <button type="button" className="a-btn a-btn-danger" onClick={onDelete} disabled={saving}>🗑 Delete</button>}
        </div>
      </div>
      <Toast message={message} />
    </div>
  );
}
