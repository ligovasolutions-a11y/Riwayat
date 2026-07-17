'use client';

import { useState } from 'react';
import { useAdminApi } from './CsrfContext';

export default function BlockEditorCard<T>({
  blockId, label, initialDraft, initialPublished, initialEnabled, previewHref, renderFields, onToast,
}: {
  blockId: number;
  label: string;
  initialDraft: T;
  initialPublished: T;
  initialEnabled: boolean;
  previewHref?: string;
  renderFields: (data: T, setData: (d: T) => void) => React.ReactNode;
  onToast: (text: string, error?: boolean) => void;
}) {
  const { call } = useAdminApi();
  const [data, setData] = useState<T>(initialDraft);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);
  const isDraftDirty = JSON.stringify(data) !== JSON.stringify(initialDraft);
  const hasUnpublishedChanges = JSON.stringify(initialDraft) !== JSON.stringify(initialPublished) || isDraftDirty;

  async function saveDraft() {
    setSaving(true);
    try {
      await call(`/api/admin/blocks/${blockId}`, { method: 'PATCH', body: { draftJson: JSON.stringify(data), enabled } });
      onToast(`${label}: draft saved`);
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Failed to save', true);
    }
    setSaving(false);
  }

  async function publish() {
    setSaving(true);
    try {
      await call(`/api/admin/blocks/${blockId}`, { method: 'PATCH', body: { draftJson: JSON.stringify(data), enabled, action: 'publish' } });
      onToast(`${label}: published — now live on the site`);
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Failed to publish', true);
    }
    setSaving(false);
  }

  async function discard() {
    if (!confirm(`Discard all unpublished changes to "${label}" and revert to the last published version?`)) return;
    setSaving(true);
    try {
      const res = await call(`/api/admin/blocks/${blockId}`, { method: 'PATCH', body: { action: 'discard' } });
      setData(JSON.parse(res.block.draftJson));
      onToast(`${label}: reverted to published version`);
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Failed to discard', true);
    }
    setSaving(false);
  }

  return (
    <div className="a-card">
      <div className="a-card-header">
        <h2>{label}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className={`a-badge ${!enabled ? 'a-badge-off' : hasUnpublishedChanges ? 'a-badge-draft' : 'a-badge-published'}`}>
            {!enabled ? 'Disabled' : hasUnpublishedChanges ? 'Unpublished changes' : 'Live'}
          </span>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', fontSize: 12.5 }}>
            <span className="a-toggle">
              <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
              <span className="a-toggle-track" />
            </span>
            Show on site
          </label>
        </div>
      </div>
      <div className="a-card-body">
        {renderFields(data, setData)}
        <div className="a-row" style={{ marginTop: 8 }}>
          <button type="button" className="a-btn" onClick={saveDraft} disabled={saving}>Save Draft</button>
          <button type="button" className="a-btn a-btn-gold" onClick={publish} disabled={saving}>Publish</button>
          <button type="button" className="a-btn a-btn-danger" onClick={discard} disabled={saving}>Discard Changes</button>
          {previewHref && <a href={previewHref} target="_blank" rel="noreferrer" className="a-btn">Preview ↗</a>}
        </div>
      </div>
    </div>
  );
}
