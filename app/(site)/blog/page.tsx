import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await prisma.seoMeta.findUnique({ where: { page: 'blog' } });
  if (!seo) return {};
  return { title: seo.title, description: seo.description, keywords: seo.keywords };
}

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Journal</h1>
          <div className="breadcrumb"><Link href="/">Home</Link> / Journal</div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No articles published yet.</p>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
                  <div className="blog-card-media">
                    {post.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/uploads/${post.coverImage}`} alt={post.title} />
                    )}
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-card-date">
                      {post.publishedAt?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
