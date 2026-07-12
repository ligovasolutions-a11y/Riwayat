'use client'

import Link from 'next/link'

const articles = [
  {
    category: 'Watch Guide',
    title: 'The Ultimate Guide to Buying Your First Rolex',
    excerpt: 'Everything you need to know about references, movement types, and what to look for when purchasing your first Rolex timepiece.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=85&auto=format&fit=crop',
    date: 'June 2024',
    readTime: '8 min read',
    href: '/journal/guide-to-buying-rolex',
    featured: true,
  },
  {
    category: 'Bridal',
    title: 'How to Choose Your Wedding Jewellery Set',
    excerpt: 'Expert advice on selecting the perfect bridal ensemble that complements your wedding outfit and personal style.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=85&auto=format&fit=crop',
    date: 'May 2024',
    readTime: '6 min read',
    href: '/journal/choosing-wedding-jewellery',
    featured: false,
  },
  {
    category: 'Diamond Education',
    title: 'Understanding the 4Cs of Diamond Quality',
    excerpt: 'A comprehensive breakdown of Cut, Color, Clarity, and Carat — and why they matter for your diamond purchase.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=85&auto=format&fit=crop',
    date: 'April 2024',
    readTime: '10 min read',
    href: '/journal/4cs-of-diamonds',
    featured: false,
  },
]

export default function Journal() {
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
          <div className="overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <p className="section-label mb-3">{featured.category}</p>
          <Link href={featured.href}>
            <h3 className="luxury-heading text-2xl lg:text-4xl text-rw-black font-light leading-tight mb-4 hover:text-rw-gold transition-colors">
              {featured.title}
            </h3>
          </Link>
          <p className="text-rw-gray font-sans font-light text-base leading-relaxed mb-4 max-w-lg">
            {featured.excerpt}
          </p>
          <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase font-sans text-rw-gray">
            <span>{featured.date}</span>
            <span>·</span>
            <span>{featured.readTime}</span>
          </div>
        </div>

        {/* Side articles */}
        <div className="space-y-8">
          {rest.map((article) => (
            <div key={article.title} className="group cursor-pointer flex gap-5 border-b border-rw-border pb-8 last:border-0 last:pb-0">
              <div className="overflow-hidden flex-shrink-0 w-28 h-28">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex-1">
                <p className="text-rw-gold text-[9px] tracking-[0.3em] uppercase font-sans mb-2">{article.category}</p>
                <Link href={article.href}>
                  <h4 className="luxury-heading text-lg text-rw-black font-light leading-tight mb-2 hover:text-rw-gold transition-colors">
                    {article.title}
                  </h4>
                </Link>
                <div className="flex items-center gap-3 text-[9px] tracking-wider uppercase font-sans text-rw-gray">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          ))}
          <Link href="/journal" className="block text-center btn-outline-gold text-xs">
            Read All Articles
          </Link>
        </div>
      </div>
    </section>
  )
}
