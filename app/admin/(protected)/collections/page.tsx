'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react'
import type { Collection } from '@/lib/content'

export default function CollectionsAdmin() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/collections')
      .then((r) => r.json())
      .then((data) => setCollections(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const deleteCollection = async (id: number) => {
    if (!confirm('Delete this collection?')) return
    setCollections((c) => c.filter((x) => x.id !== id))
    await fetch(`/api/collections/${id}`, { method: 'DELETE' })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-gray-900">Collections</h1>
          <p className="text-sm text-gray-500 mt-1">{collections.length} collections</p>
        </div>
        <Link href="/admin/collections/new" className="flex items-center gap-2 bg-rw-black text-white px-5 py-2.5 text-xs font-sans hover:bg-rw-gold transition-colors">
          <Plus size={14} /> New Collection
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['', 'Collection', 'Category', 'Products', 'Badge', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {collections.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4"><GripVertical size={14} className="text-gray-300 cursor-grab" /></td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">{c.category}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">{c.products_count} items</td>
                  <td className="px-5 py-4">
                    {c.tag && <span className="text-[10px] px-2 py-1 bg-amber-50 text-amber-700">{c.tag}</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${c.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/collections/${c.id}/edit`} className="p-1.5 text-gray-400 hover:text-rw-gold transition-colors"><Edit2 size={14} /></Link>
                      <button onClick={() => deleteCollection(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && collections.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">No collections found.</div>
        )}
      </div>
    </div>
  )
}
