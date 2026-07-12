'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react'

const mockCollections = [
  { id: 1, name: 'Bridal Couture', category: 'Jewellery', products: 120, status: 'active', tag: 'New Season' },
  { id: 2, name: 'Swiss Timepieces', category: 'Watches', products: 85, status: 'active', tag: 'Authorised Dealer' },
  { id: 3, name: 'Diamond Atelier', category: 'Jewellery', products: 60, status: 'active', tag: 'Exclusive' },
  { id: 4, name: 'Heritage Gold', category: 'Jewellery', products: 200, status: 'active', tag: 'Bestseller' },
  { id: 5, name: 'Polki & Kundan', category: 'Jewellery', products: 45, status: 'active', tag: '' },
  { id: 6, name: 'Summer Edit 2025', category: 'Jewellery', products: 0, status: 'draft', tag: 'Coming Soon' },
]

export default function CollectionsAdmin() {
  const [collections, setCollections] = useState(mockCollections)
  const [showNew, setShowNew] = useState(false)
  const [newCol, setNewCol] = useState({ name: '', category: 'Jewellery', tag: '' })

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-gray-900">Collections</h1>
          <p className="text-sm text-gray-500 mt-1">{collections.length} collections</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 bg-rw-black text-white px-5 py-2.5 text-xs font-sans hover:bg-rw-gold transition-colors">
          <Plus size={14} /> New Collection
        </button>
      </div>

      {showNew && (
        <div className="bg-white border border-rw-gold p-6 mb-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-900">Create Collection</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Collection Name</label>
              <input value={newCol.name} onChange={(e) => setNewCol({ ...newCol, name: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold" placeholder="e.g., Summer Edit" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Category</label>
              <select value={newCol.category} onChange={(e) => setNewCol({ ...newCol, category: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold bg-white">
                <option>Jewellery</option><option>Watches</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Badge Tag</label>
              <input value={newCol.tag} onChange={(e) => setNewCol({ ...newCol, tag: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold" placeholder="New Season, Exclusive…" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => {
              if (newCol.name) {
                setCollections([...collections, { id: Date.now(), ...newCol, products: 0, status: 'draft' }])
                setNewCol({ name: '', category: 'Jewellery', tag: '' })
                setShowNew(false)
              }
            }} className="px-5 py-2 bg-rw-black text-white text-xs hover:bg-rw-gold transition-colors">Create</button>
            <button onClick={() => setShowNew(false)} className="px-5 py-2 border border-gray-200 text-xs text-gray-600">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
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
                <td className="px-5 py-4 text-xs text-gray-500">{c.products} items</td>
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
                    <button className="p-1.5 text-gray-400 hover:text-rw-gold transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => setCollections(collections.filter(x => x.id !== c.id))} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
