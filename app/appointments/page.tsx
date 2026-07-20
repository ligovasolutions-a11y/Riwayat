import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getSetting } from '@/lib/db'
import AppointmentBookingContent from './AppointmentBookingContent'

export const dynamic = 'force-dynamic'

export default function AppointmentsPage() {
  const address = getSetting('address', '123 Luxury Lane, Bandra West, Mumbai — 400050')

  return (
    <main>
      <Navigation />
      <section className="pt-32 lg:pt-44 pb-20 lg:pb-32 px-6 lg:px-12">
        <div className="max-w-screen-xl mx-auto">
          <AppointmentBookingContent address={address} />
        </div>
      </section>
      <Footer />
    </main>
  )
}
