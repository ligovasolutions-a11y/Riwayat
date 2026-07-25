import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getSetting } from '@/lib/db'
import QuoteForm from './QuoteForm'

export const dynamic = 'force-dynamic'

export default function GetAQuotePage() {
  const phone = getSetting('phone', '+91 99999 88888')
  const email = getSetting('email', 'hello@riwaayatjewels.com')

  return (
    <main>
      <Navigation />
      <section className="pt-32 lg:pt-44 pb-20 lg:pb-32 px-6 lg:px-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left */}
            <div>
              <p className="section-label mb-4">Custom Enquiry</p>
              <h1 className="luxury-heading text-4xl lg:text-6xl xl:text-7xl text-rw-black leading-none mb-8">
                Get a<br /><em className="italic">Quote</em>
              </h1>
              <p className="text-rw-gray font-sans font-light text-base lg:text-lg leading-relaxed mb-10 max-w-md">
                Looking for pricing on a specific piece, a custom design, or a bulk enquiry? Share a few details
                and our team will get back to you with a personalised quote.
              </p>

              <div className="bg-rw-black p-8">
                <p className="text-rw-gold text-[10px] tracking-[0.3em] uppercase font-sans mb-3">Prefer to talk?</p>
                <div className="space-y-2 text-white/60 text-sm font-sans">
                  <div className="flex justify-between"><span>Phone</span><span>{phone}</span></div>
                  <div className="flex justify-between"><span>Email</span><span>{email}</span></div>
                </div>
                <hr className="border-white/10 my-4" />
                <p className="text-white/40 text-xs font-sans">
                  We typically respond to quote requests within 24 hours.
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
