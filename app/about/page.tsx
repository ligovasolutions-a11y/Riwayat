import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AIConsierge from '@/components/AIConsierge'
import Link from 'next/link'
import { getAboutContent } from '@/lib/about'

export const dynamic = 'force-dynamic'

export default function AboutPage() {
  const { hero, founder, values, cta } = getAboutContent()

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src={hero.image}
          alt="Riwaayat Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-24">
          <p className="section-label mb-4 text-rw-gold">{hero.label}</p>
          <h1 className="luxury-heading text-5xl lg:text-8xl text-white leading-none">
            {hero.heading}<br /><em className="italic">{hero.heading2}</em>
          </h1>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 lg:py-32 px-6 lg:px-12 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div style={{ aspectRatio: '3/4' }} className="overflow-hidden">
            <img
              src={founder.image}
              alt="Founder"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="section-label mb-4">{founder.label}</p>
            <h2 className="luxury-heading text-3xl lg:text-5xl text-rw-black leading-none mb-8">
              {founder.heading}<br /><em className="italic">{founder.heading2}</em>
            </h2>
            {founder.paragraphs.map((p, i) => (
              <p key={i} className="text-rw-gray font-sans font-light text-base lg:text-lg leading-relaxed mb-6 last:mb-10">
                {p}
              </p>
            ))}
            {founder.quoteText && (
              <blockquote className="border-l-2 border-rw-gold pl-6 italic font-serif text-xl text-rw-black">
                "{founder.quoteText}"
                {founder.quoteCite && (
                  <cite className="block text-xs font-sans not-italic text-rw-gray mt-3 tracking-widest uppercase">{founder.quoteCite}</cite>
                )}
              </blockquote>
            )}
          </div>
        </div>
      </section>

      {/* Values */}
      {values.items.length > 0 && (
        <section className="py-20 lg:py-24 bg-rw-black">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <p className="section-label mb-4">{values.label}</p>
            <h2 className="luxury-heading text-3xl lg:text-5xl text-white leading-none mb-16">
              {values.heading}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
              {values.items.map((v) => (
                <div key={v.title} className="bg-rw-black p-8 lg:p-10">
                  <h3 className="font-serif text-2xl font-light text-rw-gold mb-4">{v.title}</h3>
                  <p className="text-white/50 font-sans font-light text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 lg:py-24 text-center px-6">
        <p className="section-label mb-4">{cta.label}</p>
        <h2 className="luxury-heading text-3xl lg:text-5xl text-rw-black mb-8">
          {cta.heading}
        </h2>
        <p className="text-rw-gray font-sans font-light max-w-md mx-auto mb-8">
          {cta.text}
        </p>
        <Link href="/appointments" className="btn-gold">
          Book a Private Appointment
        </Link>
      </section>

      <Footer />
      <AIConsierge />
    </main>
  )
}
