'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import type { JournalPost } from '@/lib/content'

export default function JournalAdmin() {
  const [posts, setPosts] = useState<JournalPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/journal')
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const deletePost = async (id: number) => {
    if (!confirm('Delete this article?')) return
    setPosts((p) => p.filter((x) => x.id !== id))
    await fetch(`/api/journal/${id}`, { method: 'DELETE' })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-gray-900">Journal</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.filter(p => p.status === 'published').length} published articles</p>
        </div>
        <Link href="/admin/journal/new" className="flex items-center gap-2 bg-rw-black text-white px-5 py-2.5 text-xs font-sans hover:bg-rw-gold transition-colors">
          <Plus size={14} /> New Article
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Article', 'Category', 'Date', 'Views', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{p.title}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">{p.category}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">{p.published_date || 'Draft'}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">{p.views.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${p.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {p.status === 'published' && (
                        <a href={`/journal/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"><Eye size={14} /></a>
                      )}
                      <Link href={`/admin/journal/${p.id}/edit`} className="p-1.5 text-gray-400 hover:text-rw-gold transition-colors"><Edit2 size={14} /></Link>
                      <button onClick={() => deletePost(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && posts.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">No articles found.</div>
        )}
      </div>
    </div>
  )
}
