'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import type { JournalPost } from '@/lib/content'
import ImageUploadField from '../_components/ImageUploadField'

type FormValues = {
  title: string
  category: string
  excerpt: string
  content: string
  image: string
  read_time: string
  status: string
}

const emptyForm: FormValues = {
  title: '', category: 'Watch Guide', excerpt: '', content: '', image: '', read_time: '', status: 'draft',
}

const categories = ['Watch Guide', 'Jewellery Guide', 'Bridal', 'Diamond Education', 'Luxury Lifestyle', 'Care Tips']

export default function JournalForm({ post }: { post?: JournalPost }) {
  const router = useRouter()
  const [form, setForm] = useState<FormValues>(post ? { ...post } : emptyForm)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async (status: string) => {
    if (!form.title.trim()) {
      setError('Article title is required.')
      return
    }
    setError('')
    setSaving(true)
    try {
      const payload = { ...form, status }
      const res = await fetch(post ? `/api/journal/${post.id}` : '/api/journal', {
        method: post ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to save article.')
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      if (!post) router.push('/admin/journal')
      else router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/journal" className="text-gray-400 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-serif font-light text-gray-900">{post ? 'Edit Article' : 'New Article'}</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-5 py-2 border border-gray-200 text-xs text-gray-600 hover:border-rw-gold transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-sans text-white transition-colors disabled:opacity-50 ${saved ? 'bg-green-600' : 'bg-rw-black hover:bg-rw-gold'}`}
          >
            <Save size={14} /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors"
                  placeholder="Article title…" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors bg-white">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2} placeholder="Short summary shown on listing cards…"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors resize-none" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Content</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={12} placeholder="Write your article here…"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors resize-none" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4">Cover Image</h2>
            <ImageUploadField label="" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Details</h2>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Read Time</label>
              <input value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                placeholder="8 min read" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
