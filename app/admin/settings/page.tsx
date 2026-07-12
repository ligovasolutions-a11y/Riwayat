'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'

export default function SettingsAdmin() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'Riwaayat Jewels',
    tagline: 'Where Heritage Meets Time',
    phone: '+91 99999 88888',
    email: 'hello@riwaayatjewels.com',
    address: '123 Luxury Lane, Bandra West, Mumbai — 400050',
    instagram: 'riwaayatjewels',
    facebook: 'riwaayatjewels',
    youtube: '@riwaayatjewels',
    whatsapp: '+919999988888',
    announcement: 'Free Shipping on Orders Above ₹50,000 | Book a Private Consultation | ISO Certified Gems',
    metaTitle: 'Riwaayat Jewels – Where Heritage Meets Time',
    metaDesc: 'Crafting timeless jewellery and curating exceptional timepieces for generations.',
  })

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Global website configuration</p>
        </div>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          className={`flex items-center gap-2 px-5 py-2 text-xs font-sans text-white transition-colors ${saved ? 'bg-green-600' : 'bg-rw-black hover:bg-rw-gold'}`}>
          <Save size={14} /> {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        {[
          { title: 'Brand Identity', fields: [
            { k: 'siteName', l: 'Website Name' },
            { k: 'tagline', l: 'Tagline' },
            { k: 'announcement', l: 'Announcement Bar Text' },
          ]},
          { title: 'Contact Information', fields: [
            { k: 'phone', l: 'Phone Number' },
            { k: 'email', l: 'Email Address' },
            { k: 'address', l: 'Store Address' },
            { k: 'whatsapp', l: 'WhatsApp Number' },
          ]},
          { title: 'Social Media', fields: [
            { k: 'instagram', l: 'Instagram Handle' },
            { k: 'facebook', l: 'Facebook Page' },
            { k: 'youtube', l: 'YouTube Channel' },
          ]},
          { title: 'SEO', fields: [
            { k: 'metaTitle', l: 'Meta Title' },
            { k: 'metaDesc', l: 'Meta Description' },
          ]},
        ].map(({ title, fields }) => (
          <div key={title} className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">{title}</h2>
            {fields.map(({ k, l }) => (
              <div key={k}>
                <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">{l}</label>
                <input value={settings[k as keyof typeof settings]} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-rw-gold transition-colors" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
