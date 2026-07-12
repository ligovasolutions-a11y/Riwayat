'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'

const mockPosts = [
  { id: 1, title: 'The Ultimate Guide to Buying Your First Rolex', category: 'Watch Guide', date: 'June 2024', status: 'published', views: 1240 },
  { id: 2, title: 'How to Choose Your Wedding Jewellery Set', category: 'Bridal', date: 'May 2024', status: 'published', views: 890 },
  { id: 3, title: 'Understanding the 4Cs of Diamond Quality', category: 'Diamond Education', date: 'April 2024', status: 'published', views: 2100 },
  { id: 4, title: 'Polki vs Kundan: What\'s the Difference?', category: 'Jewellery Guide', date: 'March 2024', status: 'published', views: 670 },
  { id: 5, title: 'Spring/Summer Jewellery Trends 2025', category: 'Luxury Lifestyle', date: 'Draft', status: 'draft', views: 0 },
]

export default function JournalAdmin() {
  const [posts, setPosts] = useState(mockPosts)
  const [showNew, setShowNew] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', category: 'Watch Guide', content: '' })

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-gray-900">Journal</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.filter(p => p.status === 'published').length} published articles</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 bg-rw-black text-white px-5 py-2.5 text-xs font-sans hover:bg-rw-gold transition-colors">
          <Plus size={14} /> New Article
        </button>
      </div>

      {showNew && (
        <div className="bg-white border border-rw-gold rounded-sm p-6 mb-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-900">New Article</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Title</label>
              <input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors"
                placeholder="Article title…" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Category</label>
              <select value={newPost.category} onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors bg-white">
                {['Watch Guide', 'Jewellery Guide', 'Bridal', 'Diamond Education', 'Luxury Lifestyle', 'Care Tips'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Content</label>
            <textarea value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={6} placeholder="Write your article here…"
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => {
              if (newPost.title) {
                setPosts([{ id: Date.now(), ...newPost, date: 'Draft', status: 'draft', views: 0 }, ...posts])
                setNewPost({ title: '', category: 'Watch Guide', content: '' })
                setShowNew(false)
              }
            }} className="px-5 py-2 bg-rw-black text-white text-xs hover:bg-rw-gold transition-colors">
              Save as Draft
            </button>
            <button onClick={() => setShowNew(false)} className="px-5 py-2 border border-gray-200 text-xs text-gray-600 hover:border-rw-gold transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
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
                <td className="px-5 py-4 text-xs text-gray-500">{p.date}</td>
                <td className="px-5 py-4 text-xs text-gray-500">{p.views.toLocaleString()}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${p.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-rw-gold transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => setPosts(posts.filter(x => x.id !== p.id))} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
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
