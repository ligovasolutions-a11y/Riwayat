'use client';

import { useRef, useEffect } from 'react';

/* Minimal contentEditable-based rich text editor (bold, italic, links,
   lists, paragraphs) — intentionally not a full WYSIWYG library, to
   keep the dependency/attack surface small for an admin-only tool.
   The HTML it produces is sanitized server-side (lib/sanitize.ts
   richTextBlock) before ever being saved, regardless of what the
   browser's execCommand output looks like. */
export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (ref.current && isFirstRender.current) {
      ref.current.innerHTML = value;
      isFirstRender.current = false;
    }
  }, [value]);

  function exec(command: string, arg?: string) {
    document.execCommand(command, false, arg);
    ref.current?.focus();
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function onLink() {
    const url = prompt('Link URL (https://…):');
    if (url) exec('createLink', url);
  }

  return (
    <div className="a-field">
      <label>Article Body</label>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        <button type="button" className="a-btn a-btn-sm" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')}><b>B</b></button>
        <button type="button" className="a-btn a-btn-sm" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')}><i>I</i></button>
        <button type="button" className="a-btn a-btn-sm" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('formatBlock', 'p')}>Paragraph</button>
        <button type="button" className="a-btn a-btn-sm" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('formatBlock', 'h2')}>Heading</button>
        <button type="button" className="a-btn a-btn-sm" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertUnorderedList')}>List</button>
        <button type="button" className="a-btn a-btn-sm" onMouseDown={(e) => e.preventDefault()} onClick={onLink}>Link</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => ref.current && onChange(ref.current.innerHTML)}
        onBlur={() => ref.current && onChange(ref.current.innerHTML)}
        style={{
          minHeight: 220, border: '1px solid var(--a-border)', borderRadius: 6, padding: '12px 14px',
          background: '#fff', fontSize: 14.5, lineHeight: 1.7,
        }}
      />
    </div>
  );
}
