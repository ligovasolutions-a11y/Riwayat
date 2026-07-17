'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAdminApi, useToast } from '@/components/admin/CsrfContext';
import Toast from '@/components/admin/Toast';

type MediaAsset = { id: number; filename: string; originalName: string; size: number; width: number | null; height: number | null; createdAt: string };

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaLibraryClient({ initial }: { initial: MediaAsset[] }) {
  const [media, setMedia] = useState(initial);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { call, csrfToken } = useAdminApi();
  const { message, show } = useToast();

  const load = useCallback(async (q = '') => {
    const data = await call(`/api/admin/media${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    setMedia(data.media || []);
  }, [call]);

  useEffect(() => {
    const t = setTimeout(() => load(search), 250);
    return () => clearTimeout(t);
  }, [search, load]);

  async function onUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/media', { method: 'POST', headers: { 'X-CSRF-Token': csrfToken }, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      show('Image uploaded and compressed');
      await load(search);
    } catch (err) {
      show(err instanceof Error ? err.message : 'Upload failed', true);
    }
    setUploading(false);
  }

  async function onDelete(asset: MediaAsset) {
    if (!confirm(`Delete "${asset.originalName}"?`)) return;
    try {
      await call(`/api/admin/media/${asset.id}`, { method: 'DELETE' });
      setMedia((m) => m.filter((a) => a.id !== asset.id));
      show('Image deleted');
    } catch (err) {
      show(err instanceof Error ? err.message : 'Failed to delete', true);
    }
  }

  return (
    <div className="a-card">
      <div className="a-card-header">
        <h2>Media Library ({media.length})</h2>
        <input type="text" placeholder="Search by filename…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 240 }} />
      </div>
      <div className="a-card-body">
        <div
          className={`a-dropzone${dragOver ? ' dragover' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) onUpload(f); }}
        >
          {uploading ? 'Uploading & compressing…' : 'Drag and drop an image here, or '}
          {!uploading && (
            <label style={{ color: 'var(--a-gold-dark)', cursor: 'pointer', textDecoration: 'underline' }}>
              browse files
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
            </label>
          )}
          <div style={{ fontSize: 11, marginTop: 8 }}>JPG, PNG, WEBP, or GIF — up to 8MB, automatically resized and compressed.</div>
        </div>

        <div className="a-media-grid">
          {media.map((m) => (
            <div key={m.id} className="a-media-item">
              <div className="a-media-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/uploads/${m.filename}`} alt={m.originalName} />
              </div>
              <div className="a-media-meta">
                <span title={m.originalName}>{m.originalName.length > 14 ? m.originalName.slice(0, 14) + '…' : m.originalName}</span>
                <button type="button" className="a-btn a-btn-sm a-btn-danger" onClick={() => onDelete(m)}>Delete</button>
              </div>
              <div className="a-media-meta" style={{ borderTop: '1px solid var(--a-border)' }}>
                <span>{formatSize(m.size)}</span>
                {m.width && <span>{m.width}×{m.height}</span>}
              </div>
            </div>
          ))}
          {media.length === 0 && <p style={{ color: 'var(--a-text-muted)' }}>No media yet.</p>}
        </div>
      </div>
      <Toast message={message} />
    </div>
  );
}
