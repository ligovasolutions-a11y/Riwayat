import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { listPublishedJournalPosts } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default function JournalPage() {
  const articles = listPublishedJournalPosts()
  if (articles.length === 0) {
    return (
      <main>
        <Navigation />
        <section className="pt-32 lg:pt-44 pb-16 px-6 lg:px-12 max-w-screen-2xl mx-auto">
          <p className="section-label mb-4">Riwaayat Journal</p>
          <h1 className="luxury-heading text-5xl lg:text-8xl text-rw-black leading-none">
            Stories &<br /><em className="italic">Expertise</em>
          </h1>
        </section>
        <Footer />
      </main>
    )
  }
  const [featured, ...rest] = articles
  return (
    <main>
      <Navigation />
      <section className="pt-32 lg:pt-44 pb-16 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <p className="section-label mb-4">Riwaayat Journal</p>
        <h1 className="luxury-heading text-5xl lg:text-8xl text-rw-black leading-none">
          Stories &<br /><em className="italic">Expertise</em>
        </h1>
      </section>

      {/* Featured */}
      <section className="px-6 lg:px-12 pb-16 lg:pb-24 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 pb-16 border-b border-rw-border">
          <Link href={`/journal/${featured.slug}`} className="overflow-hidden block" style={{ aspectRatio: '4/3' }}>
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </Link>
          <div className="flex flex-col justify-center">
            <p className="section-label mb-4">{featured.category}</p>
            <h2 className="luxury-heading text-3xl lg:text-5xl text-rw-black leading-tight mb-6">{featured.title}</h2>
            <p className="text-rw-gray font-sans font-light text-base leading-relaxed mb-8">{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase font-sans text-rw-gray mb-8">
              <span>{featured.published_date}</span><span>·</span><span>{featured.read_time}</span>
            </div>
            <Link href={`/journal/${featured.slug}`} className="btn-dark self-start">Read Article</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {rest.map((a) => (
            <Link key={a.id} href={`/journal/${a.slug}`} className="group block">
              <div className="overflow-hidden mb-5" style={{ aspectRatio: '4/3' }}>
                <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="section-label mb-3">{a.category}</p>
              <h3 className="luxury-heading text-xl lg:text-2xl text-rw-black leading-tight mb-3 group-hover:text-rw-gold transition-colors">{a.title}</h3>
              <p className="text-rw-gray font-sans font-light text-sm leading-relaxed mb-4">{a.excerpt}</p>
              <div className="flex items-center gap-3 text-[10px] tracking-wider uppercase font-sans text-rw-gray">
                <span>{a.published_date}</span><span>·</span><span>{a.read_time}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
