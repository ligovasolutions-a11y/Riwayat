export type LinkItem = { label: string; href: string };

export type NavBlock = {
  logoLine1: string;
  logoLine2: string;
  tagline: string;
  announcement: string;
  topbarLeft: LinkItem[];
  topbarRight: LinkItem[];
  items: LinkItem[];
};

export type FooterBlock = {
  aboutText: string;
  social: { platform: string; href: string }[];
  columns: { title: string; links: LinkItem[] }[];
  copyright: string;
  payments: string[];
};

export type ContactInfoBlock = {
  address: string;
  phone: string;
  phoneHours: string;
  email: string;
  hoursWeekday: string;
  hoursWeekend: string;
};

export type HeroBlock = {
  eyebrow: string;
  heading: string; // may contain <em> — sanitized on save, rendered via dangerouslySetInnerHTML
  description: string;
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText: string;
  secondaryBtnHref: string;
};

export type TrustStripBlock = { items: string[] };

export type CategoriesBlock = {
  eyebrow: string;
  heading: string;
  description: string;
  items: { label: string; icon: string; href: string }[];
};

export type CollectionsBlock = {
  eyebrow: string;
  heading: string;
  items: { tag: string; title: string; href: string; variant: string }[];
};

export type StoryBlock = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  stats: { num: string; label: string }[];
  buttonText: string;
  buttonHref: string;
};

export type TestimonialsBlock = {
  eyebrow: string;
  heading: string;
  items: { quote: string; author: string; rating: number }[];
};

export type NewsletterBlock = { heading: string; description: string; buttonText: string };

export type PageHeaderBlock = { title: string; breadcrumb: string };

export type FiltersBlock = {
  categories: string[];
  metals: string[];
  gemstones: string[];
  priceRanges: string[];
};

export type HeroStoryBlock = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  stats: { num: string; label: string }[];
  monogram: string;
};

export type ValuesBlock = {
  eyebrow: string;
  heading: string;
  items: { icon: string; title: string; text: string }[];
};

export type AtelierBlock = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  buttonText: string;
  buttonHref: string;
  monogram: string;
};

export type InfoCardsBlock = {
  items: { icon: string; title: string; text: string }[];
};

export type FaqsBlock = {
  eyebrow: string;
  heading: string;
  items: { question: string; answer: string }[];
};

export type ContactFormBlock = { title: string };

export const BLOCK_SCHEMA_LABEL: Record<string, string> = {
  nav: 'Navigation',
  footer: 'Footer',
  contact_info: 'Contact Information',
  hero: 'Hero Banner',
  trust_strip: 'Trust Strip',
  categories: 'Shop By Category',
  collections: 'Shop By Collection',
  story: 'Our Craftsmanship',
  testimonials: 'Testimonials',
  newsletter: 'Newsletter Signup',
  page_header: 'Page Header',
  filters: 'Filters Sidebar',
  hero_story: 'Our Story',
  values: 'Our Values',
  atelier: 'The Atelier',
  info_cards: 'Info Cards',
  faqs: 'FAQs',
  contact_form: 'Contact Form Heading',
};
