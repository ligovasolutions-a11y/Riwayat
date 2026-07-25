'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', product_interest: '', message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <CheckCircle size={48} className="text-rw-gold mb-6" />
        <h2 className="luxury-heading text-3xl text-rw-black mb-4">Quote Request Received</h2>
        <p className="text-rw-gray font-sans font-light max-w-sm leading-relaxed">
          Thank you, {form.name}. Our team will review your request and get back to you at {form.email} within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      <div>
        <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Company (Optional)</label>
        <input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
          placeholder="Company name"
        />
      </div>
      <div>
        <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Product Interested In</label>
        <input
          value={form.product_interest}
          onChange={(e) => setForm({ ...form, product_interest: e.target.value })}
          className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
          placeholder="e.g. Rolex Submariner, Bridal Gold Set…"
        />
      </div>
      <div>
        <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Message</label>
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
        {submitting ? 'Sending…' : 'Submit Request'}
      </button>
    </form>
  )
}
