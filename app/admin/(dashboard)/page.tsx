import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { recentAuditLog } from '@/lib/audit';

export default async function DashboardOverviewPage() {
  const [productCount, publishedPosts, draftPosts, enquiryCount, lastEditedBlock, audit] = await Promise.all([
    prisma.product.count(),
    prisma.blogPost.count({ where: { status: 'published' } }),
    prisma.blogPost.count({ where: { status: 'draft' } }),
    prisma.enquiry.count(),
    prisma.contentBlock.findFirst({ orderBy: { updatedAt: 'desc' } }),
    recentAuditLog(15),
  ]);

  return (
    <>
      <div className="a-stats">
        <div className="a-stat-tile"><div className="num">{productCount}</div><div className="label">Products</div></div>
        <div className="a-stat-tile"><div className="num">{publishedPosts}</div><div className="label">Published Posts</div></div>
        <div className="a-stat-tile"><div className="num">{draftPosts}</div><div className="label">Draft Posts</div></div>
        <div className="a-stat-tile"><div className="num">{enquiryCount}</div><div className="label">Enquiries</div></div>
      </div>

      <div className="a-grid-2">
        <div className="a-card">
          <div className="a-card-header"><h2>Quick Links</h2></div>
          <div className="a-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/admin/pages/home" className="a-btn">Edit Home Page</Link>
            <Link href="/admin/products" className="a-btn">Manage Products</Link>
            <Link href="/admin/blog" className="a-btn">Write A Blog Post</Link>
            <Link href="/admin/enquiries" className="a-btn">View Enquiries</Link>
          </div>
        </div>

        <div className="a-card">
          <div className="a-card-header"><h2>Last Edited</h2></div>
          <div className="a-card-body">
            {lastEditedBlock ? (
              <p style={{ fontSize: 13.5 }}>
                <strong>{lastEditedBlock.label}</strong> ({lastEditedBlock.page}) — updated{' '}
                {lastEditedBlock.updatedAt.toLocaleString('en-IN')}
                {lastEditedBlock.updatedBy && <> by {lastEditedBlock.updatedBy}</>}
              </p>
            ) : (
              <p style={{ color: 'var(--a-text-muted)', fontSize: 13.5 }}>No edits yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-header"><h2>Recent Activity</h2><Link href="/admin/security" className="a-btn a-btn-sm">View Full Log</Link></div>
        <table className="a-table">
          <thead><tr><th>When</th><th>User</th><th>Action</th><th>Detail</th></tr></thead>
          <tbody>
            {audit.length === 0 && <tr><td colSpan={4} style={{ color: 'var(--a-text-muted)' }}>No activity yet.</td></tr>}
            {audit.map((a) => (
              <tr key={a.id}>
                <td>{a.createdAt.toLocaleString('en-IN')}</td>
                <td>{a.username || '—'}</td>
                <td>{a.action}</td>
                <td>{a.detail || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
