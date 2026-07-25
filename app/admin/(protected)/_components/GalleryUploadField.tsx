'use client'

import { useRef, useState } from 'react'
import { X, Loader2, Plus } from 'lucide-react'

export default function GalleryUploadField({
  label,
  images,
  onChange,
}: {
  label: string
  images: string[]
  onChange: (images: string[]) => void
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
      onChange([...images, data.url])
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeAt = (i: number) => onChange(images.filter((_, idx) => idx !== i))

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
      <div className="grid grid-cols-4 gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative group aspect-square">
            <img src={url} alt="" className="w-full h-full object-cover border border-gray-200" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 bg-white text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-square border-2 border-dashed border-gray-200 flex flex-col items-center justify-center hover:border-rw-gold transition-colors"
        >
          {uploading ? <Loader2 size={16} className="animate-spin text-gray-400" /> : <Plus size={18} className="text-gray-300" />}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">Add extra photos for the gallery on the product page.</p>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}
