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
  product_interest: string
  colour: string
  cut: string
  clarity: string
  carat_weight: string
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
export function createProduct(data: Partial<Product>): Product {
  const info = db.prepare(`
    INSERT INTO products (name, category, subcategory, price, stock, status, image, images, description, story, material, weight, certification, warranty, sku, tags)
    VALUES (@name, @category, @subcategory, @price, @stock, @status, @image, @images, @description, @story, @material, @weight, @certification, @warranty, @sku, @tags)
  `).run({
    name: data.name ?? '', category: data.category ?? 'Jewellery', subcategory: data.subcategory ?? '',
    price: data.price ?? '', stock: data.stock ?? 'Available', status: data.status ?? 'draft',
    image: data.image ?? '', images: JSON.stringify(data.images ?? []),
    description: data.description ?? '', story: data.story ?? '',
    material: data.material ?? '', weight: data.weight ?? '', certification: data.certification ?? '',
    warranty: data.warranty ?? '', sku: data.sku ?? '', tags: JSON.stringify(data.tags ?? []),
  })
  return getProduct(Number(info.lastInsertRowid))!
}
export function updateProduct(id: number, data: Partial<Product>): Product | null {
  const existing = getProduct(id)
  if (!existing) return null
  const merged = { ...existing, ...data }
  db.prepare(`
    UPDATE products SET name=@name, category=@category, subcategory=@subcategory, price=@price, stock=@stock,
      status=@status, image=@image, images=@images, description=@description, story=@story, material=@material, weight=@weight,
      certification=@certification, warranty=@warranty, sku=@sku, tags=@tags, updated_at=datetime('now')
    WHERE id=@id
  `).run({ ...merged, id, tags: JSON.stringify(merged.tags ?? []), images: JSON.stringify(merged.images ?? []) })
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
    INSERT INTO quotes (name, email, phone, company, product_interest, colour, cut, clarity, carat_weight, message, status)
    VALUES (@name, @email, @phone, @company, @product_interest, @colour, @cut, @clarity, @carat_weight, @message, @status)
  `).run({
    name: data.name ?? '', email: data.email ?? '', phone: data.phone ?? '', company: data.company ?? '',
    product_interest: data.product_interest ?? '',
    colour: data.colour ?? '', cut: data.cut ?? '', clarity: data.clarity ?? '', carat_weight: data.carat_weight ?? '',
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
