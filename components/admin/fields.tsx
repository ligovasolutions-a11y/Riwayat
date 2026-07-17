'use client';

import { ICON_KEYS, IconGlyph } from '@/lib/icons';

export function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="a-field">
      <label>{label}</label>
      <input type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function TextAreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="a-field">
      <label>{label}</label>
      <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

// For a paragraphs[] array edited as one textarea, one paragraph per line.
export function ParagraphsField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="a-field">
      <label>{label}</label>
      <textarea
        rows={5}
        value={value.join('\n\n')}
        onChange={(e) => onChange(e.target.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean))}
      />
    </div>
  );
}

// For a string[] array (e.g. trust strip items, filter category labels) edited one-per-line.
export function LinesField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="a-field">
      <label>{label} (one per line)</label>
      <textarea
        rows={4}
        value={value.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n').map((p) => p.trim()).filter(Boolean))}
      />
    </div>
  );
}

export function IconPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="a-field">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <IconGlyph name={value} style={{ width: 22, height: 22, color: 'var(--a-gold-dark)' }} />
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
    </div>
  );
}

export function NumberField({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="a-field">
      <label>{label}</label>
      <input type="number" value={value} min={min} max={max} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textTransform: 'none', fontSize: 13.5, color: 'var(--a-text)' }}>
      <span className="a-toggle">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="a-toggle-track" />
      </span>
      {label}
    </label>
  );
}

/* Generic array-of-objects editor: renders each item via renderItem,
   with Move Up/Down/Delete controls and an Add button. Used for nav
   links, testimonials, FAQs, cards, stats, etc. */
export function RepeatingList<T>({
  items, onChange, renderItem, newItem, addLabel = '+ Add Item', itemLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  newItem: () => T;
  addLabel?: string;
  itemLabel?: (item: T, index: number) => string;
}) {
  function update(index: number, patch: Partial<T>) {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }
  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...items, newItem()]);
  }

  return (
    <div>
      {items.map((item, i) => (
        <div className="a-repeat-item" key={i}>
          {itemLabel && <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--a-text-muted)', marginBottom: 8 }}>{itemLabel(item, i)}</div>}
          {renderItem(item, (patch) => update(i, patch), i)}
          <div className="a-repeat-item-toolbar">
            <button type="button" className="a-btn a-btn-sm" onClick={() => move(i, -1)} disabled={i === 0}>↑ Move Up</button>
            <button type="button" className="a-btn a-btn-sm" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓ Move Down</button>
            <button type="button" className="a-btn a-btn-sm a-btn-danger" onClick={() => remove(i)}>🗑 Delete</button>
          </div>
        </div>
      ))}
      <button type="button" className="a-btn a-repeat-add" onClick={add}>{addLabel}</button>
    </div>
  );
}
