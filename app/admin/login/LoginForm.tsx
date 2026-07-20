'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed.')
        setLoading(false)
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 space-y-5">
      <div>
        <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-white/50 block mb-2">Email</label>
        <div className="flex items-center gap-2 border border-white/15 px-4 py-3 focus-within:border-rw-gold transition-colors">
          <Mail size={14} className="text-white/40 flex-shrink-0" />
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder-white/30"
            placeholder="admin@riwaayatjewels.com"
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-white/50 block mb-2">Password</label>
        <div className="flex items-center gap-2 border border-white/15 px-4 py-3 focus-within:border-rw-gold transition-colors">
          <Lock size={14} className="text-white/40 flex-shrink-0" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder-white/30"
            placeholder="••••••••"
          />
        </div>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-rw-gold text-white py-3 text-xs tracking-[0.2em] uppercase font-sans hover:bg-rw-gold-dark transition-colors disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}
