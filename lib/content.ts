import { db } from './db'

export type Product = {
  id: number
  name: string
  category: string
  subcategory: string
  price: string
  stock: string
  status: string
  image: string
  images: string[]
  description: string
  story: string
  material: string
  weight: string
  certification: string
  warranty: string
  sku: string
  tags: string[]
  // Jewellery-specific specifications
  policy: string
  gross_weight: string
  gold_weight: string
  diamond_weight: string
  caratage: string
  // Watch-specific specifications
  collection: string
  case_size: string
  case_material: string
  movement: string
  dial_colour: string
  strap_material: string
  crystal: string
  water_resistance: string
  power_reserve: string
  functions: string
  condition: string
  box_papers: string
  gender: string
  year: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type JewelleryCategory = {
  id: number
  name: string
  image: string
  status: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type Collection = {
  id: number
  name: string
  subtitle: string
  category: string
  tag: string
  image: string
  href: string
  size: string
  products_count: number
  status: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type JournalPost = {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  image: string
  read_time: string
  status: string
  views: number
  published_date: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type Appointment = {
  id: number
  name: string
  email: string
  phone: string
  type: string
  date: string
  time: string
  status: string
  message: string
  created_at: string
}

export type Quote = {
  id: number
  name: string
  email: string
  phone: string
  company: string
  category: string
  product_interest: string
  colour: string
  cut: string
  clarity: string
  carat_weight: string
  reference_number: string
  brand: string
  message: string
  status: string
  created_at: string
}

type RawProduct = Omit<Product, 'tags' | 'images'> & { tags: string; images: string }
const parseProduct = (row: RawProduct): Product => ({
  ...row,
  tags: JSON.parse(row.tags || '[]'),
  images: JSON.parse(row.images || '[]'),
})

export function listProducts(): Product[] {
  return (db.prepare('SELECT * FROM products ORDER BY sort_order ASC, id DESC').all() as RawProduct[]).map(parseProduct)
}
export function listPublishedProducts(): Product[] {
  return (db.prepare("SELECT * FROM products WHERE status = 'active' ORDER BY sort_order ASC, id DESC").all() as RawProduct[]).map(parseProduct)
}
export function getProduct(id: number): Product | null {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as RawProduct | undefined
  return row ? parseProduct(row) : null
}
export function listPublishedProductsBySubcategorySlug(category: string, slug: string): Product[] {
  return listPublishedProducts()
    .filter((p) => p.category === category && slugify(p.subcategory) === slug)
}
// Plain text columns shared by both create and update (everything except id/tags/images/sort_order/timestamps).
const PRODUCT_TEXT_FIELDS = [
  'name', 'category', 'subcategory', 'price', 'stock', 'status', 'image',
  'description', 'story', 'material', 'weight', 'certification', 'warranty', 'sku',
  'policy', 'gross_weight', 'gold_weight', 'diamond_weight', 'caratage',
  'collection', 'case_size', 'case_material', 'movement', 'dial_colour', 'strap_material',
  'crystal', 'water_resistance', 'power_reserve', 'functions', 'condition', 'box_papers', 'gender', 'year',
] as const

function productTextValues(data: Partial<Product>): Record<string, string> {
  const values: Record<string, string> = {}
  for (const field of PRODUCT_TEXT_FIELDS) values[field] = (data[field] as string) ?? ''
  if (!data.category) values.category = 'Jewellery'
  if (!data.stock) values.stock = 'Available'
  if (!data.status) values.status = 'draft'
  return values
}

export function createProduct(data: Partial<Product>): Product {
  const fields = PRODUCT_TEXT_FIELDS.join(', ')
  const placeholders = PRODUCT_TEXT_FIELDS.map((f) => `@${f}`).join(', ')
  const info = db.prepare(`
    INSERT INTO products (${fields}, images, tags)
    VALUES (${placeholders}, @images, @tags)
  `).run({
    ...productTextValues(data),
    images: JSON.stringify(data.images ?? []),
    tags: JSON.stringify(data.tags ?? []),
  })
  return getProduct(Number(info.lastInsertRowid))!
}
export function updateProduct(id: number, data: Partial<Product>): Product | null {
  const existing = getProduct(id)
  if (!existing) return null
  const merged = { ...existing, ...data }
  const setClause = PRODUCT_TEXT_FIELDS.map((f) => `${f}=@${f}`).join(', ')
  db.prepare(`
    UPDATE products SET ${setClause}, images=@images, tags=@tags, updated_at=datetime('now')
    WHERE id=@id
  `).run({
    ...productTextValues(merged),
    id,
    tags: JSON.stringify(merged.tags ?? []),
    images: JSON.stringify(merged.images ?? []),
  })
  return getProduct(id)
}
export function deleteProduct(id: number) {
  db.prepare('DELETE FROM products WHERE id = ?').run(id)
}

export function listCollections(): Collection[] {
  return db.prepare('SELECT * FROM collections ORDER BY sort_order ASC, id ASC').all() as Collection[]
}
export function listFeaturedCollections(limit = 4): Collection[] {
  return db.prepare("SELECT * FROM collections WHERE status = 'active' ORDER BY sort_order ASC, id ASC LIMIT ?").all(limit) as Collection[]
}
export function getCollection(id: number): Collection | null {
  return (db.prepare('SELECT * FROM collections WHERE id = ?').get(id) as Collection | undefined) ?? null
}
export function createCollection(data: Partial<Collection>): Collection {
  const info = db.prepare(`
    INSERT INTO collections (name, subtitle, category, tag, image, href, size, products_count, status, sort_order)
    VALUES (@name, @subtitle, @category, @tag, @image, @href, @size, @products_count, @status, @sort_order)
  `).run({
    name: data.name ?? '', subtitle: data.subtitle ?? '', category: data.category ?? 'Jewellery',
    tag: data.tag ?? '', image: data.image ?? '', href: data.href ?? '', size: data.size ?? 'small',
    products_count: data.products_count ?? 0, status: data.status ?? 'draft', sort_order: data.sort_order ?? 0,
  })
  return getCollection(Number(info.lastInsertRowid))!
}
export function updateCollection(id: number, data: Partial<Collection>): Collection | null {
  const existing = getCollection(id)
  if (!existing) return null
  const merged = { ...existing, ...data }
  db.prepare(`
    UPDATE collections SET name=@name, subtitle=@subtitle, category=@category, tag=@tag, image=@image, href=@href,
      size=@size, products_count=@products_count, status=@status, sort_order=@sort_order, updated_at=datetime('now')
    WHERE id=@id
  `).run({ ...merged, id })
  return getCollection(id)
}
export function deleteCollection(id: number) {
  db.prepare('DELETE FROM collections WHERE id = ?').run(id)
}

export function listJewelleryCategories(): JewelleryCategory[] {
  return db.prepare('SELECT * FROM jewellery_categories ORDER BY sort_order ASC, id ASC').all() as JewelleryCategory[]
}
export function listActiveJewelleryCategories(): JewelleryCategory[] {
  return db.prepare("SELECT * FROM jewellery_categories WHERE status = 'active' ORDER BY sort_order ASC, id ASC").all() as JewelleryCategory[]
}
export function getJewelleryCategory(id: number): JewelleryCategory | null {
  return (db.prepare('SELECT * FROM jewellery_categories WHERE id = ?').get(id) as JewelleryCategory | undefined) ?? null
}
export function createJewelleryCategory(data: Partial<JewelleryCategory>): JewelleryCategory {
  const info = db.prepare(`
    INSERT INTO jewellery_categories (name, image, status, sort_order)
    VALUES (@name, @image, @status, @sort_order)
  `).run({
    name: data.name ?? '', image: data.image ?? '', status: data.status ?? 'active', sort_order: data.sort_order ?? 0,
  })
  return getJewelleryCategory(Number(info.lastInsertRowid))!
}
export function updateJewelleryCategory(id: number, data: Partial<JewelleryCategory>): JewelleryCategory | null {
  const existing = getJewelleryCategory(id)
  if (!existing) return null
  const merged = { ...existing, ...data }
  db.prepare(`
    UPDATE jewellery_categories SET name=@name, image=@image, status=@status, sort_order=@sort_order, updated_at=datetime('now')
    WHERE id=@id
  `).run({ ...merged, id })
  return getJewelleryCategory(id)
}
export function deleteJewelleryCategory(id: number) {
  db.prepare('DELETE FROM jewellery_categories WHERE id = ?').run(id)
}

export function listJournalPosts(): JournalPost[] {
  return db.prepare('SELECT * FROM journal_posts ORDER BY sort_order ASC, id DESC').all() as JournalPost[]
}
export function listPublishedJournalPosts(limit?: number): JournalPost[] {
  const sql = `SELECT * FROM journal_posts WHERE status = 'published' ORDER BY sort_order ASC, id DESC${limit ? ' LIMIT ?' : ''}`
  return (limit ? db.prepare(sql).all(limit) : db.prepare(sql).all()) as JournalPost[]
}
export function getJournalPost(id: number): JournalPost | null {
  return (db.prepare('SELECT * FROM journal_posts WHERE id = ?').get(id) as JournalPost | undefined) ?? null
}
export function getJournalPostBySlug(slug: string): JournalPost | null {
  return (db.prepare('SELECT * FROM journal_posts WHERE slug = ?').get(slug) as JournalPost | undefined) ?? null
}
export function slugify(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
export function humanizeSlug(slug: string): string {
  return slug.split('-').filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')
}
export function uniqueSlug(base: string, ignoreId?: number): string {
  let slug = slugify(base) || 'post'
  let n = 2
  while (true) {
    const row = db.prepare('SELECT id FROM journal_posts WHERE slug = ?').get(slug) as { id: number } | undefined
    if (!row || row.id === ignoreId) return slug
    slug = `${slugify(base)}-${n++}`
  }
}
export function createJournalPost(data: Partial<JournalPost>): JournalPost {
  const slug = data.slug || uniqueSlug(data.title || 'post')
  const info = db.prepare(`
    INSERT INTO journal_posts (title, slug, category, excerpt, content, image, read_time, status, views, published_date)
    VALUES (@title, @slug, @category, @excerpt, @content, @image, @read_time, @status, @views, @published_date)
  `).run({
    title: data.title ?? '', slug, category: data.category ?? '', excerpt: data.excerpt ?? '',
    content: data.content ?? '', image: data.image ?? '', read_time: data.read_time ?? '',
    status: data.status ?? 'draft', views: data.views ?? 0,
    published_date: data.published_date ?? (data.status === 'published' ? new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }) : ''),
  })
  return getJournalPost(Number(info.lastInsertRowid))!
}
export function updateJournalPost(id: number, data: Partial<JournalPost>): JournalPost | null {
  const existing = getJournalPost(id)
  if (!existing) return null
  const becomingPublished = data.status === 'published' && existing.status !== 'published'
  const merged = {
    ...existing,
    ...data,
    slug: data.title && data.title !== existing.title ? uniqueSlug(data.title, id) : existing.slug,
    published_date: becomingPublished && !existing.published_date
      ? new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
      : (data.published_date ?? existing.published_date),
  }
  db.prepare(`
    UPDATE journal_posts SET title=@title, slug=@slug, category=@category, excerpt=@excerpt, content=@content,
      image=@image, read_time=@read_time, status=@status, views=@views, published_date=@published_date, updated_at=datetime('now')
    WHERE id=@id
  `).run({ ...merged, id })
  return getJournalPost(id)
}
export function deleteJournalPost(id: number) {
  db.prepare('DELETE FROM journal_posts WHERE id = ?').run(id)
}

export function listAppointments(): Appointment[] {
  return db.prepare('SELECT * FROM appointments ORDER BY id DESC').all() as Appointment[]
}
export function getAppointment(id: number): Appointment | null {
  return (db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as Appointment | undefined) ?? null
}
export function createAppointment(data: Partial<Appointment>): Appointment {
  const info = db.prepare(`
    INSERT INTO appointments (name, email, phone, type, date, time, status, message)
    VALUES (@name, @email, @phone, @type, @date, @time, @status, @message)
  `).run({
    name: data.name ?? '', email: data.email ?? '', phone: data.phone ?? '', type: data.type ?? '',
    date: data.date ?? '', time: data.time ?? '', status: data.status ?? 'pending', message: data.message ?? '',
  })
  return getAppointment(Number(info.lastInsertRowid))!
}
export function updateAppointmentStatus(id: number, status: string): Appointment | null {
  db.prepare("UPDATE appointments SET status = ? WHERE id = ?").run(status, id)
  return getAppointment(id)
}
export function deleteAppointment(id: number) {
  db.prepare('DELETE FROM appointments WHERE id = ?').run(id)
}

export function listQuotes(): Quote[] {
  return db.prepare('SELECT * FROM quotes ORDER BY id DESC').all() as Quote[]
}
export function getQuote(id: number): Quote | null {
  return (db.prepare('SELECT * FROM quotes WHERE id = ?').get(id) as Quote | undefined) ?? null
}
export function createQuote(data: Partial<Quote>): Quote {
  const info = db.prepare(`
    INSERT INTO quotes (name, email, phone, company, category, product_interest, colour, cut, clarity, carat_weight, reference_number, brand, message, status)
    VALUES (@name, @email, @phone, @company, @category, @product_interest, @colour, @cut, @clarity, @carat_weight, @reference_number, @brand, @message, @status)
  `).run({
    name: data.name ?? '', email: data.email ?? '', phone: data.phone ?? '', company: data.company ?? '',
    category: data.category ?? 'Jewellery',
    product_interest: data.product_interest ?? '',
    colour: data.colour ?? '', cut: data.cut ?? '', clarity: data.clarity ?? '', carat_weight: data.carat_weight ?? '',
    reference_number: data.reference_number ?? '', brand: data.brand ?? '',
    message: data.message ?? '', status: data.status ?? 'new',
  })
  return getQuote(Number(info.lastInsertRowid))!
}
export function updateQuoteStatus(id: number, status: string): Quote | null {
  db.prepare('UPDATE quotes SET status = ? WHERE id = ?').run(status, id)
  return getQuote(id)
}
export function deleteQuote(id: number) {
  db.prepare('DELETE FROM quotes WHERE id = ?').run(id)
}
