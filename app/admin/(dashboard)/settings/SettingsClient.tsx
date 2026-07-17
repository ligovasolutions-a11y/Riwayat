'use client';

import { useState } from 'react';
import { useAdminApi, useToast } from '@/components/admin/CsrfContext';
import Toast from '@/components/admin/Toast';
import { TextField } from '@/components/admin/fields';
import ImagePicker from '@/components/admin/ImagePicker';

type Settings = {
  siteName: string; logoText1: string; logoText2: string; logoImage: string | null; favicon: string | null;
  colorGold: string; colorMaroon: string; colorCream: string; colorBlack: string;
};

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="a-field">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: 44, padding: 2 }} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

export default function SettingsClient({ initial }: { initial: Settings }) {
  const { call } = useAdminApi();
  const { message, show } = useToast();
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function onSave() {
    setSaving(true);
    try {
      await call('/api/admin/settings', { method: 'PATCH', body: data });
      show('Settings saved — reload the site to see changes');
    } catch (err) {
      show(err instanceof Error ? err.message : 'Failed to save', true);
    }
    setSaving(false);
  }

  return (
    <div className="a-card">
      <div className="a-card-header"><h2>Site Settings</h2></div>
      <div className="a-card-body">
        <TextField label="Site Name" value={data.siteName} onChange={(v) => setData({ ...data, siteName: v })} />
        <div className="a-row">
          <TextField label="Logo Text (Line 1)" value={data.logoText1} onChange={(v) => setData({ ...data, logoText1: v })} />
          <TextField label="Logo Text (Line 2, accent color)" value={data.logoText2} onChange={(v) => setData({ ...data, logoText2: v })} />
        </div>
        <ImagePicker label="Logo Image (optional — replaces text logo if set)" value={data.logoImage} onChange={(v) => setData({ ...data, logoImage: v })} />
        <ImagePicker label="Favicon (optional)" value={data.favicon} onChange={(v) => setData({ ...data, favicon: v })} />
        <div className="a-row">
          <ColorField label="Gold Accent" value={data.colorGold} onChange={(v) => setData({ ...data, colorGold: v })} />
          <ColorField label="Maroon Accent" value={data.colorMaroon} onChange={(v) => setData({ ...data, colorMaroon: v })} />
        </div>
        <div className="a-row">
          <ColorField label="Cream Background" value={data.colorCream} onChange={(v) => setData({ ...data, colorCream: v })} />
          <ColorField label="Ink / Black Text" value={data.colorBlack} onChange={(v) => setData({ ...data, colorBlack: v })} />
        </div>
        <button type="button" className="a-btn a-btn-gold" onClick={onSave} disabled={saving}>Save Settings</button>
      </div>
      <Toast message={message} />
    </div>
  );
}
