import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/* Seeds the exact content of the originally built static site, so
   moving to the database-backed CMS changes nothing visually.
   draftJson === publishedJson at seed time. */
function j(data: unknown) {
  return JSON.stringify(data);
}

async function main() {
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    const password = process.env.INITIAL_ADMIN_PASSWORD || 'ChangeMe123!';
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { username: 'admin', passwordHash, mustChangePassword: true },
    });
    console.log('Seeded default admin user (username: admin)');
  }

  const blockCount = await prisma.contentBlock.count();
  if (blockCount === 0) {
    const blocks: Array<{ page: string; blockKey: string; label: string; position: number; data: unknown }> = [
      {
        page: 'global', blockKey: 'nav', label: 'Navigation', position: 0, data: {
          logoLine1: 'Riwayat', logoLine2: 'Jewels', tagline: 'Est. Heritage · Fine Jewellery',
          announcement: 'Complimentary Shipping On All Orders Above ₹4,999',
          topbarLeft: [{ label: 'Our Story', href: '/about' }, { label: 'Store Locator', href: '/shop' }],
          topbarRight: [{ label: 'Track Order', href: '/contact' }, { label: 'Help', href: '/contact' }],
          items: [
            { label: 'Rings', href: '/shop' }, { label: 'Necklaces', href: '/shop' }, { label: 'Earrings', href: '/shop' },
            { label: 'Bangles', href: '/shop' }, { label: 'Bridal', href: '/shop' }, { label: 'Watches', href: '/shop' },
            { label: 'Our Story', href: '/about' },
          ],
        },
      },
      {
        page: 'global', blockKey: 'footer', label: 'Footer', position: 1, data: {
          aboutText: 'Handcrafted fine jewellery rooted in tradition, designed for the way you live today. BIS Hallmarked. IGI Certified.',
          social: [{ platform: 'Instagram', href: '#' }, { platform: 'Facebook', href: '#' }, { platform: 'Pinterest', href: '#' }, { platform: 'WhatsApp', href: '#' }],
          columns: [
            { title: 'Shop', links: [{ label: 'Rings', href: '/shop' }, { label: 'Necklaces', href: '/shop' }, { label: 'Earrings', href: '/shop' }, { label: 'Bangles & Bracelets', href: '/shop' }, { label: 'Bridal Edit', href: '/shop' }, { label: 'Watches', href: '/shop' }] },
            { title: 'Company', links: [{ label: 'Our Story', href: '/about' }, { label: 'Craftsmanship', href: '/about' }, { label: 'Store Locator', href: '/contact' }, { label: 'Careers', href: '/contact' }, { label: 'Press', href: '/contact' }] },
            { title: 'Customer Care', links: [{ label: 'Contact Us', href: '/contact' }, { label: 'Track Order', href: '/contact' }, { label: 'Shipping & Returns', href: '/contact' }, { label: 'Certification', href: '/contact' }, { label: 'FAQs', href: '/contact' }] },
          ],
          copyright: '© 2026 Riwayat Jewels. All rights reserved.',
          payments: ['Visa', 'Mastercard', 'UPI', 'COD'],
        },
      },
      {
        page: 'global', blockKey: 'contact_info', label: 'Contact Info', position: 2, data: {
          address: 'MI Road, Jaipur, Rajasthan 302001, India',
          phone: '+91 141 234 5678', phoneHours: 'Mon–Sat, 10am–8pm',
          email: 'care@riwayatjewels.com',
          hoursWeekday: 'Monday – Saturday: 10:00 AM – 8:00 PM',
          hoursWeekend: 'Sunday: 11:00 AM – 6:00 PM',
        },
      },
      {
        page: 'home', blockKey: 'hero', label: 'Hero Banner', position: 0, data: {
          eyebrow: 'The Riwayat Edit — 2026',
          heading: 'Jewellery that carries your <em>riwayat</em>, your story.',
          description: 'Handcrafted rings, necklaces and bridal sets in 18k gold, diamonds and precious stones — designed in-house, certified for a lifetime.',
          primaryBtnText: 'Shop New Arrivals', primaryBtnHref: '/shop',
          secondaryBtnText: 'Our Craftsmanship', secondaryBtnHref: '/about',
        },
      },
      { page: 'home', blockKey: 'trust_strip', label: 'Trust Strip', position: 1, data: { items: ['BIS Hallmarked Gold', 'IGI Certified Diamonds', 'Lifetime Exchange', 'Complimentary Gift Wrapping', 'Free Insured Shipping'] } },
      {
        page: 'home', blockKey: 'categories', label: 'Shop By Category', position: 2, data: {
          eyebrow: 'Shop By Category', heading: 'Find Your Perfect Piece',
          description: 'From everyday elegance to once-in-a-lifetime occasions — explore the full Riwayat collection.',
          items: [
            { label: 'Rings', icon: 'ring', href: '/shop' }, { label: 'Necklaces', icon: 'necklace', href: '/shop' },
            { label: 'Earrings', icon: 'earring', href: '/shop' }, { label: 'Bangles', icon: 'bangle', href: '/shop' },
            { label: 'Bridal Edit', icon: 'bridal', href: '/shop' }, { label: 'Watches', icon: 'watch', href: '/shop' },
          ],
        },
      },
      {
        page: 'home', blockKey: 'collections', label: 'Shop By Collection', position: 3, data: {
          eyebrow: 'Curated Edits', heading: 'Shop By Collection',
          items: [
            { tag: 'Bridal 2026', title: 'The Rukhsat Bridal Collection', href: '/shop', variant: '' },
            { tag: 'Everyday Fine', title: 'Daily Gold Layering', href: '/shop', variant: 'alt2' },
            { tag: 'Gifting', title: 'Gifts For Her', href: '/shop', variant: 'alt3' },
          ],
        },
      },
      {
        page: 'home', blockKey: 'story', label: 'Our Craftsmanship', position: 5, data: {
          eyebrow: 'Our Craftsmanship',
          heading: 'Every Riwayat piece is a story passed down, remade for today.',
          paragraphs: [
            "For three generations, our karigars have hand-set stones and hand-poured gold using techniques inherited from Jaipur's oldest ateliers. Every design begins as a sketch and ends as an heirloom.",
            'Today, Riwayat Jewels blends that inheritance with modern design sensibility — creating pieces meant to be worn daily and handed down for decades.',
          ],
          stats: [{ num: '45+', label: 'Years of Legacy' }, { num: '120k', label: 'Happy Customers' }, { num: '100%', label: 'Certified Gold' }],
          buttonText: 'Read Our Story', buttonHref: '/about',
        },
      },
      {
        page: 'home', blockKey: 'testimonials', label: 'Customer Testimonials', position: 6, data: {
          eyebrow: 'Customer Love', heading: 'What Our Patrons Say',
          items: [
            { quote: "The Zarina necklace set I bought for my sister's wedding was beyond stunning — the craftsmanship is unmatched.", author: 'Aisha Khan, Hyderabad', rating: 5 },
            { quote: "Riwayat's bridal edit made choosing my wedding jewellery so easy. Every piece felt personal and timeless.", author: 'Priya Menon, Bengaluru', rating: 5 },
            { quote: 'Excellent quality, transparent certification, and a customer service team that truly cares. Highly recommend.', author: 'Fatima Sheikh, Mumbai', rating: 5 },
          ],
        },
      },
      { page: 'home', blockKey: 'newsletter', label: 'Newsletter Signup', position: 7, data: { heading: 'Join The Riwayat Circle', description: 'Be first to know about new collections, exclusive previews and member-only offers.', buttonText: 'Subscribe' } },
      { page: 'shop', blockKey: 'page_header', label: 'Page Header', position: 0, data: { title: 'Shop All Jewellery', breadcrumb: 'Shop' } },
      {
        page: 'shop', blockKey: 'filters', label: 'Filters Sidebar', position: 1, data: {
          categories: ['Rings', 'Necklaces', 'Earrings', 'Bangles & Bracelets', 'Bridal Sets', 'Watches'],
          metals: ['Yellow Gold', 'Rose Gold', 'White Gold / Platinum', 'Silver'],
          gemstones: ['Diamond', 'Polki & Kundan', 'Ruby', 'Emerald', 'Pearl'],
          priceRanges: ['Under ₹25,000', '₹25,000 – ₹75,000', '₹75,000 – ₹1,50,000', 'Above ₹1,50,000'],
        },
      },
      {
        page: 'about', blockKey: 'hero_story', label: 'Our Story', position: 0, data: {
          eyebrow: 'Since 1979', heading: 'A riwayat of craft, carried through three generations.',
          paragraphs: [
            'Riwayat Jewels began as a small family atelier in Jaipur, founded on a simple belief: that jewellery should be more than an accessory — it should be a keepsake of memory, worn and passed down.',
            'Four decades later, our karigars still hand-set every stone and hand-pour every gold setting using techniques inherited from that first workshop, now paired with modern design and ethical sourcing standards.',
          ],
          stats: [{ num: '45+', label: 'Years of Legacy' }, { num: '3', label: 'Generations of Karigars' }, { num: '120k', label: 'Happy Customers' }],
          monogram: 'R',
        },
      },
      {
        page: 'about', blockKey: 'values', label: 'Our Values', position: 1, data: {
          eyebrow: 'What We Stand For', heading: 'Our Values',
          items: [
            { icon: 'shield', title: 'Certified Integrity', text: "Every piece is BIS hallmarked and every diamond IGI certified, so you always know exactly what you're wearing." },
            { icon: 'handcraft', title: 'Handcrafted, Not Mass-Made', text: 'Our karigars hand-finish every piece in small batches, preserving the detail that machines skip.' },
            { icon: 'ethical', title: 'Ethically Sourced', text: 'We partner with responsible mines and recyclers, ensuring every gram of gold has a traceable, ethical origin.' },
          ],
        },
      },
      {
        page: 'about', blockKey: 'atelier', label: 'The Atelier', position: 2, data: {
          eyebrow: 'The Atelier', heading: 'Where every design begins as a sketch.',
          paragraphs: [
            'Inside our Jaipur atelier, designers, gemologists and karigars work side by side — sketching, casting, setting and polishing each collection before it ever reaches a store.',
            "It's slower than mass production. But it's the only way we know to make jewellery worth keeping for generations.",
          ],
          buttonText: 'Visit Our Atelier', buttonHref: '/contact', monogram: '✦',
        },
      },
      { page: 'contact', blockKey: 'page_header', label: 'Page Header', position: 0, data: { title: 'Contact Us', breadcrumb: 'Contact' } },
      {
        page: 'contact', blockKey: 'info_cards', label: 'Info Cards', position: 1, data: {
          items: [
            { icon: 'location', title: 'Flagship Store', text: 'MI Road, Jaipur, Rajasthan 302001, India' },
            { icon: 'phone', title: 'Call Us', text: '+91 141 234 5678 · Mon–Sat, 10am–8pm' },
            { icon: 'mail', title: 'Email Us', text: 'care@riwayatjewels.com' },
            { icon: 'clock', title: 'Store Hours', text: 'Monday – Saturday: 10:00 AM – 8:00 PM<br>Sunday: 11:00 AM – 6:00 PM' },
          ],
        },
      },
      {
        page: 'contact', blockKey: 'faqs', label: 'Frequently Asked Questions', position: 2, data: {
          eyebrow: 'Need Help?', heading: 'Frequently Asked Questions',
          items: [
            { question: 'Is your gold certified?', answer: 'Yes — every piece is BIS Hallmarked and every diamond is IGI certified, with certification provided at purchase.' },
            { question: 'What is your exchange policy?', answer: 'We offer a 15-day hassle-free exchange from the date of delivery, provided the item is unused and in its original packaging.' },
            { question: 'Do you ship across India?', answer: 'Yes, we offer free fully-insured shipping across India on all orders, delivered in 5-7 business days.' },
            { question: 'Can I customize a piece?', answer: 'Absolutely — visit our Jaipur atelier or contact us to discuss bespoke designs, ring sizing, or engraving.' },
          ],
        },
      },
      {
        page: 'contact', blockKey: 'contact_form', label: 'Contact Form Heading', position: 3, data: {
          title: 'Send Us A Message',
        },
      },
    ];

    for (const b of blocks) {
      const json = j(b.data);
      await prisma.contentBlock.create({
        data: { page: b.page, blockKey: b.blockKey, label: b.label, position: b.position, draftJson: json, publishedJson: json, updatedBy: 'seed' },
      });
    }
    console.log(`Seeded ${blocks.length} content blocks`);
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    const products = [
      { slug: 'nakshatra-solitaire-ring', name: 'Nakshatra Solitaire Ring', category: 'Rings', icon: 'ring', price: '₹54,400', oldPrice: '₹68,000', badge: 'New', rating: 5, reviewCount: 128, featured: true, position: 0,
        description: 'A timeless solitaire crafted in 18k certified gold, set with a brilliant-cut IGI certified diamond. Designed for engagements, anniversaries, and everyday luxury.',
        metals: j(['Yellow Gold', 'Rose Gold', 'White Gold']), sizes: j(['5', '6', '7', '8', '9']),
        stockNote: 'Only 4 left in stock',
        detailsText: 'Metal: 18k Certified Gold · Gross Weight: 3.2g · Diamond: 0.5ct IGI Certified · Setting: Prong · Finish: High Polish',
        shippingText: 'Free insured shipping on all orders. Delivered in 5-7 business days. 15-day hassle-free exchange from date of delivery.',
        careText: 'Store in the provided box away from moisture. Clean gently with a soft cloth. Avoid contact with perfumes and lotions.' },
      { slug: 'zarina-kundan-necklace-set', name: 'Zarina Kundan Necklace Set', category: 'Necklaces', icon: 'necklace', price: '₹1,42,000', badge: '', rating: 5, reviewCount: 64, featured: true, position: 1,
        description: 'An opulent Kundan necklace set finished with hand-painted meenakari work on the reverse, designed for bridal and festive occasions.',
        metals: j(['Yellow Gold']), sizes: j([]), stockNote: 'In stock', detailsText: 'Metal: 22k Gold Polki · Style: Kundan Meenakari', shippingText: 'Free insured shipping on all orders.', careText: 'Store flat in a fabric-lined box.' },
      { slug: 'meena-jhumka-earrings', name: 'Meena Jhumka Earrings', category: 'Earrings', icon: 'earring', price: '₹27,600', oldPrice: '₹32,500', badge: 'Bestseller', rating: 4, reviewCount: 91, featured: true, position: 2,
        description: 'Classic gold jhumkas with detailed meenakari enamelling, a Riwayat signature.',
        metals: j(['Yellow Gold', 'Rose Gold']), sizes: j([]), stockNote: 'In stock', detailsText: 'Metal: 18k Gold · Weight: 8.4g', shippingText: 'Free insured shipping on all orders.', careText: 'Avoid contact with water and perfume.' },
      { slug: 'heritage-gold-kada-pair', name: 'Heritage Gold Kada (Pair)', category: 'Bangles', icon: 'bangle', price: '₹96,200', badge: '', rating: 5, reviewCount: 47, featured: true, position: 3,
        description: 'A heritage-inspired pair of gold kadas with hand-engraved detailing.',
        metals: j(['Yellow Gold']), sizes: j(['2.4', '2.6', '2.8']), stockNote: 'In stock', detailsText: 'Metal: 22k Gold · Weight: 42g (pair)', shippingText: 'Free insured shipping on all orders.', careText: 'Polish with a soft jewellery cloth only.' },
      { slug: 'rukhsat-polki-bridal-set', name: 'Rukhsat Polki Bridal Set', category: 'Bridal Sets', icon: 'bridal', price: '₹3,85,000', badge: 'Bridal', rating: 5, reviewCount: 22, featured: false, position: 4,
        description: 'A full bridal Polki set — necklace, earrings and maang tikka — for the modern bride.',
        metals: j(['Yellow Gold']), sizes: j([]), stockNote: 'Made to order', detailsText: 'Metal: 22k Gold Polki Set', shippingText: 'Made-to-order pieces ship in 10-14 business days.', careText: 'Professional cleaning recommended annually.' },
      { slug: 'ishq-diamond-eternity-band', name: 'Ishq Diamond Eternity Band', category: 'Rings', icon: 'ring', price: '₹41,900', badge: '', rating: 4, reviewCount: 53, featured: false, position: 5,
        description: 'A full-eternity diamond band in 18k gold, a modern classic for stacking or solo wear.',
        metals: j(['Yellow Gold', 'White Gold']), sizes: j(['5', '6', '7', '8']), stockNote: 'In stock', detailsText: 'Metal: 18k Gold · Diamond: 1.2ct total IGI Certified', shippingText: 'Free insured shipping on all orders.', careText: 'Remove before manual work.' },
      { slug: 'riwayat-heritage-gold-watch', name: 'Riwayat Heritage Gold Watch', category: 'Watches', icon: 'watch', price: '₹89,600', oldPrice: '₹1,12,000', badge: 'Sale', rating: 5, reviewCount: 18, featured: false, position: 6,
        description: 'A gold-plated heritage timepiece with a sapphire crystal face and genuine leather strap.',
        metals: j(['Gold-Plated Steel']), sizes: j([]), stockNote: 'In stock', detailsText: 'Movement: Swiss Quartz · Water Resistance: 30m', shippingText: 'Free insured shipping on all orders.', careText: 'Avoid submerging in water.' },
      { slug: 'chandni-pearl-drops', name: 'Chandni Pearl Drops', category: 'Earrings', icon: 'earring', price: '₹18,750', badge: '', rating: 4, reviewCount: 36, featured: false, position: 7,
        description: 'Freshwater pearl drop earrings on delicate gold hooks, for everyday elegance.',
        metals: j(['Yellow Gold']), sizes: j([]), stockNote: 'In stock', detailsText: 'Metal: 18k Gold · Pearl: Freshwater Cultured', shippingText: 'Free insured shipping on all orders.', careText: 'Wipe with a soft dry cloth after wear.' },
    ];
    for (const p of products) await prisma.product.create({ data: p });
    console.log(`Seeded ${products.length} products`);
  }

  const seoCount = await prisma.seoMeta.count();
  if (seoCount === 0) {
    const seoPages = [
      { page: 'home', title: 'Riwayat Jewels | Fine Jewellery & Timepieces', description: 'Riwayat Jewels — handcrafted fine jewellery and watches. Rings, necklaces, earrings, bangles and bridal collections rooted in timeless tradition.', keywords: 'fine jewellery, gold rings, bridal jewellery, Jaipur jewellers' },
      { page: 'shop', title: 'Shop All Jewellery | Riwayat Jewels', description: 'Shop rings, necklaces, earrings, bangles and bridal jewellery at Riwayat Jewels.', keywords: 'buy gold rings, jewellery shop, bridal sets' },
      { page: 'about', title: 'Our Story | Riwayat Jewels', description: 'Discover the Riwayat Jewels story — three generations of craftsmanship, heritage and fine jewellery making.', keywords: 'jewellery heritage, Jaipur karigars, our story' },
      { page: 'contact', title: 'Contact Us | Riwayat Jewels', description: 'Get in touch with Riwayat Jewels — store locations, customer care and support.', keywords: 'contact jewellery store, Jaipur showroom' },
      { page: 'blog', title: 'Journal | Riwayat Jewels', description: 'Stories on craftsmanship, gold care and jewellery trends from Riwayat Jewels.', keywords: 'jewellery blog, gold care tips' },
    ];
    for (const s of seoPages) await prisma.seoMeta.create({ data: s });
    console.log('Seeded SEO metadata');
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    await prisma.siteSettings.create({ data: { id: 1 } });
    console.log('Seeded default site settings');
  }

  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    await prisma.blogPost.create({
      data: {
        slug: 'how-to-spot-genuine-bis-hallmarked-gold',
        title: 'How To Spot Genuine BIS Hallmarked Gold',
        excerpt: 'Five things to check on the hallmark before you buy — and why certification matters more than the shine.',
        contentHtml: '<p>Every piece of gold jewellery sold legally in India should carry a BIS hallmark — but few shoppers know what to actually look for. Here are the five marks to check: the BIS logo, the purity grade (e.g. 916 for 22k), the hallmarking centre\'s mark, the jeweller\'s identification mark, and the year of marking.</p><p>At Riwayat, every piece leaves our atelier fully hallmarked and accompanied by its certification — so you never have to take our word for it.</p>',
        status: 'published',
        seoTitle: 'How To Spot Genuine BIS Hallmarked Gold | Riwayat Journal',
        seoDescription: 'Learn the five hallmark checks that confirm your gold jewellery is genuine and certified.',
        publishedAt: new Date(),
      },
    });
    await prisma.blogPost.create({
      data: {
        slug: 'caring-for-your-kundan-jewellery',
        title: 'Caring For Your Kundan Jewellery',
        excerpt: 'Kundan work is delicate by design. Here is how to keep it looking new for generations.',
        contentHtml: '<p>Draft in progress — publishing soon.</p>',
        status: 'draft',
        seoTitle: '',
        seoDescription: '',
      },
    });
    console.log('Seeded 2 blog posts (1 published, 1 draft)');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
