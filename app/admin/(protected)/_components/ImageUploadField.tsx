'use client'

import { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

export default function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    setError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Upload failed.')
        return
      }
      onChange(data.url)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {label && <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">{label}</label>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
      {value ? (
        <div className="relative group">
          <img src={value} alt="" className="w-full aspect-video object-cover border border-gray-200" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-gray-800 text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <Upload size={12} /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-white text-red-600 text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <X size={12} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-gray-200 rounded p-8 text-center hover:border-rw-gold transition-colors cursor-pointer flex flex-col items-center gap-2"
        >
          {uploading ? <Loader2 size={18} className="animate-spin text-gray-400" /> : <Upload size={18} className="text-gray-300" />}
          <p className="text-sm text-gray-500">{uploading ? 'Uploading…' : 'Click to upload image'}</p>
          <p className="text-xs text-gray-400">JPEG, PNG, WebP or GIF, up to 8MB</p>
        </button>
      )}
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}
