'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import type { JewelleryCategory } from '@/lib/content'
import ImageUploadField from '../_components/ImageUploadField'

type FormValues = {
  name: string
  image: string
  status: string
  sort_order: number
}

const emptyForm: FormValues = { name: '', image: '', status: 'active', sort_order: 0 }

export default function CategoryForm({ category }: { category?: JewelleryCategory }) {
  const router = useRouter()
  const [form, setForm] = useState<FormValues>(category ? { ...category } : emptyForm)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Category name is required.')
      return
    }
    setError('')
    setSaving(true)
    try {
      const res = await fetch(category ? `/api/jewellery-categories/${category.id}` : '/api/jewellery-categories', {
        method: category ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to save category.')
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      if (!category) router.push('/admin/categories')
      else router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/categories" className="text-gray-400 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-serif font-light text-gray-900">{category ? 'Edit Category' : 'New Category'}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2 text-xs font-sans text-white transition-colors disabled:opacity-50 ${saved ? 'bg-green-600' : 'bg-rw-black hover:bg-rw-gold'}`}
        >
          <Save size={14} /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Category'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="max-w-2xl space-y-5">
        <div className="bg-white border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Category Details</h2>
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Category Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold" placeholder="e.g., Rings" />
            <p className="text-xs text-gray-400 mt-2">
              Products with a matching Subcategory (in Products → Subcategory) will show up under this category automatically.
            </p>
          </div>
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold bg-white">
              <option value="active">Active (shown in navigation)</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4">Category Image</h2>
          <ImageUploadField label="" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
        </div>
      </div>
    </div>
  )
}
