'use client';

import { useState } from 'react';
import { useAdminApi, useToast } from '@/components/admin/CsrfContext';
import Toast from '@/components/admin/Toast';

type Enquiry = { id: number; name: string; email: string; phone: string | null; message: string; source: string; createdAt: string };

export default function EnquiriesClient({ enquiries: initial }: { enquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState(initial);
  const { call } = useAdminApi();
  const { message, show } = useToast();

  async function onDelete(e: Enquiry) {
    if (!confirm(`Delete this enquiry from ${e.name}?`)) return;
    try {
      await call(`/api/admin/enquiries/${e.id}`, { method: 'DELETE' });
      setEnquiries((list) => list.filter((x) => x.id !== e.id));
      show('Enquiry deleted');
    } catch (err) {
      show(err instanceof Error ? err.message : 'Failed to delete', true);
    }
  }

  return (
    <div className="a-card">
      <div className="a-card-header">
        <h2>Enquiries ({enquiries.length})</h2>
        {/* Plain <a>, not next/link: this triggers a real file download from
            an API route, not a client-side page navigation. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/admin/enquiries?format=csv" className="a-btn a-btn-gold">⬇ Export CSV</a>
      </div>
      <table className="a-table">
        <thead><tr><th>Date</th><th>Source</th><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th></th></tr></thead>
        <tbody>
          {enquiries.map((e) => (
            <tr key={e.id}>
              <td>{new Date(e.createdAt).toLocaleString('en-IN')}</td>
              <td><span className="a-badge a-badge-off">{e.source}</span></td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.phone || '—'}</td>
              <td style={{ maxWidth: 260 }}>{e.message || '—'}</td>
              <td><button type="button" className="a-btn a-btn-sm a-btn-danger" onClick={() => onDelete(e)}>Delete</button></td>
            </tr>
          ))}
          {enquiries.length === 0 && <tr><td colSpan={7} style={{ color: 'var(--a-text-muted)' }}>No enquiries yet.</td></tr>}
        </tbody>
      </table>
      <Toast message={message} />
    </div>
  );
}
