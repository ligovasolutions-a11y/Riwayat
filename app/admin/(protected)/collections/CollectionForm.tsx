'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import type { Collection } from '@/lib/content'
import ImageUploadField from '../_components/ImageUploadField'

type FormValues = {
  name: string
  subtitle: string
  category: string
  tag: string
  image: string
  href: string
  size: string
  products_count: number
  status: string
}

const emptyForm: FormValues = {
  name: '', subtitle: '', category: 'Jewellery', tag: '', image: '', href: '', size: 'small', products_count: 0, status: 'draft',
}

export default function CollectionForm({ collection }: { collection?: Collection }) {
  const router = useRouter()
  const [form, setForm] = useState<FormValues>(collection ? { ...collection } : emptyForm)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Collection name is required.')
      return
    }
    setError('')
    setSaving(true)
    try {
      const res = await fetch(collection ? `/api/collections/${collection.id}` : '/api/collections', {
        method: collection ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to save collection.')
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      if (!collection) router.push('/admin/collections')
      else router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/collections" className="text-gray-400 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-serif font-light text-gray-900">{collection ? 'Edit Collection' : 'New Collection'}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2 text-xs font-sans text-white transition-colors disabled:opacity-50 ${saved ? 'bg-green-600' : 'bg-rw-black hover:bg-rw-gold'}`}
        >
          <Save size={14} /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Collection'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Collection Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Collection Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold" placeholder="e.g., Summer Edit" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold bg-white">
                  <option>Jewellery</option><option>Watches</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Subtitle</label>
              <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold" placeholder="For the most precious day of your life" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Badge Tag</label>
                <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold" placeholder="New Season, Exclusive…" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Link (href)</label>
                <input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold" placeholder="/jewellery/bridal" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4">Cover Image</h2>
            <ImageUploadField label="" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Display & Status</h2>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Card Size on Homepage</label>
              <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold bg-white">
                <option value="large">Large</option><option value="small">Small</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Products Count</label>
              <input type="number" min={0} value={form.products_count}
                onChange={(e) => setForm({ ...form, products_count: Number(e.target.value) })}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold bg-white">
                <option value="active">Active (shown on homepage)</option><option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
