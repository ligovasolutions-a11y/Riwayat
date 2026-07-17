import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: 'desc' } });

  return (
    <div className="a-card">
      <div className="a-card-header">
        <h2>Blog Posts ({posts.length})</h2>
        <Link href="/admin/blog/new" className="a-btn a-btn-gold">+ New Post</Link>
      </div>
      <table className="a-table">
        <thead><tr><th>Title</th><th>Status</th><th>Updated</th><th></th></tr></thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td><span className={`a-badge ${p.status === 'published' ? 'a-badge-published' : 'a-badge-draft'}`}>{p.status}</span></td>
              <td>{p.updatedAt.toLocaleDateString('en-IN')}</td>
              <td><Link href={`/admin/blog/${p.id}`} className="a-btn a-btn-sm">Edit</Link></td>
            </tr>
          ))}
          {posts.length === 0 && <tr><td colSpan={4} style={{ color: 'var(--a-text-muted)' }}>No posts yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
