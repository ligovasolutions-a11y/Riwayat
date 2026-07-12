'use client'

import { useState } from 'react'
import { Save, Eye, RefreshCw, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'

const sections = [
  { id: 'hero', label: 'Hero Section', active: true },
  { id: 'featured', label: 'Featured Collections', active: true },
  { id: 'watches', label: 'Luxury Watches', active: true },
  { id: 'jewellery', label: 'Signature Jewellery', active: true },
  { id: 'craftsmanship', label: 'Craftsmanship', active: true },
  { id: 'heritage', label: 'Heritage', active: true },
  { id: 'appointments', label: 'Private Appointments', active: true },
  { id: 'testimonials', label: 'Testimonials', active: true },
  { id: 'journal', label: 'Journal', active: true },
  { id: 'instagram', label: 'Instagram Gallery', active: true },
]

export default function HomepageEditor() {
  const [activeSection, setActiveSection] = useState('hero')
  const [saved, setSaved] = useState(false)

  const [heroData, setHeroData] = useState({
    headline: 'Where Heritage Meets Time',
    subheadline: 'Crafting timeless jewellery and curating exceptional timepieces for generations.',
    btn1: 'Explore Jewellery',
    btn2: 'Explore Watches',
    btn3: 'Book Private Consultation',
  })

  const [announcement, setAnnouncement] = useState(
    'Free Shipping on Orders Above ₹50,000 | Book a Private Consultation | ISO Certified Gems'
  )

  const [sectionList, setSectionList] = useState(sections)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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
            className={`flex items-center gap-2 px-5 py-2 text-xs font-sans text-white transition-colors ${saved ? 'bg-green-600' : 'bg-rw-black hover:bg-rw-gold'}`}
          >
            <Save size={14} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section list */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-900">Page Sections</h2>
              <p className="text-xs text-gray-400 mt-1">Click to edit · Drag to reorder</p>
            </div>
            <div className="divide-y divide-gray-50">
              {sectionList.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${activeSection === sec.id ? 'bg-amber-50 border-l-2 border-rw-gold' : 'hover:bg-gray-50'}`}
                >
                  <GripVertical size={14} className="text-gray-300 cursor-grab" />
                  <span className="flex-1 text-sm text-gray-700">{sec.label}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSectionList(sl => sl.map(s => s.id === sec.id ? { ...s, active: !s.active } : s))
                    }}
                    className={`w-8 h-4 rounded-full transition-colors relative ${sec.active ? 'bg-rw-gold' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${sec.active ? 'left-4' : 'left-0.5'}`} />
                  </button>
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
              <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Hero Section</h3>
              {[
                { key: 'headline', label: 'Main Headline', placeholder: 'Where Heritage Meets Time' },
                { key: 'subheadline', label: 'Subheadline', placeholder: 'Crafting timeless jewellery…' },
                { key: 'btn1', label: 'Button 1 Text', placeholder: 'Explore Jewellery' },
                { key: 'btn2', label: 'Button 2 Text', placeholder: 'Explore Watches' },
                { key: 'btn3', label: 'Button 3 Text', placeholder: 'Book Private Consultation' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">{label}</label>
                  <input
                    value={heroData[key as keyof typeof heroData]}
                    onChange={(e) => setHeroData({ ...heroData, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-rw-gold transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Hero Background Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded p-8 text-center hover:border-rw-gold transition-colors cursor-pointer">
                  <p className="text-sm text-gray-500">Click to upload or drag image here</p>
                  <p className="text-xs text-gray-400 mt-1">Recommended: 1920×1080px, JPEG/WebP</p>
                </div>
              </div>
            </div>
          )}

          {/* Generic section editor for others */}
          {activeSection !== 'hero' && (
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3 mb-5">
                {sectionList.find(s => s.id === activeSection)?.label} — Editor
              </h3>
              <div className="space-y-5">
                {['Section Tag/Label', 'Headline', 'Subheadline', 'Body Text', 'Button Text', 'Button Link'].map((field) => (
                  <div key={field}>
                    <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">{field}</label>
                    {field === 'Body Text' ? (
                      <textarea
                        rows={3}
                        placeholder={`Enter ${field.toLowerCase()}…`}
                        className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-rw-gold transition-colors resize-none"
                      />
                    ) : (
                      <input
                        placeholder={`Enter ${field.toLowerCase()}…`}
                        className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-rw-gold transition-colors"
                      />
                    )}
                  </div>
                ))}
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Section Images</label>
                  <div className="border-2 border-dashed border-gray-200 rounded p-8 text-center hover:border-rw-gold transition-colors cursor-pointer">
                    <p className="text-sm text-gray-500">Click to upload images</p>
                    <p className="text-xs text-gray-400 mt-1">Supports JPEG, PNG, WebP</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
