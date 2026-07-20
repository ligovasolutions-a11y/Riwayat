'use client'

import { useEffect, useState } from 'react'
import { Check, X, Clock, Phone } from 'lucide-react'
import type { Appointment } from '@/lib/content'

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-50 text-green-700',
  pending: 'bg-amber-50 text-amber-700',
  cancelled: 'bg-red-50 text-red-700',
}

export default function AppointmentsAdmin() {
  const [filter, setFilter] = useState('all')
  const [list, setList] = useState<Appointment[]>([])
  const [selected, setSelected] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/appointments')
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? list : list.filter(a => a.status === filter)

  const updateStatus = async (id: number, status: string) => {
    setList(l => l.map(a => a.id === id ? { ...a, status } : a))
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null)
    await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">{list.filter(a => a.status === 'pending').length} pending confirmation</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'cancelled'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-sans capitalize transition-colors ${filter === f ? 'bg-rw-black text-white' : 'border border-gray-200 text-gray-600 hover:border-rw-gold'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-sm divide-y divide-gray-50">
          {filtered.map((apt) => (
            <div key={apt.id} onClick={() => setSelected(apt)}
              className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === apt.id ? 'bg-amber-50 border-l-2 border-rw-gold' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-medium text-gray-900">{apt.name}</p>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${statusColors[apt.status] || 'bg-gray-100 text-gray-500'}`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs text-rw-gold tracking-wide">{apt.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{apt.date} at {apt.time}</p>
                </div>
                <div className="flex gap-2">
                  {apt.status === 'pending' && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(apt.id, 'confirmed') }}
                        className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Confirm">
                        <Check size={14} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(apt.id, 'cancelled') }}
                        className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Cancel">
                        <X size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && <div className="p-12 text-center text-sm text-gray-400">No appointments found.</div>}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-serif font-light text-gray-900">{selected.name}</h2>
                  <p className="text-xs text-rw-gold tracking-wider mt-1">{selected.type}</p>
                </div>
                <span className={`text-[10px] uppercase tracking-wider px-3 py-1 ${statusColors[selected.status] || 'bg-gray-100 text-gray-500'}`}>
                  {selected.status}
                </span>
              </div>
              <hr className="border-gray-100" />
              {[
                { icon: Clock, label: 'Date & Time', val: `${selected.date} at ${selected.time}` },
                { icon: Phone, label: 'Phone', val: selected.phone },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={14} className="text-rw-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-sans text-gray-400">{label}</p>
                    <p className="text-sm text-gray-700 mt-0.5">{val}</p>
                  </div>
                </div>
              ))}
              {selected.message && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-sans text-gray-400 mb-2">Customer Message</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 leading-relaxed">{selected.message}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                {selected.status !== 'confirmed' && (
                  <button onClick={() => updateStatus(selected.id, 'confirmed')}
                    className="flex-1 bg-rw-black text-white py-2 text-xs font-sans hover:bg-rw-gold transition-colors">
                    Confirm
                  </button>
                )}
                {selected.status !== 'cancelled' && (
                  <button onClick={() => updateStatus(selected.id, 'cancelled')}
                    className="flex-1 border border-red-200 text-red-600 py-2 text-xs font-sans hover:bg-red-50 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-sm p-8 text-center text-sm text-gray-400">
              Select an appointment to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
