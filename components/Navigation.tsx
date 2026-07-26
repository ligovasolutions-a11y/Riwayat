import { getSetting } from '@/lib/db'
import { listActiveJewelleryCategories } from '@/lib/content'
import NavigationClient from './NavigationClient'

export default function Navigation() {
  const announcement = getSetting(
    'announcement',
    'Free Shipping on Orders Above ₹50,000 | Book a Private Consultation | ISO Certified Gems'
  )
  const jewelleryCategories = listActiveJewelleryCategories().map((c) => c.name)
  return <NavigationClient announcement={announcement} jewelleryCategories={jewelleryCategories} />
}
