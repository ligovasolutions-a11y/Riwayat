'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'
import type { Product } from '@/lib/content'
import ImageUploadField from '../_components/ImageUploadField'
import GalleryUploadField from '../_components/GalleryUploadField'

export type ProductFormValues = {
  name: string
  category: string
  subcategory: string
  price: string
  stock: string
  status: string
  image: string
  description: string
  story: string
  material: string
  weight: string
  certification: string
  warranty: string
  sku: string
  policy: string
  gross_weight: string
  gold_weight: string
  diamond_weight: string
  caratage: string
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
}

const emptyForm: ProductFormValues = {
  name: '', category: 'Jewellery', subcategory: '', price: '',
  stock: 'Available', status: 'draft', image: '', description: '', story: '',
  material: '', weight: '', certification: '', warranty: '', sku: '',
  policy: '', gross_weight: '', gold_weight: '', diamond_weight: '', caratage: '',
  collection: '', case_size: '', case_material: '', movement: '', dial_colour: '',
  strap_material: '', crystal: '', water_resistance: '', power_reserve: '', functions: '',
  condition: '', box_papers: '', gender: '', year: '',
}

const JEWELLERY_SPEC_FIELDS = [
  { k: 'material', l: 'Material', ph: '22K Gold, Diamond' },
  { k: 'certification', l: 'Certification', ph: 'GIA, BIS 916' },
  { k: 'warranty', l: 'Warranty', ph: 'Lifetime warranty' },
  { k: 'sku', l: 'SKU / Reference', ph: 'RJ-2024-001' },
  { k: 'policy', l: 'Policy', ph: '7-day exchange, no returns on customised pieces' },
  { k: 'gross_weight', l: 'Gross Weight', ph: '45 grams' },
  { k: 'gold_weight', l: 'Gold Weight', ph: '32 grams' },
  { k: 'diamond_weight', l: 'Diamond Weight', ph: '1.2 carat' },
  { k: 'caratage', l: 'Caratage', ph: '22K, 18K' },
] as const

const WATCH_SPEC_FIELDS = [
  { k: 'sku', l: 'Reference Number', ph: '126610LN' },
  { k: 'collection', l: 'Collection', ph: 'Submariner, Speedmaster…' },
  { k: 'case_size', l: 'Case Size', ph: '40mm' },
  { k: 'case_material', l: 'Case Material', ph: 'Stainless Steel, 18K Gold' },
  { k: 'movement', l: 'Movement', ph: 'Automatic, Quartz' },
  { k: 'dial_colour', l: 'Dial Colour', ph: 'Black, Blue' },
  { k: 'strap_material', l: 'Strap / Bracelet Material', ph: 'Oyster Steel, Leather' },
  { k: 'crystal', l: 'Crystal', ph: 'Sapphire' },
  { k: 'water_resistance', l: 'Water Resistance', ph: '300m / 30 ATM' },
  { k: 'power_reserve', l: 'Power Reserve', ph: '70 hours' },
  { k: 'functions', l: 'Functions / Complications', ph: 'Date, Chronograph, GMT' },
  { k: 'condition', l: 'Condition', ph: 'New, Pre-owned – Excellent' },
  { k: 'box_papers', l: 'Box & Papers', ph: 'Full Set, Box Only, None' },
  { k: 'warranty', l: 'Warranty', ph: '5-year international warranty' },
  { k: 'gender', l: 'Gender', ph: "Men's, Women's, Unisex" },
  { k: 'year', l: 'Year (Optional)', ph: '2023' },
] as const

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormValues>(
    product
      ? {
          name: product.name, category: product.category, subcategory: product.subcategory,
          price: product.price, stock: product.stock, status: product.status, image: product.image,
          description: product.description, story: product.story, material: product.material,
          weight: product.weight, certification: product.certification, warranty: product.warranty, sku: product.sku,
          policy: product.policy, gross_weight: product.gross_weight, gold_weight: product.gold_weight,
          diamond_weight: product.diamond_weight, caratage: product.caratage,
          collection: product.collection, case_size: product.case_size, case_material: product.case_material,
          movement: product.movement, dial_colour: product.dial_colour, strap_material: product.strap_material,
          crystal: product.crystal, water_resistance: product.water_resistance, power_reserve: product.power_reserve,
          functions: product.functions, condition: product.condition, box_papers: product.box_papers,
          gender: product.gender, year: product.year,
        }
      : emptyForm
  )
  const [tags, setTags] = useState<string[]>(product?.tags ?? ['handcrafted', 'luxury'])
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const isWatch = form.category === 'Watches'

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Product name is required.')
      return
    }
    setError('')
    setSaving(true)
    try {
      const payload = { ...form, tags, images }
      const res = await fetch(product ? `/api/products/${product.id}` : '/api/products', {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to save product.')
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      if (!product) router.push('/admin/products')
      else router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="text-gray-400 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-serif font-light text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2 text-xs font-sans text-white transition-colors disabled:opacity-50 ${saved ? 'bg-green-600' : 'bg-rw-black hover:bg-rw-gold'}`}
        >
          <Save size={14} /> {saved ? 'Saved!' : saving ? 'Saving…' : product ? 'Save Changes' : 'Publish Product'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-200 p-6 space-y-5">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Product Details</h2>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Product Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Royal Bridal Gold Necklace Set" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">
                {isWatch ? 'Brand' : 'Subcategory'}
              </label>
              <input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                placeholder={isWatch ? 'Rolex, Omega, TAG Heuer…' : 'Rings, Earrings, Bracelets…'}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
              {!isWatch && (
                <p className="text-xs text-gray-400 mt-2">
                  Matches a category under Admin → Categories so this piece shows up in the right navigation menu.
                </p>
              )}
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors bg-white">
                <option>Jewellery</option><option>Watches</option>
              </select>
            </div>
            {[
              { k: 'description', l: 'Description', rows: 4 },
              { k: 'story', l: 'Story Behind the Piece', rows: 3 },
            ].map(({ k, l, rows }) => (
              <div key={k}>
                <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">{l}</label>
                <textarea value={form[k as keyof ProductFormValues]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  rows={rows} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors resize-none" />
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">
              {isWatch ? 'Watch Specifications' : 'Jewellery Specifications'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(isWatch ? WATCH_SPEC_FIELDS : JEWELLERY_SPEC_FIELDS).map(({ k, l, ph }) => (
                <div key={k}>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">{l}</label>
                  <input value={form[k as keyof ProductFormValues]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    placeholder={ph} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4">Product Image</h2>
            <ImageUploadField label="" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4">Gallery Images</h2>
            <GalleryUploadField label="" images={images} onChange={setImages} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Pricing & Status</h2>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Price (₹)</label>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="₹3,80,000 (leave blank for &quot;Price on Request&quot;)" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Availability</label>
              <select value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors bg-white">
                <option>Available</option><option>In Stock</option><option>Made to Order</option><option>Sold</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors bg-white">
                <option value="active">Published</option><option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((t) => (
                <span key={t} className="flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs text-gray-700">
                  {t} <button onClick={() => setTags(tags.filter((x) => x !== t))}><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tag…" className="flex-1 border border-gray-200 px-3 py-2 text-xs outline-none focus:border-rw-gold" />
              <button onClick={addTag} className="px-3 py-2 bg-rw-black text-white text-xs hover:bg-rw-gold transition-colors">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
