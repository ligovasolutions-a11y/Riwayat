import { getSetting } from './db'

export type AboutValue = { title: string; desc: string }

export type AboutContent = {
  hero: { label: string; heading: string; heading2: string; image: string }
  founder: {
    label: string
    heading: string
    heading2: string
    image: string
    paragraphs: string[]
    quoteText: string
    quoteCite: string
  }
  values: { label: string; heading: string; items: AboutValue[] }
  cta: { label: string; heading: string; text: string }
}

const DEFAULT_ABOUT: AboutContent = {
  hero: {
    label: 'Est. 1974',
    heading: 'Our',
    heading2: 'Story',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920&q=85&auto=format&fit=crop',
  },
  founder: {
    label: 'Our Founder',
    heading: 'A Vision Born',
    heading2: 'in Mumbai',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=85&auto=format&fit=crop',
    paragraphs: [
      "In 1974, Shri Rameshbhai Mehta opened a small jewellery workshop in the heart of Mumbai with a single vision: to create jewellery that was worthy of India's royal heritage but accessible to every deserving family.",
      'Starting with three master craftsmen and a workshop the size of a drawing room, he built what would become India\'s most trusted name in luxury jewellery. His philosophy was simple: never compromise on quality, and treat every customer like family.',
      'Today, his grandchildren carry that torch — with the same values, the same commitment to excellence, and an expanded vision that now includes the finest Swiss timepieces in the world.',
    ],
    quoteText: "We don't sell jewellery. We preserve memories.",
    quoteCite: '— Shri Rameshbhai Mehta, Founder',
  },
  values: {
    label: 'What We Stand For',
    heading: 'Our Values',
    items: [
      { title: 'Integrity', desc: 'Every gem certified. Every weight accurate. Every promise kept.' },
      { title: 'Craftsmanship', desc: 'Handcrafted by master artisans trained through three generations.' },
      { title: 'Heritage', desc: 'Rooted in five decades of Indian jewellery tradition.' },
      { title: 'Excellence', desc: 'No compromises — on quality, on service, on your experience.' },
    ],
  },
  cta: {
    label: 'Experience Riwaayat',
    heading: 'Visit Our Boutique',
    text: 'We would be honoured to welcome you to our Mumbai boutique. Our team is ready to guide you through five decades of curated excellence.',
  },
}

export function getAboutContent(): AboutContent {
  const raw = getSetting('about_page', '')
  if (!raw) return DEFAULT_ABOUT
  try {
    const parsed = JSON.parse(raw)
    return {
      hero: { ...DEFAULT_ABOUT.hero, ...parsed.hero },
      founder: { ...DEFAULT_ABOUT.founder, ...parsed.founder },
      values: { ...DEFAULT_ABOUT.values, ...parsed.values },
      cta: { ...DEFAULT_ABOUT.cta, ...parsed.cta },
    }
  } catch {
    return DEFAULT_ABOUT
  }
}
