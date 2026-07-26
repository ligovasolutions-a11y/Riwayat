'use client'

import { useEffect, useState } from 'react'
import { Save, Eye, Plus, X } from 'lucide-react'
import type { AboutContent } from '@/lib/about'
import ImageUploadField from '../_components/ImageUploadField'

const EMPTY: AboutContent = {
  hero: { label: '', heading: '', heading2: '', image: '' },
  founder: { label: '', heading: '', heading2: '', image: '', paragraphs: [], quoteText: '', quoteCite: '' },
  values: { label: '', heading: '', items: [] },
  cta: { label: '', heading: '', text: '' },
}

export default function AboutPageEditor() {
  const [content, setContent] = useState<AboutContent>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/about')
      .then((r) => r.json())
      .then((data) => setContent({ ...EMPTY, ...data }))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 lg:p-8 text-sm text-gray-400">Loading…</div>

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-gray-900">About Page</h1>
          <p className="text-sm text-gray-500 mt-1">Edit every part of the About page without touching code.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/about" target="_blank" className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-xs font-sans text-gray-700 hover:border-rw-gold hover:text-rw-gold transition-colors">
            <Eye size={14} /> Preview
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-sans text-white transition-colors disabled:opacity-50 ${saved ? 'bg-green-600' : 'bg-rw-black hover:bg-rw-gold'}`}
          >
            <Save size={14} /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Hero */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Hero Section</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Label</label>
              <input value={content.hero.label} onChange={(e) => setContent({ ...content, hero: { ...content.hero, label: e.target.value } })}
                placeholder="Est. 1974" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Heading (line 1)</label>
              <input value={content.hero.heading} onChange={(e) => setContent({ ...content, hero: { ...content.hero, heading: e.target.value } })}
                placeholder="Our" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Heading (line 2, italic)</label>
              <input value={content.hero.heading2} onChange={(e) => setContent({ ...content, hero: { ...content.hero, heading2: e.target.value } })}
                placeholder="Story" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
          </div>
          <ImageUploadField label="Hero Background Image" value={content.hero.image} onChange={(url) => setContent({ ...content, hero: { ...content.hero, image: url } })} />
        </div>

        {/* Founder */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Founder Section</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Label</label>
              <input value={content.founder.label} onChange={(e) => setContent({ ...content, founder: { ...content.founder, label: e.target.value } })}
                placeholder="Our Founder" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Heading (line 1)</label>
              <input value={content.founder.heading} onChange={(e) => setContent({ ...content, founder: { ...content.founder, heading: e.target.value } })}
                placeholder="A Vision Born" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Heading (line 2, italic)</label>
              <input value={content.founder.heading2} onChange={(e) => setContent({ ...content, founder: { ...content.founder, heading2: e.target.value } })}
                placeholder="in Mumbai" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Paragraphs</label>
            <div className="space-y-3">
              {content.founder.paragraphs.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    value={p}
                    onChange={(e) => {
                      const paragraphs = [...content.founder.paragraphs]
                      paragraphs[i] = e.target.value
                      setContent({ ...content, founder: { ...content.founder, paragraphs } })
                    }}
                    rows={3}
                    className="flex-1 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors resize-none"
                  />
                  <button
                    onClick={() => setContent({ ...content, founder: { ...content.founder, paragraphs: content.founder.paragraphs.filter((_, idx) => idx !== i) } })}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setContent({ ...content, founder: { ...content.founder, paragraphs: [...content.founder.paragraphs, ''] } })}
              className="mt-3 flex items-center gap-1 text-xs font-sans text-rw-gold hover:underline"
            >
              <Plus size={12} /> Add Paragraph
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Quote</label>
              <input value={content.founder.quoteText} onChange={(e) => setContent({ ...content, founder: { ...content.founder, quoteText: e.target.value } })}
                placeholder="We don't sell jewellery. We preserve memories." className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Quote Attribution</label>
              <input value={content.founder.quoteCite} onChange={(e) => setContent({ ...content, founder: { ...content.founder, quoteCite: e.target.value } })}
                placeholder="— Founder Name" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
          </div>

          <ImageUploadField label="Founder Image" value={content.founder.image} onChange={(url) => setContent({ ...content, founder: { ...content.founder, image: url } })} />
        </div>

        {/* Values / Mission */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Mission & Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Label</label>
              <input value={content.values.label} onChange={(e) => setContent({ ...content, values: { ...content.values, label: e.target.value } })}
                placeholder="What We Stand For" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Heading</label>
              <input value={content.values.heading} onChange={(e) => setContent({ ...content, values: { ...content.values, heading: e.target.value } })}
                placeholder="Our Values" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Values</label>
            <div className="space-y-3">
              {content.values.items.map((v, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input
                    value={v.title}
                    onChange={(e) => {
                      const items = [...content.values.items]
                      items[i] = { ...items[i], title: e.target.value }
                      setContent({ ...content, values: { ...content.values, items } })
                    }}
                    placeholder="Title"
                    className="w-32 flex-shrink-0 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-rw-gold transition-colors"
                  />
                  <input
                    value={v.desc}
                    onChange={(e) => {
                      const items = [...content.values.items]
                      items[i] = { ...items[i], desc: e.target.value }
                      setContent({ ...content, values: { ...content.values, items } })
                    }}
                    placeholder="Description"
                    className="flex-1 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-rw-gold transition-colors"
                  />
                  <button
                    onClick={() => setContent({ ...content, values: { ...content.values, items: content.values.items.filter((_, idx) => idx !== i) } })}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 mt-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setContent({ ...content, values: { ...content.values, items: [...content.values.items, { title: '', desc: '' }] } })}
              className="mt-3 flex items-center gap-1 text-xs font-sans text-rw-gold hover:underline"
            >
              <Plus size={12} /> Add Value
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Closing Section</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Label</label>
              <input value={content.cta.label} onChange={(e) => setContent({ ...content, cta: { ...content.cta, label: e.target.value } })}
                placeholder="Experience Riwaayat" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Heading</label>
              <input value={content.cta.heading} onChange={(e) => setContent({ ...content, cta: { ...content.cta, heading: e.target.value } })}
                placeholder="Visit Our Boutique" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Text</label>
            <textarea value={content.cta.text} onChange={(e) => setContent({ ...content, cta: { ...content.cta, text: e.target.value } })}
              rows={3} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors resize-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
