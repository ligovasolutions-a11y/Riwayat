import Link from 'next/link'
import { listPublishedJournalPosts } from '@/lib/content'

export default function Journal() {
  const articles = listPublishedJournalPosts(3)
  if (articles.length === 0) return null
  const [featured, ...rest] = articles

  return (
    <section className="py-20 lg:py-32 px-6 lg:px-12 max-w-screen-2xl mx-auto">
      <div className="flex items-end justify-between mb-12 lg:mb-16">
        <div>
          <p className="section-label mb-3">Riwaayat Journal</p>
          <h2 className="luxury-heading text-4xl lg:text-6xl xl:text-7xl text-rw-black leading-none">
            Stories &<br /><em className="italic">Expertise</em>
          </h2>
        </div>
        <Link
          href="/journal"
          className="hidden lg:block text-xs tracking-widest uppercase font-sans text-rw-black hover:text-rw-gold transition-colors border-b border-rw-black hover:border-rw-gold pb-1"
        >
          Read All Articles
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Featured */}
        <div className="lg:col-span-2 group cursor-pointer">
          <Link href={`/journal/${featured.slug}`}>
            <div className="overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </Link>
          <p className="section-label mb-3">{featured.category}</p>
          <Link href={`/journal/${featured.slug}`}>
            <h3 className="luxury-heading text-2xl lg:text-4xl text-rw-black font-light leading-tight mb-4 hover:text-rw-gold transition-colors">
              {featured.title}
            </h3>
          </Link>
          <p className="text-rw-gray font-sans font-light text-base leading-relaxed mb-4 max-w-lg">
            {featured.excerpt}
          </p>
          <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase font-sans text-rw-gray">
            <span>{featured.published_date}</span>
            <span>·</span>
            <span>{featured.read_time}</span>
          </div>
        </div>

        {/* Side articles */}
        <div className="space-y-8">
          {rest.map((article) => (
            <Link
              key={article.id}
              href={`/journal/${article.slug}`}
              className="group cursor-pointer flex gap-5 border-b border-rw-border pb-8 last:border-0 last:pb-0"
            >
              <div className="overflow-hidden flex-shrink-0 w-28 h-28">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex-1">
                <p className="text-rw-gold text-[9px] tracking-[0.3em] uppercase font-sans mb-2">{article.category}</p>
                <h4 className="luxury-heading text-lg text-rw-black font-light leading-tight mb-2 group-hover:text-rw-gold transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-3 text-[9px] tracking-wider uppercase font-sans text-rw-gray">
                  <span>{article.published_date}</span>
                  <span>·</span>
                  <span>{article.read_time}</span>
                </div>
              </div>
            </Link>
          ))}
          <Link href="/journal" className="block text-center btn-outline-gold text-xs">
            Read All Articles
          </Link>
        </div>
      </div>
    </section>
  )
}
