'use client';

import { useState, useCallback } from 'react';
import { useAdminApi } from './CsrfContext';

type MediaAsset = { id: number; filename: string; originalName: string; width: number | null; height: number | null };

export default function ImagePicker({ label, value, onChange }: { label: string; value: string | null; onChange: (filename: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { call, csrfToken } = useAdminApi();

  const load = useCallback(async (q = '') => {
    const data = await call(`/api/admin/media${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    setMedia(data.media || []);
  }, [call]);

  function openPicker() {
    setOpen(true);
    load(search);
  }

  async function onUpload(file: File) {
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/media', { method: 'POST', headers: { 'X-CSRF-Token': csrfToken }, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      await load(search);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
    setUploading(false);
  }

  return (
    <div className="a-field">
      <label>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {value ? (
          <div className="a-media-thumb" style={{ width: 60, height: 60 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/uploads/${value}`} alt="" />
          </div>
        ) : (
          <div className="a-media-thumb" style={{ width: 60, height: 60, fontSize: 10, color: 'var(--a-text-muted)', textAlign: 'center' }}>None</div>
        )}
        <button type="button" className="a-btn a-btn-sm" onClick={openPicker}>Choose Image</button>
        {value && <button type="button" className="a-btn a-btn-sm a-btn-danger" onClick={() => onChange(null)}>Remove</button>}
      </div>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setOpen(false)}>
          <div style={{ background: '#fff', borderRadius: 8, width: 700, maxHeight: '80vh', overflow: 'auto', padding: 20 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ margin: 0 }}>Select Image</h3>
              <button type="button" className="a-btn a-btn-sm" onClick={() => setOpen(false)}>Close ✕</button>
            </div>
            <input
              type="text" placeholder="Search media…" value={search}
              onChange={(e) => { setSearch(e.target.value); load(e.target.value); }}
              style={{ marginBottom: 14 }}
            />
            <div className="a-dropzone" style={{ marginBottom: 14, padding: 18 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onUpload(f); }}
            >
              {uploading ? 'Uploading…' : 'Drag an image here, or '}
              {!uploading && (
                <label style={{ color: 'var(--a-gold-dark)', cursor: 'pointer', textDecoration: 'underline' }}>
                  browse
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
                </label>
              )}
              {error && <div style={{ color: 'var(--a-danger)', marginTop: 8 }}>{error}</div>}
            </div>
            <div className="a-media-grid">
              {media.map((m) => (
                <div key={m.id} className="a-media-item" style={{ cursor: 'pointer' }} onClick={() => { onChange(m.filename); setOpen(false); }}>
                  <div className="a-media-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/uploads/${m.filename}`} alt={m.originalName} />
                  </div>
                  <div className="a-media-meta"><span>{m.originalName.slice(0, 16)}</span></div>
                </div>
              ))}
              {media.length === 0 && <p style={{ color: 'var(--a-text-muted)' }}>No media yet — upload one above.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
