import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { recentAuditLog } from '@/lib/audit';
import { isLocked } from '@/lib/auth';

export default async function SecurityPage() {
  const [users, audit] = await Promise.all([
    prisma.user.findMany({ select: { id: true, username: true, failedAttempts: true, lockedUntil: true, updatedAt: true, mustChangePassword: true } }),
    recentAuditLog(200),
  ]);

  return (
    <>
      <div className="a-card">
        <div className="a-card-header"><h2>Admin Accounts</h2><Link href="/admin/change-password" className="a-btn a-btn-sm">Change My Password</Link></div>
        <table className="a-table">
          <thead><tr><th>Username</th><th>Status</th><th>Failed Attempts</th><th>Password Last Changed</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>
                  {isLocked(u) ? (
                    <span className="a-badge a-badge-off" style={{ background: '#fbeceb', color: '#b3261e' }}>Locked until {u.lockedUntil?.toLocaleString('en-IN')}</span>
                  ) : u.mustChangePassword ? (
                    <span className="a-badge a-badge-draft">Must change password</span>
                  ) : (
                    <span className="a-badge a-badge-published">Active</span>
                  )}
                </td>
                <td>{u.failedAttempts}</td>
                <td>{u.updatedAt.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="a-card">
        <div className="a-card-header"><h2>Audit Log</h2><span style={{ fontSize: 12, color: 'var(--a-text-muted)' }}>Most recent 200 events</span></div>
        <table className="a-table">
          <thead><tr><th>When</th><th>User</th><th>Action</th><th>Detail</th><th>IP</th></tr></thead>
          <tbody>
            {audit.length === 0 && <tr><td colSpan={5} style={{ color: 'var(--a-text-muted)' }}>No activity yet.</td></tr>}
            {audit.map((a) => (
              <tr key={a.id}>
                <td>{a.createdAt.toLocaleString('en-IN')}</td>
                <td>{a.username || '—'}</td>
                <td>{a.action}</td>
                <td>{a.detail || ''}</td>
                <td style={{ fontSize: 12, color: 'var(--a-text-muted)' }}>{a.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
