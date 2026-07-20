import { getHomepageContent } from '@/lib/homepage'
import HeroClient from './HeroClient'

export default function Hero() {
  const { heroSlides, heroButtons } = getHomepageContent()
  return <HeroClient slides={heroSlides} buttons={heroButtons} />
}
