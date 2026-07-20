'use client'

import { useState } from 'react'
import { Crown, MapPin, Watch, Gem, CheckCircle } from 'lucide-react'

const types = [
  { id: 'boutique', icon: MapPin, label: 'Boutique Visit', desc: 'Walk through our collections at your leisure', duration: '1-2 hours' },
  { id: 'consultation', icon: Gem, label: 'Jewellery Consultation', desc: 'One-on-one with our jewellery expert', duration: '1 hour' },
  { id: 'bridal', icon: Crown, label: 'Bridal Consultation', desc: 'Dedicated session for your wedding jewellery', duration: '2-3 hours' },
  { id: 'watch', icon: Watch, label: 'Watch Consultation', desc: 'Private viewing with our horology team', duration: '1 hour' },
]

export default function AppointmentBookingContent({ address }: { address: string }) {
  const [selected, setSelected] = useState('consultation')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', time: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: types.find((t) => t.id === selected)?.label || '',
        }),
      })
      if (!res.ok) {
        setError('Something went wrong. Please try again or call us directly.')
        return
      }
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
      {/* Left */}
      <div>
        <p className="section-label mb-4">By Appointment</p>
        <h1 className="luxury-heading text-4xl lg:text-6xl xl:text-7xl text-rw-black leading-none mb-8">
          Book a Private<br /><em className="italic">Consultation</em>
        </h1>
        <p className="text-rw-gray font-sans font-light text-base lg:text-lg leading-relaxed mb-10 max-w-md">
          We believe in giving every client our complete, undivided attention.
          Book a private appointment and experience Riwaayat at its finest.
        </p>

        {/* Appointment types */}
        <div className="space-y-3 mb-10">
          {types.map(({ id, icon: Icon, label, desc, duration }) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`w-full flex items-center gap-5 p-5 text-left border transition-all duration-300 ${
                selected === id
                  ? 'border-rw-gold bg-rw-light'
                  : 'border-rw-border hover:border-rw-gold'
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 transition-colors ${
                selected === id ? 'bg-rw-gold' : 'bg-rw-light'
              }`}>
                <Icon size={16} className={selected === id ? 'text-white' : 'text-rw-gray'} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-sans font-medium text-rw-black">{label}</p>
                <p className="text-xs font-sans text-rw-gray mt-0.5">{desc}</p>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-sans text-rw-gold whitespace-nowrap">{duration}</span>
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="bg-rw-black p-8">
          <p className="text-rw-gold text-[10px] tracking-[0.3em] uppercase font-sans mb-3">Boutique Hours</p>
          <div className="space-y-2 text-white/60 text-sm font-sans">
            <div className="flex justify-between"><span>Monday – Saturday</span><span>10:00 AM – 8:00 PM</span></div>
            <div className="flex justify-between"><span>Sunday</span><span>11:00 AM – 6:00 PM</span></div>
          </div>
          <hr className="border-white/10 my-4" />
          <p className="text-white/40 text-xs font-sans">{address}</p>
        </div>
      </div>

      {/* Right: Form */}
      <div>
        {submitted ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <CheckCircle size={48} className="text-rw-gold mb-6" />
            <h2 className="luxury-heading text-3xl text-rw-black mb-4">Appointment Requested</h2>
            <p className="text-rw-gray font-sans font-light max-w-sm leading-relaxed">
              Thank you, {form.name}. Our team will confirm your appointment within 2 hours.
              You'll receive a confirmation on {form.email} and {form.phone}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Full Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Phone *</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Email Address *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Preferred Date *</label>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Preferred Time</label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors bg-white"
                >
                  <option value="">Select time</option>
                  {['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Message / Special Requests</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors resize-none"
                placeholder="Tell us what you're looking for…"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-sans">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-gold w-full py-4 text-sm disabled:opacity-50">
              {submitting ? 'Sending…' : 'Request Appointment'}
            </button>
            <p className="text-rw-gray text-[10px] tracking-wider uppercase font-sans text-center">
              We'll confirm within 2 hours · WhatsApp confirmation available
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
