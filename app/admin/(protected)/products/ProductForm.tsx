'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'
import type { Product } from '@/lib/content'
import ImageUploadField from '../_components/ImageUploadField'

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
}

const emptyForm: ProductFormValues = {
  name: '', category: 'Jewellery', subcategory: '', price: '',
  stock: 'Available', status: 'draft', image: '', description: '', story: '',
  material: '', weight: '', certification: '', warranty: '', sku: '',
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormValues>(
    product
      ? {
          name: product.name, category: product.category, subcategory: product.subcategory,
          price: product.price, stock: product.stock, status: product.status, image: product.image,
          description: product.description, story: product.story, material: product.material,
          weight: product.weight, certification: product.certification, warranty: product.warranty, sku: product.sku,
        }
      : emptyForm
  )
  const [tags, setTags] = useState<string[]>(product?.tags ?? ['handcrafted', 'luxury'])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

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
      const payload = { ...form, tags }
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
            {[
              { k: 'name', l: 'Product Name *', ph: 'Royal Bridal Gold Necklace Set' },
              { k: 'subcategory', l: 'Subcategory', ph: 'Bridal, Diamond, Polki…' },
            ].map(({ k, l, ph }) => (
              <div key={k}>
                <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">{l}</label>
                <input value={form[k as keyof ProductFormValues]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  placeholder={ph} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
              </div>
            ))}
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
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { k: 'material', l: 'Material', ph: '22K Gold, Diamond' },
                { k: 'weight', l: 'Weight', ph: '45 grams' },
                { k: 'certification', l: 'Certification', ph: 'GIA, BIS 916' },
                { k: 'warranty', l: 'Warranty', ph: 'Lifetime warranty' },
                { k: 'sku', l: 'SKU / Reference', ph: 'RJ-2024-001' },
              ].map(({ k, l, ph }) => (
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
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Pricing & Status</h2>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Price (₹)</label>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="₹3,80,000" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
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
