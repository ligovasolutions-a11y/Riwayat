import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AIConsierge from '@/components/AIConsierge'
import Link from 'next/link'

const values = [
  { title: 'Integrity', desc: 'Every gem certified. Every weight accurate. Every promise kept.' },
  { title: 'Craftsmanship', desc: 'Handcrafted by master artisans trained through three generations.' },
  { title: 'Heritage', desc: 'Rooted in five decades of Indian jewellery tradition.' },
  { title: 'Excellence', desc: 'No compromises — on quality, on service, on your experience.' },
]

export default function AboutPage() {
  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920&q=85&auto=format&fit=crop"
          alt="Riwaayat Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-24">
          <p className="section-label mb-4 text-rw-gold">Est. 1974</p>
          <h1 className="luxury-heading text-5xl lg:text-8xl text-white leading-none">
            Our<br /><em className="italic">Story</em>
          </h1>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 lg:py-32 px-6 lg:px-12 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div style={{ aspectRatio: '3/4' }} className="overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=85&auto=format&fit=crop"
              alt="Founder"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="section-label mb-4">Our Founder</p>
            <h2 className="luxury-heading text-3xl lg:text-5xl text-rw-black leading-none mb-8">
              A Vision Born<br /><em className="italic">in Mumbai</em>
            </h2>
            <p className="text-rw-gray font-sans font-light text-base lg:text-lg leading-relaxed mb-6">
              In 1974, Shri Rameshbhai Mehta opened a small jewellery workshop in the heart of Mumbai with a single vision: 
              to create jewellery that was worthy of India's royal heritage but accessible to every deserving family.
            </p>
            <p className="text-rw-gray font-sans font-light text-base lg:text-lg leading-relaxed mb-6">
              Starting with three master craftsmen and a workshop the size of a drawing room, he built what would become 
              India's most trusted name in luxury jewellery. His philosophy was simple: never compromise on quality, 
              and treat every customer like family.
            </p>
            <p className="text-rw-gray font-sans font-light text-base lg:text-lg leading-relaxed mb-10">
              Today, his grandchildren carry that torch — with the same values, the same commitment to excellence, 
              and an expanded vision that now includes the finest Swiss timepieces in the world.
            </p>
            <blockquote className="border-l-2 border-rw-gold pl-6 italic font-serif text-xl text-rw-black">
              "We don't sell jewellery. We preserve memories."
              <cite className="block text-xs font-sans not-italic text-rw-gray mt-3 tracking-widest uppercase">— Shri Rameshbhai Mehta, Founder</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-24 bg-rw-black">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <p className="section-label mb-4">What We Stand For</p>
          <h2 className="luxury-heading text-3xl lg:text-5xl text-white leading-none mb-16">
            Our <em className="italic text-rw-gold">Values</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {values.map((v) => (
              <div key={v.title} className="bg-rw-black p-8 lg:p-10">
                <h3 className="font-serif text-2xl font-light text-rw-gold mb-4">{v.title}</h3>
                <p className="text-white/50 font-sans font-light text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24 text-center px-6">
        <p className="section-label mb-4">Experience Riwaayat</p>
        <h2 className="luxury-heading text-3xl lg:text-5xl text-rw-black mb-8">
          Visit Our Boutique
        </h2>
        <p className="text-rw-gray font-sans font-light max-w-md mx-auto mb-8">
          We would be honoured to welcome you to our Mumbai boutique. Our team is ready to guide you through 
          five decades of curated excellence.
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
