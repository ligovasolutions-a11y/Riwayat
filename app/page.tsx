import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import FeaturedCollections from '@/components/FeaturedCollections'
import LuxuryWatches from '@/components/LuxuryWatches'
import SignatureJewellery from '@/components/SignatureJewellery'
import Craftsmanship from '@/components/Craftsmanship'
import Heritage from '@/components/Heritage'
import PrivateAppointments from '@/components/PrivateAppointments'
import Testimonials from '@/components/Testimonials'
import Journal from '@/components/Journal'
import InstagramGallery from '@/components/InstagramGallery'
import Footer from '@/components/Footer'
import AIConsierge from '@/components/AIConsierge'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main>
      <Navigation />
      <Hero />
      <FeaturedCollections />
      <LuxuryWatches />
      <SignatureJewellery />
      <Craftsmanship />
      <Heritage />
      <PrivateAppointments />
      <Testimonials />
      <Journal />
      <InstagramGallery />
      <Footer />
      <AIConsierge />
    </main>
  )
}
