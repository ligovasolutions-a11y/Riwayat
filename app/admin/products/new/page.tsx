'use client'

import { useState } from 'react'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function NewProduct() {
  const [form, setForm] = useState({
    name: '', category: 'Jewellery', subcategory: '', price: '',
    stock: 'Available', status: 'draft', description: '', story: '',
    material: '', weight: '', certification: '', warranty: '', sku: '',
  })
  const [tags, setTags] = useState(['handcrafted', 'luxury'])
  const [tagInput, setTagInput] = useState('')
  const [saved, setSaved] = useState(false)

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="text-gray-400 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-serif font-light text-gray-900">Add New Product</h1>
        </div>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          className={`flex items-center gap-2 px-5 py-2 text-xs font-sans text-white transition-colors ${saved ? 'bg-green-600' : 'bg-rw-black hover:bg-rw-gold'}`}
        >
          <Save size={14} /> {saved ? 'Saved!' : 'Publish Product'}
        </button>
      </div>

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
                <input value={form[k as keyof typeof form]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
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
                <textarea value={form[k as keyof typeof form]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  rows={rows} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors resize-none" />
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: 'material', l: 'Material', ph: '22K Gold, Diamond' },
                { k: 'weight', l: 'Weight', ph: '45 grams' },
                { k: 'certification', l: 'Certification', ph: 'GIA, BIS 916' },
                { k: 'warranty', l: 'Warranty', ph: 'Lifetime warranty' },
                { k: 'sku', l: 'SKU / Reference', ph: 'RJ-2024-001' },
              ].map(({ k, l, ph }) => (
                <div key={k}>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">{l}</label>
                  <input value={form[k as keyof typeof form]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    placeholder={ph} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4">Product Images</h2>
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-rw-gold transition-colors">
                  <Plus size={18} className="text-gray-300" />
                  <p className="text-[10px] text-gray-400 mt-1">{i === 0 ? 'Main' : `Photo ${i+1}`}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Pricing & Status</h2>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Price (₹)</label>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="380000" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
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
                  {t} <button onClick={() => setTags(tags.filter(x => x !== t))}><X size={10} /></button>
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
