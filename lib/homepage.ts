import { getSetting } from './db'

export type HeroSlide = { image: string; label: string; headline: string; headline2: string; sub: string }

export type HomepageContent = {
  heroSlides: HeroSlide[]
  heroButtons: { btn1: string; btn2: string; btn3: string }
  announcement: string
  sections: Record<string, unknown>
}

export function getHomepageContent(): HomepageContent {
  return {
    heroSlides: JSON.parse(getSetting('hero_slides', '[]')),
    heroButtons: {
      btn1: getSetting('hero_btn1', 'Explore Jewellery'),
      btn2: getSetting('hero_btn2', 'Explore Watches'),
      btn3: getSetting('hero_btn3', 'Book Private Consultation'),
    },
    announcement: getSetting('announcement', ''),
    sections: JSON.parse(getSetting('homepage_sections', '{}')),
  }
}
