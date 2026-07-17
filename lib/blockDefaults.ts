// Fallback content used only if a block is missing or disabled in the
// database (e.g. right after a fresh install before seeding, or if an
// admin disables something essential). Keeps the site from crashing;
// normal operation always uses the database content.
import type {
  NavBlock, FooterBlock, ContactInfoBlock, HeroBlock, TrustStripBlock, CategoriesBlock,
  CollectionsBlock, StoryBlock, TestimonialsBlock, NewsletterBlock, PageHeaderBlock,
  FiltersBlock, HeroStoryBlock, ValuesBlock, AtelierBlock, InfoCardsBlock, FaqsBlock, ContactFormBlock,
} from './blockTypes';

export const DEFAULT_NAV: NavBlock = {
  logoLine1: 'Riwayat', logoLine2: 'Jewels', tagline: 'Fine Jewellery',
  announcement: '', topbarLeft: [], topbarRight: [],
  items: [{ label: 'Shop', href: '/shop' }, { label: 'Our Story', href: '/about' }, { label: 'Contact', href: '/contact' }],
};

export const DEFAULT_FOOTER: FooterBlock = {
  aboutText: '', social: [], columns: [], copyright: `© ${new Date().getFullYear()} Riwayat Jewels.`, payments: [],
};

export const DEFAULT_CONTACT_INFO: ContactInfoBlock = {
  address: '', phone: '', phoneHours: '', email: '', hoursWeekday: '', hoursWeekend: '',
};

export const DEFAULT_HERO: HeroBlock = {
  eyebrow: '', heading: 'Riwayat Jewels', description: '', primaryBtnText: 'Shop Now', primaryBtnHref: '/shop', secondaryBtnText: '', secondaryBtnHref: '#',
};

export const DEFAULT_TRUST_STRIP: TrustStripBlock = { items: [] };
export const DEFAULT_CATEGORIES: CategoriesBlock = { eyebrow: '', heading: '', description: '', items: [] };
export const DEFAULT_COLLECTIONS: CollectionsBlock = { eyebrow: '', heading: '', items: [] };
export const DEFAULT_STORY: StoryBlock = { eyebrow: '', heading: '', paragraphs: [], stats: [], buttonText: '', buttonHref: '#' };
export const DEFAULT_TESTIMONIALS: TestimonialsBlock = { eyebrow: '', heading: '', items: [] };
export const DEFAULT_NEWSLETTER: NewsletterBlock = { heading: 'Join our circle', description: '', buttonText: 'Subscribe' };
export const DEFAULT_PAGE_HEADER: PageHeaderBlock = { title: '', breadcrumb: '' };
export const DEFAULT_FILTERS: FiltersBlock = { categories: [], metals: [], gemstones: [], priceRanges: [] };
export const DEFAULT_HERO_STORY: HeroStoryBlock = { eyebrow: '', heading: '', paragraphs: [], stats: [], monogram: 'R' };
export const DEFAULT_VALUES: ValuesBlock = { eyebrow: '', heading: '', items: [] };
export const DEFAULT_ATELIER: AtelierBlock = { eyebrow: '', heading: '', paragraphs: [], buttonText: '', buttonHref: '#', monogram: '✦' };
export const DEFAULT_INFO_CARDS: InfoCardsBlock = { items: [] };
export const DEFAULT_FAQS: FaqsBlock = { eyebrow: '', heading: '', items: [] };
export const DEFAULT_CONTACT_FORM: ContactFormBlock = { title: 'Send Us A Message' };
