'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useAdminApi } from './CsrfContext';

export default function Topbar({ username }: { username: string }) {
  const router = useRouter();
  const { call } = useAdminApi();
  const [loggingOut, setLoggingOut] = useState(false);

  async function onLogout() {
    setLoggingOut(true);
    try {
      await call('/api/admin/logout', { method: 'POST' });
    } catch {
      // Even if the request fails, still send the user to the login
      // screen — the session cookie may already be gone.
    }
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="a-topbar">
      <h1>Riwayat Jewels Admin</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" target="_blank" className="a-btn a-btn-sm">View Site ↗</Link>
        <span style={{ fontSize: 13, color: 'var(--a-text-muted)' }}>{username}</span>
        <button className="a-btn a-btn-sm" onClick={onLogout} disabled={loggingOut}>
          {loggingOut ? 'Signing Out…' : 'Log Out'}
        </button>
      </div>
    </div>
  );
}
