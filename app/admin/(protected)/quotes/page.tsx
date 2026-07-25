'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, Building2, Trash2, Eye } from 'lucide-react'
import type { Quote } from '@/lib/content'

function formatDate(value: string) {
  const d = new Date(value.replace(' ', 'T'))
  if (isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

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

  const requirementChips = (q: Quote) => [
    q.colour && `Colour: ${q.colour}`,
    q.cut && `Cut: ${q.cut}`,
    q.clarity && `Clarity: ${q.clarity}`,
    q.carat_weight && `Carat/Weight: ${q.carat_weight}`,
  ].filter(Boolean) as string[]

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

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Table */}
        <div className="xl:col-span-3 bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Name', 'Contact', 'Product Interested', 'Submitted', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((q) => (
                  <tr
                    key={q.id}
                    onClick={() => openQuote(q)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === q.id ? 'bg-amber-50' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">{q.name}</p>
                      {q.company && <p className="text-xs text-gray-400">{q.company}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-600">{q.email}</p>
                      <p className="text-xs text-gray-400">{q.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600 max-w-[160px] truncate">{q.product_interest || 'General enquiry'}</td>
                    <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{formatDate(q.created_at)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${q.status === 'new' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); openQuote(q) }} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="View">
                          <Eye size={14} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteQuote(q.id) }} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-400">No quote requests found.</div>
          )}
        </div>

        {/* Detail */}
        <div className="xl:col-span-2">
          {selected ? (
            <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-serif font-light text-gray-900">{selected.name}</h2>
                  {selected.company && <p className="text-xs text-gray-500 mt-1">{selected.company}</p>}
                  <p className="text-xs text-gray-400 mt-1">Submitted {formatDate(selected.created_at)}</p>
                </div>
                <span className={`text-[10px] uppercase tracking-wider px-3 py-1 flex-shrink-0 ${selected.status === 'new' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
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
              {requirementChips(selected).length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-sans text-gray-400 mb-2">Requirements</p>
                  <div className="flex flex-wrap gap-2">
                    {requirementChips(selected).map((chip) => (
                      <span key={chip} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5">{chip}</span>
                    ))}
                  </div>
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
              Select a quote request to view full details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
