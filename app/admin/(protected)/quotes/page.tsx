'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, Building2, Trash2 } from 'lucide-react'
import type { Quote } from '@/lib/content'

export default function QuotesAdmin() {
  const [filter, setFilter] = useState('all')
  const [list, setList] = useState<Quote[]>([])
  const [selected, setSelected] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/quotes')
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? list : list.filter((q) => q.status === filter)

  const openQuote = async (q: Quote) => {
    setSelected(q)
    if (q.status === 'new') {
      setList((l) => l.map((x) => (x.id === q.id ? { ...x, status: 'read' } : x)))
      await fetch(`/api/quotes/${q.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      })
    }
  }

  const deleteQuote = async (id: number) => {
    if (!confirm('Delete this quote request?')) return
    setList((l) => l.filter((x) => x.id !== id))
    if (selected?.id === id) setSelected(null)
    await fetch(`/api/quotes/${id}`, { method: 'DELETE' })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-gray-900">Quotes</h1>
          <p className="text-sm text-gray-500 mt-1">{list.filter((q) => q.status === 'new').length} new requests</p>
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-sans capitalize transition-colors ${filter === f ? 'bg-rw-black text-white' : 'border border-gray-200 text-gray-600 hover:border-rw-gold'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-sm divide-y divide-gray-50">
          {filtered.map((q) => (
            <div
              key={q.id}
              onClick={() => openQuote(q)}
              className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === q.id ? 'bg-amber-50 border-l-2 border-rw-gold' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-medium text-gray-900">{q.name}</p>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${q.status === 'new' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="text-xs text-rw-gold tracking-wide truncate">{q.product_interest || 'General enquiry'}</p>
                  <p className="text-xs text-gray-500 mt-1">{q.email}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteQuote(q.id) }}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && <div className="p-12 text-center text-sm text-gray-400">No quote requests found.</div>}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-serif font-light text-gray-900">{selected.name}</h2>
                  {selected.company && <p className="text-xs text-gray-500 mt-1">{selected.company}</p>}
                </div>
                <span className={`text-[10px] uppercase tracking-wider px-3 py-1 ${selected.status === 'new' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                  {selected.status}
                </span>
              </div>
              <hr className="border-gray-100" />
              {[
                { icon: Mail, label: 'Email', val: selected.email },
                { icon: Phone, label: 'Phone', val: selected.phone },
                ...(selected.company ? [{ icon: Building2, label: 'Company', val: selected.company }] : []),
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={14} className="text-rw-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-sans text-gray-400">{label}</p>
                    <p className="text-sm text-gray-700 mt-0.5">{val}</p>
                  </div>
                </div>
              ))}
              {selected.product_interest && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-sans text-gray-400 mb-2">Product Interested In</p>
                  <p className="text-sm text-gray-700">{selected.product_interest}</p>
                </div>
              )}
              {selected.message && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-sans text-gray-400 mb-2">Message</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 leading-relaxed">{selected.message}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <a href={`mailto:${selected.email}`} className="flex-1 bg-rw-black text-white py-2 text-xs font-sans hover:bg-rw-gold transition-colors text-center">
                  Reply by Email
                </a>
                <button onClick={() => deleteQuote(selected.id)} className="flex-1 border border-red-200 text-red-600 py-2 text-xs font-sans hover:bg-red-50 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-sm p-8 text-center text-sm text-gray-400">
              Select a quote request to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
