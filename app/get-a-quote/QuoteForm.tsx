'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function QuoteForm() {
  const searchParams = useSearchParams()
  const prefillProduct = searchParams.get('product') || ''
  const prefillBrand = searchParams.get('brand') || ''
  const prefillRef = searchParams.get('ref') || ''
  const initialCategory = searchParams.get('category') === 'Watches' ? 'Watches' : 'Jewellery'

  const [category, setCategory] = useState<'Jewellery' | 'Watches'>(initialCategory)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    product_interest: prefillProduct,
    colour: '', cut: '', clarity: '', carat_weight: '',
    reference_number: prefillRef, brand: prefillBrand,
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, category }),
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
      {prefillProduct && (
        <div className="bg-rw-light border border-rw-gold px-4 py-3">
          <p className="text-[10px] tracking-wider uppercase font-sans text-rw-gray">Enquiring about</p>
          <p className="text-sm font-sans text-rw-black font-medium">{prefillProduct}</p>
        </div>
      )}

      {/* Category toggle */}
      <div>
        <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">I'm Interested In *</label>
        <div className="grid grid-cols-2 gap-3">
          {(['Jewellery', 'Watches'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`py-3 text-xs tracking-[0.2em] uppercase font-sans border transition-colors ${
                category === c ? 'bg-rw-black text-white border-rw-black' : 'border-rw-border text-rw-gray hover:border-rw-gold'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

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

      {category === 'Jewellery' ? (
        <>
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Product Interested In</label>
            <input
              value={form.product_interest}
              onChange={(e) => setForm({ ...form, product_interest: e.target.value })}
              className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
              placeholder="e.g. Bridal Gold Set, Diamond Solitaire Ring…"
            />
          </div>

          <div className="border-t border-rw-border pt-6">
            <p className="text-xs tracking-[0.3em] uppercase font-sans text-rw-gold mb-4">Requirements</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Colour</label>
                <input
                  value={form.colour}
                  onChange={(e) => setForm({ ...form, colour: e.target.value })}
                  className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
                  placeholder="e.g. D, E, F…"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Cut</label>
                <input
                  value={form.cut}
                  onChange={(e) => setForm({ ...form, cut: e.target.value })}
                  className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
                  placeholder="e.g. Excellent, Very Good…"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Clarity</label>
                <input
                  value={form.clarity}
                  onChange={(e) => setForm({ ...form, clarity: e.target.value })}
                  className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
                  placeholder="e.g. VS1, VVS2…"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Carat / Weight</label>
                <input
                  value={form.carat_weight}
                  onChange={(e) => setForm({ ...form, carat_weight: e.target.value })}
                  className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
                  placeholder="e.g. 1.5 carat, 45 grams…"
                />
              </div>
            </div>
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
        </>
      ) : (
        <div className="border-t border-rw-border pt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Reference Number</label>
              <input
                value={form.reference_number}
                onChange={(e) => setForm({ ...form, reference_number: e.target.value })}
                className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
                placeholder="e.g. 126610LN"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Brand</label>
              <input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
                placeholder="e.g. Rolex, Omega…"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Watch Name / Model</label>
            <input
              value={form.product_interest}
              onChange={(e) => setForm({ ...form, product_interest: e.target.value })}
              className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors"
              placeholder="e.g. Submariner Date"
            />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gray block mb-2">Additional Requirements (Optional)</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="w-full border border-rw-border px-4 py-3 text-sm font-sans text-rw-black outline-none focus:border-rw-gold transition-colors resize-none"
              placeholder="Condition, box & papers, budget, etc…"
            />
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-xs font-sans">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-gold w-full py-4 text-sm disabled:opacity-50">
        {submitting ? 'Sending…' : 'Submit Request'}
      </button>
    </form>
  )
}
