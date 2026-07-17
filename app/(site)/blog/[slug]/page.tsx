import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { safeJsonLd } from '@/lib/sanitize';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== 'published') return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: post.coverImage ? [`/uploads/${post.coverImage}`] : undefined },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== 'published') notFound();

  const nonce = (await headers()).get('x-nonce') || undefined;
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? `${siteUrl}/uploads/${post.coverImage}` : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <section className="section">
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }}
      />
      <div className="container blog-article">
        <div className="breadcrumb" style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          <Link href="/">Home</Link> / <Link href="/blog">Journal</Link> / {post.title}
        </div>
        <div className="blog-article-meta">
          {post.publishedAt?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <h1>{post.title}</h1>
        {post.coverImage && (
          <div className="blog-article-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/uploads/${post.coverImage}`} alt={post.title} />
          </div>
        )}
        {/* contentHtml is sanitized server-side (lib/sanitize.ts richTextBlock)
            before it is ever saved — see app/api/admin/blog/[id]/route.ts */}
        <div className="blog-article-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </div>
    </section>
  );
}
