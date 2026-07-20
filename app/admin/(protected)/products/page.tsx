'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import type { Product } from '@/lib/content'

export default function ProductsAdmin() {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'All' || p.category === filterCat
    return matchSearch && matchCat
  })

  const deleteProduct = async (id: number) => {
    if (!confirm('Delete this product?')) return
    setProducts((p) => p.filter((x) => x.id !== id))
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <a href="/admin/products/new" className="flex items-center gap-2 bg-rw-black text-white px-5 py-2.5 text-xs font-sans hover:bg-rw-gold transition-colors">
          <Plus size={14} /> Add Product
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="flex-1 text-sm text-gray-700 outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Jewellery', 'Watches'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-4 py-1.5 text-xs font-sans transition-colors ${filterCat === cat ? 'bg-rw-black text-white' : 'border border-gray-200 text-gray-600 hover:border-rw-gold'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Product', 'Category', 'Price', 'Availability', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.subcategory}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.category}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{p.price}</td>
                  <td className="px-5 py-4 text-xs text-gray-600">{p.stock}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-medium ${
                      p.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${p.id}/edit`} className="p-1.5 text-gray-400 hover:text-rw-gold transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </Link>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
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
          <div className="text-center py-12 text-sm text-gray-400">No products found.</div>
        )}
      </div>
    </div>
  )
}
