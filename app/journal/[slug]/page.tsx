import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getJournalPostBySlug, listPublishedJournalPosts } from '@/lib/content'
import { db } from '@/lib/db'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getJournalPostBySlug(params.slug)
  if (!post) return {}
  return { title: `${post.title} – Riwaayat Jewels`, description: post.excerpt }
}

export default function JournalArticlePage({ params }: { params: { slug: string } }) {
  const post = getJournalPostBySlug(params.slug)
  if (!post || post.status !== 'published') notFound()

  db.prepare('UPDATE journal_posts SET views = views + 1 WHERE id = ?').run(post.id)

  const related = listPublishedJournalPosts().filter((p) => p.id !== post.id).slice(0, 3)

  return (
    <main>
      <Navigation />
      <section className="pt-32 lg:pt-44 pb-12 px-6 lg:px-12 max-w-screen-xl mx-auto">
        <p className="section-label mb-4">{post.category}</p>
        <h1 className="luxury-heading text-3xl lg:text-6xl text-rw-black leading-tight mb-6 max-w-3xl">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase font-sans text-rw-gray">
          <span>{post.published_date}</span>
          {post.read_time && <><span>·</span><span>{post.read_time}</span></>}
        </div>
      </section>

      {post.image && (
        <section className="px-6 lg:px-12 max-w-screen-xl mx-auto mb-12 lg:mb-16">
          <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </section>
      )}

      <section className="px-6 lg:px-12 max-w-screen-md mx-auto pb-20 lg:pb-32">
        <div className="text-rw-gray font-sans font-light text-base lg:text-lg leading-relaxed space-y-6">
          {(post.content || post.excerpt).split('\n').filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <Link href="/journal" className="inline-block mt-12 text-xs tracking-widest uppercase font-sans text-rw-black hover:text-rw-gold transition-colors border-b border-rw-black hover:border-rw-gold pb-1">
          ← Back to Journal
        </Link>
      </section>

      {related.length > 0 && (
        <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto pb-20 lg:pb-32 border-t border-rw-border pt-16">
          <p className="section-label mb-8">More From the Journal</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {related.map((a) => (
              <Link key={a.id} href={`/journal/${a.slug}`} className="group block">
                <div className="overflow-hidden mb-5" style={{ aspectRatio: '4/3' }}>
                  <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <p className="section-label mb-3">{a.category}</p>
                <h3 className="luxury-heading text-xl text-rw-black leading-tight group-hover:text-rw-gold transition-colors">{a.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
