import { getSetting } from '@/lib/db'
import NavigationClient from './NavigationClient'

export default function Navigation() {
  const announcement = getSetting(
    'announcement',
    'Free Shipping on Orders Above ₹50,000 | Book a Private Consultation | ISO Certified Gems'
  )
  return <NavigationClient announcement={announcement} />
}
