'use client'

import { useEffect, useState } from 'react'
import { Save, Eye, GripVertical } from 'lucide-react'
import ImageUploadField from '../_components/ImageUploadField'
import type { HeroSlide } from '@/lib/homepage'

const sections = [
  { id: 'hero', label: 'Hero Section' },
  { id: 'featured', label: 'Featured Collections' },
  { id: 'watches', label: 'Luxury Watches' },
  { id: 'jewellery', label: 'Signature Jewellery' },
  { id: 'craftsmanship', label: 'Craftsmanship' },
  { id: 'heritage', label: 'Heritage' },
  { id: 'appointments', label: 'Private Appointments' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'journal', label: 'Journal' },
  { id: 'instagram', label: 'Instagram Gallery' },
]

type GenericSectionData = {
  tag?: string
  headline?: string
  subheadline?: string
  body?: string
  buttonText?: string
  buttonLink?: string
  image?: string
}

export default function HomepageEditor() {
  const [activeSection, setActiveSection] = useState('hero')
  const [activeSlide, setActiveSlide] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [heroButtons, setHeroButtons] = useState({ btn1: '', btn2: '', btn3: '' })
  const [announcement, setAnnouncement] = useState('')
  const [genericSections, setGenericSections] = useState<Record<string, GenericSectionData>>({})

  useEffect(() => {
    fetch('/api/homepage')
      .then((r) => r.json())
      .then((data) => {
        setHeroSlides(data.heroSlides ?? [])
        setHeroButtons(data.heroButtons ?? { btn1: '', btn2: '', btn3: '' })
        setAnnouncement(data.announcement ?? '')
        setGenericSections(data.sections ?? {})
      })
      .finally(() => setLoading(false))
  }, [])

  const updateSlide = (index: number, patch: Partial<HeroSlide>) => {
    setHeroSlides((slides) => slides.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroSlides, heroButtons, announcement, sections: genericSections }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const slide = heroSlides[activeSlide]
  const genericData = genericSections[activeSection] ?? {}
  const setGenericField = (key: keyof GenericSectionData, value: string) => {
    setGenericSections((s) => ({ ...s, [activeSection]: { ...s[activeSection], [key]: value } }))
  }

  if (loading) return <div className="p-6 lg:p-8 text-sm text-gray-400">Loading…</div>

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-gray-900">Homepage Editor</h1>
          <p className="text-sm text-gray-500 mt-1">Edit every section of your homepage without touching code.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-xs font-sans text-gray-700 hover:border-rw-gold hover:text-rw-gold transition-colors">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section list */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-900">Page Sections</h2>
              <p className="text-xs text-gray-400 mt-1">Click to edit</p>
            </div>
            <div className="divide-y divide-gray-50">
              {sections.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${activeSection === sec.id ? 'bg-amber-50 border-l-2 border-rw-gold' : 'hover:bg-gray-50'}`}
                >
                  <GripVertical size={14} className="text-gray-300" />
                  <span className="flex-1 text-sm text-gray-700">{sec.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Announcement Bar */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Announcement Bar</h3>
            <input
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-rw-gold transition-colors"
            />
            <p className="text-xs text-gray-400 mt-2">Separate multiple announcements with |</p>
          </div>

          {/* Hero Editor */}
          {activeSection === 'hero' && (
            <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-5">
              <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Hero Buttons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['btn1', 'btn2', 'btn3'] as const).map((key, i) => (
                  <div key={key}>
                    <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Button {i + 1}</label>
                    <input
                      value={heroButtons[key]}
                      onChange={(e) => setHeroButtons({ ...heroButtons, [key]: e.target.value })}
                      className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-rw-gold transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <h3 className="text-sm font-medium text-gray-900">Hero Slides</h3>
                <div className="flex gap-2">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`w-7 h-7 text-xs transition-colors ${activeSlide === i ? 'bg-rw-black text-white' : 'border border-gray-200 text-gray-600'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {slide && (
                <>
                  {([
                    { key: 'label', label: 'Label' },
                    { key: 'headline', label: 'Headline (line 1)' },
                    { key: 'headline2', label: 'Headline (line 2, italic)' },
                    { key: 'sub', label: 'Subtext' },
                  ] as const).map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">{label}</label>
                      <input
                        value={slide[key]}
                        onChange={(e) => updateSlide(activeSlide, { [key]: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-rw-gold transition-colors"
                      />
                    </div>
                  ))}
                  <ImageUploadField
                    label="Slide Background Image"
                    value={slide.image}
                    onChange={(url) => updateSlide(activeSlide, { image: url })}
                  />
                </>
              )}
            </div>
          )}

          {/* Generic section editor for others */}
          {activeSection !== 'hero' && (
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3 mb-2">
                {sections.find(s => s.id === activeSection)?.label} — Editor
              </h3>
              <p className="text-xs text-gray-400 mb-5">
                These notes are saved for your reference. This section's layout is currently fixed on the live site, so changes here don't yet appear publicly — ask your developer if you'd like this section made fully editable too.
              </p>
              <div className="space-y-5">
                {([
                  { key: 'tag', label: 'Section Tag/Label' },
                  { key: 'headline', label: 'Headline' },
                  { key: 'subheadline', label: 'Subheadline' },
                  { key: 'buttonText', label: 'Button Text' },
                  { key: 'buttonLink', label: 'Button Link' },
                ] as const).map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">{label}</label>
                    <input
                      value={genericData[key] ?? ''}
                      onChange={(e) => setGenericField(key, e.target.value)}
                      placeholder={`Enter ${label.toLowerCase()}…`}
                      className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-rw-gold transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Body Text</label>
                  <textarea
                    rows={3}
                    value={genericData.body ?? ''}
                    onChange={(e) => setGenericField('body', e.target.value)}
                    placeholder="Enter body text…"
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-rw-gold transition-colors resize-none"
                  />
                </div>
                <ImageUploadField
                  label="Section Image"
                  value={genericData.image ?? ''}
                  onChange={(url) => setGenericField('image', url)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
