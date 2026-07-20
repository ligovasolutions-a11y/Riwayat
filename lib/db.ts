import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'riwaayat.db')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

declare global {
  // eslint-disable-next-line no-var
  var __riwaayatDb: Database.Database | undefined
}

function createConnection(): Database.Database {
  const database = new Database(DB_PATH)
  database.pragma('journal_mode = WAL')
  database.pragma('foreign_keys = ON')
  database.pragma('busy_timeout = 30000')
  return database
}

export const db = global.__riwaayatDb ?? createConnection()
if (process.env.NODE_ENV !== 'production') global.__riwaayatDb = db

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Jewellery',
      subcategory TEXT DEFAULT '',
      price TEXT DEFAULT '',
      stock TEXT DEFAULT 'Available',
      status TEXT NOT NULL DEFAULT 'draft',
      image TEXT DEFAULT '',
      description TEXT DEFAULT '',
      story TEXT DEFAULT '',
      material TEXT DEFAULT '',
      weight TEXT DEFAULT '',
      certification TEXT DEFAULT '',
      warranty TEXT DEFAULT '',
      sku TEXT DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      subtitle TEXT DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Jewellery',
      tag TEXT DEFAULT '',
      image TEXT DEFAULT '',
      href TEXT DEFAULT '',
      size TEXT NOT NULL DEFAULT 'small',
      products_count INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'draft',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS journal_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT DEFAULT '',
      excerpt TEXT DEFAULT '',
      content TEXT DEFAULT '',
      image TEXT DEFAULT '',
      read_time TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft',
      views INTEGER NOT NULL DEFAULT 0,
      published_date TEXT DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      type TEXT DEFAULT '',
      date TEXT DEFAULT '',
      time TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      message TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `)
}

function seed() {
  const productCount = (db.prepare('SELECT COUNT(*) as c FROM products').get() as { c: number }).c
  if (productCount === 0) {
    const insert = db.prepare(`INSERT INTO products
      (name, category, subcategory, price, stock, status, image, tags, sort_order)
      VALUES (@name, @category, @subcategory, @price, @stock, @status, @image, @tags, @sort_order)`)
    const products = [
      { name: 'Royal Bridal Set', category: 'Jewellery', subcategory: 'Bridal', price: '₹3,80,000', stock: 'Available', status: 'active', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=80&q=70&auto=format&fit=crop', tags: '["handcrafted","luxury"]', sort_order: 1 },
      { name: 'Rolex Submariner Date', category: 'Watches', subcategory: 'Rolex', price: '₹12,50,000', stock: 'In Stock', status: 'active', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=70&auto=format&fit=crop', tags: '["handcrafted","luxury"]', sort_order: 2 },
      { name: 'Diamond Solitaire Ring 1.5ct', category: 'Jewellery', subcategory: 'Diamond', price: '₹1,20,000', stock: 'Available', status: 'active', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=80&q=70&auto=format&fit=crop', tags: '["handcrafted","luxury"]', sort_order: 3 },
      { name: 'Omega Seamaster 300M', category: 'Watches', subcategory: 'Omega', price: '₹5,80,000', stock: 'In Stock', status: 'active', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=80&q=70&auto=format&fit=crop', tags: '["handcrafted","luxury"]', sort_order: 4 },
      { name: 'Gold Polki Necklace Set', category: 'Jewellery', subcategory: 'Polki', price: '₹2,45,000', stock: 'Made to Order', status: 'active', image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=80&q=70&auto=format&fit=crop', tags: '["handcrafted","luxury"]', sort_order: 5 },
      { name: 'TAG Heuer Carrera Chronograph', category: 'Watches', subcategory: 'TAG Heuer', price: '₹3,20,000', stock: 'In Stock', status: 'draft', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=80&q=70&auto=format&fit=crop', tags: '["handcrafted","luxury"]', sort_order: 6 },
    ]
    for (const p of products) insert.run(p)
  }

  const collectionCount = (db.prepare('SELECT COUNT(*) as c FROM collections').get() as { c: number }).c
  if (collectionCount === 0) {
    const insert = db.prepare(`INSERT INTO collections
      (name, subtitle, category, tag, image, href, size, products_count, status, sort_order)
      VALUES (@name, @subtitle, @category, @tag, @image, @href, @size, @products_count, @status, @sort_order)`)
    const collections = [
      { name: 'Bridal Couture', subtitle: 'For the most precious day of your life', category: 'Jewellery', tag: 'New Season', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=85&auto=format&fit=crop', href: '/jewellery/bridal', size: 'large', products_count: 120, status: 'active', sort_order: 1 },
      { name: 'Swiss Timepieces', subtitle: 'Precision engineering meets artistry', category: 'Watches', tag: 'Authorised Dealer', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85&auto=format&fit=crop', href: '/watches', size: 'large', products_count: 85, status: 'active', sort_order: 2 },
      { name: 'Diamond Atelier', subtitle: 'GIA certified brilliance', category: 'Jewellery', tag: 'Exclusive', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=85&auto=format&fit=crop', href: '/jewellery/diamond', size: 'small', products_count: 60, status: 'active', sort_order: 3 },
      { name: 'Heritage Gold', subtitle: 'Handcrafted Indian traditions', category: 'Jewellery', tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=85&auto=format&fit=crop', href: '/jewellery/gold', size: 'small', products_count: 200, status: 'active', sort_order: 4 },
      { name: 'Polki & Kundan', subtitle: '', category: 'Jewellery', tag: '', image: '', href: '/jewellery/polki', size: 'small', products_count: 45, status: 'active', sort_order: 5 },
      { name: 'Summer Edit 2025', subtitle: '', category: 'Jewellery', tag: 'Coming Soon', image: '', href: '/collections/summer-edit-2025', size: 'small', products_count: 0, status: 'draft', sort_order: 6 },
    ]
    for (const c of collections) insert.run(c)
  }

  const journalCount = (db.prepare('SELECT COUNT(*) as c FROM journal_posts').get() as { c: number }).c
  if (journalCount === 0) {
    const insert = db.prepare(`INSERT INTO journal_posts
      (title, slug, category, excerpt, content, image, read_time, status, views, published_date, sort_order)
      VALUES (@title, @slug, @category, @excerpt, @content, @image, @read_time, @status, @views, @published_date, @sort_order)`)
    const posts = [
      {
        title: 'The Ultimate Guide to Buying Your First Rolex', slug: 'guide-to-buying-rolex', category: 'Watch Guide',
        excerpt: 'Everything you need to know about references, movement types, and what to look for when purchasing your first Rolex timepiece.',
        content: "Buying your first Rolex is a milestone, and it pays to walk in prepared. Start with the reference number — it tells you the model, case material and bracelet at a glance, and lets you compare like-for-like across retailers.\n\nNext, think about movement and complications. Most modern Rolex pieces run on in-house automatic calibres rated to within a couple of seconds a day — more than accurate enough for daily wear, and serviceable for decades with proper care.\n\nFinally, consider fit before finish. A Datejust, Submariner and Day-Date wear very differently on the wrist despite similar case sizes. Our team is always happy to bring out a few references side by side during a private appointment so you can compare in person before deciding.",
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85&auto=format&fit=crop', read_time: '8 min read', status: 'published', views: 1240, published_date: 'June 2024', sort_order: 1,
      },
      {
        title: 'How to Choose Your Wedding Jewellery Set', slug: 'choosing-wedding-jewellery', category: 'Bridal',
        excerpt: 'Expert advice on selecting the perfect bridal ensemble that complements your wedding outfit and personal style.',
        content: "Your bridal set should feel like an extension of your outfit, not a competition with it. Begin with your outfit's neckline and embroidery weight — a heavily embellished lehenga usually pairs best with a statement choker, while a lighter drape gives a long necklace room to shine.\n\nMetal tone matters too. Warm 22K gold complements traditional red-and-gold ensembles, while platinum or white-gold diamond pieces sit beautifully against pastel and ivory palettes increasingly popular for daytime ceremonies.\n\nWe recommend booking a bridal consultation at least two months ahead of the wedding date, giving enough time for any resizing, engraving or made-to-order pieces to be finished without last-minute pressure.",
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=85&auto=format&fit=crop', read_time: '6 min read', status: 'published', views: 890, published_date: 'May 2024', sort_order: 2,
      },
      {
        title: 'Understanding the 4Cs of Diamond Quality', slug: '4cs-of-diamonds', category: 'Diamond Education',
        excerpt: 'A comprehensive breakdown of Cut, Color, Clarity, and Carat — and why they matter for your diamond purchase.',
        content: "Cut determines how well a diamond returns light to the eye, and is the single biggest factor in perceived brilliance — it's worth prioritising over the other three Cs if your budget forces a trade-off.\n\nColor is graded on a scale from D (colourless) to Z, though most jewellery-grade stones sit comfortably between G and J, where any warmth is invisible to the naked eye once set.\n\nClarity refers to natural inclusions formed deep within the earth. VS1-VS2 clarity offers an excellent balance — eye-clean brilliance without paying a premium for flawlessness only a loupe would reveal.\n\nCarat is simply weight, and while it drives price most directly, a well-cut smaller stone will often outshine a larger, poorly cut one.",
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=85&auto=format&fit=crop', read_time: '10 min read', status: 'published', views: 2100, published_date: 'April 2024', sort_order: 3,
      },
      {
        title: "Polki vs Kundan: What's the Difference?", slug: 'polki-vs-kundan', category: 'Jewellery Guide',
        excerpt: "Demystifying India's two most beloved traditional jewellery styles for the modern bride.",
        content: "Polki and Kundan are often mentioned in the same breath, but the techniques are distinct. Polki uses uncut, natural diamonds set exactly as they're mined — prized for their rustic, old-world sparkle.\n\nKundan, meanwhile, is a setting technique rather than a stone type: coloured glass or gemstones are set in gold foil using a refined kundan paste, giving pieces their signature layered, jewel-toned look.\n\nMany heirloom-style pieces actually combine both — Polki diamonds framed by Kundan-set coloured stones — which is why the two are so often paired in a single bridal set.",
        image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=900&q=85&auto=format&fit=crop', read_time: '5 min read', status: 'published', views: 670, published_date: 'March 2024', sort_order: 4,
      },
      {
        title: 'Omega Seamaster vs Rolex Submariner: A Deep Dive', slug: 'omega-seamaster-vs-rolex-submariner', category: 'Watch Guide',
        excerpt: 'Two icons, one decision. Our horology team breaks down the differences for serious watch buyers.',
        content: "Both watches trace their lineage to 1950s dive tools, but they've evolved differently. The Seamaster's co-axial escapement reduces friction and extends service intervals, while the Submariner leans on Rolex's reputation for relentless, understated reliability.\n\nOn the wrist, the Seamaster wears slightly larger and lighter thanks to its case architecture, while the Submariner's Oyster case feels denser and more tool-like.\n\nUltimately the decision often comes down to brand feel as much as engineering — we'd always encourage trying both in person before choosing.",
        image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=900&q=85&auto=format&fit=crop', read_time: '12 min read', status: 'published', views: 540, published_date: 'February 2024', sort_order: 5,
      },
      {
        title: 'The Art of Gifting Jewellery — A Complete Guide', slug: 'art-of-gifting-jewellery', category: 'Luxury Lifestyle',
        excerpt: 'From anniversary gifts to milestone celebrations — how to choose a piece that will be cherished forever.',
        content: "The best jewellery gifts say something about the giver as much as the wearer. Pay attention to what someone already wears daily — matching that metal tone and style is a safer, more thoughtful bet than a dramatic departure.\n\nFor milestone anniversaries, consider pieces that can be added to over time, like a tennis bracelet or stud earrings that pair well with future additions.\n\nAnd don't underestimate presentation — a private, unhurried reveal at one of our boutiques, complete with gift wrapping and a handwritten card, elevates any piece into a genuine occasion.",
        image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&q=85&auto=format&fit=crop', read_time: '7 min read', status: 'published', views: 410, published_date: 'January 2024', sort_order: 6,
      },
      {
        title: 'Spring/Summer Jewellery Trends 2025', slug: 'spring-summer-jewellery-trends-2025', category: 'Luxury Lifestyle',
        excerpt: 'A first look at the colours, cuts and silhouettes shaping the new season.',
        content: '',
        image: '', read_time: '', status: 'draft', views: 0, published_date: '', sort_order: 7,
      },
    ]
    for (const p of posts) insert.run(p)
  }

  const appointmentCount = (db.prepare('SELECT COUNT(*) as c FROM appointments').get() as { c: number }).c
  if (appointmentCount === 0) {
    const insert = db.prepare(`INSERT INTO appointments
      (name, phone, email, type, date, time, status, message)
      VALUES (@name, @phone, @email, @type, @date, @time, @status, @message)`)
    const appointments = [
      { name: 'Priya Mehta', phone: '+91 98765 43210', email: 'priya@email.com', type: 'Bridal Consultation', date: 'Dec 13, 2024', time: '3:00 PM', status: 'confirmed', message: 'Looking for complete bridal set under ₹5 lakhs' },
      { name: 'Arjun Kapoor', phone: '+91 87654 32109', email: 'arjun@email.com', type: 'Watch Viewing', date: 'Dec 13, 2024', time: '5:00 PM', status: 'confirmed', message: 'Interested in Rolex Submariner' },
      { name: 'Sanjay Patel', phone: '+91 76543 21098', email: 'sanjay@email.com', type: 'Jewellery Consultation', date: 'Dec 14, 2024', time: '11:00 AM', status: 'pending', message: 'Anniversary gift for wife, budget ₹2 lakhs' },
      { name: 'Ritu Sharma', phone: '+91 65432 10987', email: 'ritu@email.com', type: 'Private VIP', date: 'Dec 14, 2024', time: '2:00 PM', status: 'pending', message: 'Would like to see new diamond collection' },
      { name: 'Vikram Singh', phone: '+91 54321 09876', email: 'vikram@email.com', type: 'Boutique Visit', date: 'Dec 15, 2024', time: '4:00 PM', status: 'confirmed', message: '' },
    ]
    for (const a of appointments) insert.run(a)
  }

  const settingsCount = (db.prepare('SELECT COUNT(*) as c FROM settings').get() as { c: number }).c
  if (settingsCount === 0) {
    const insert = db.prepare('INSERT INTO settings (key, value) VALUES (@key, @value)')
    const defaults: Record<string, string> = {
      siteName: 'Riwaayat Jewels',
      tagline: 'Where Heritage Meets Time',
      phone: '+91 99999 88888',
      email: 'hello@riwaayatjewels.com',
      address: '123 Luxury Lane, Bandra West, Mumbai — 400050',
      instagram: 'riwaayatjewels',
      facebook: 'riwaayatjewels',
      youtube: '@riwaayatjewels',
      whatsapp: '+919999988888',
      announcement: 'Free Shipping on Orders Above ₹50,000 | Book a Private Consultation | ISO Certified Gems',
      metaTitle: 'Riwaayat Jewels – Where Heritage Meets Time',
      metaDesc: 'Crafting timeless jewellery and curating exceptional timepieces for generations.',
      hero_btn1: 'Explore Jewellery',
      hero_btn2: 'Explore Watches',
      hero_btn3: 'Book Private Consultation',
      hero_slides: JSON.stringify([
        { image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920&q=90&auto=format&fit=crop', label: 'New Collection', headline: 'Where Heritage', headline2: 'Meets Time', sub: 'Crafting timeless jewellery and curating exceptional timepieces for generations.' },
        { image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1920&q=90&auto=format&fit=crop', label: 'Bridal Couture', headline: 'Jewels That Tell', headline2: 'Your Story', sub: 'Exquisite bridal jewellery handcrafted with generations of expertise.' },
        { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&q=90&auto=format&fit=crop', label: 'Swiss Timepieces', headline: 'Time, Perfected', headline2: 'Forever', sub: "Authorised retailer of the world's most prestigious watch brands." },
      ]),
      homepage_sections: JSON.stringify({}),
    }
    for (const [key, value] of Object.entries(defaults)) insert.run({ key, value })
  }

  const userCount = (db.prepare('SELECT COUNT(*) as c FROM admin_users').get() as { c: number }).c
  if (userCount === 0) {
    const email = process.env.ADMIN_EMAIL || 'admin@riwaayatjewels.com'
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
    const hash = bcrypt.hashSync(password, 12)
    db.prepare('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)').run(email, hash)
  }
}

migrate()
db.transaction(seed)()

export function getSetting(key: string, fallback = ''): string {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined
  return row?.value ?? fallback
}

export function getAllSettings(): Record<string, string> {
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[]
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export function setSetting(key: string, value: string) {
  db.prepare(`
    INSERT INTO settings (key, value) VALUES (@key, @value)
    ON CONFLICT(key) DO UPDATE SET value = @value
  `).run({ key, value })
}
