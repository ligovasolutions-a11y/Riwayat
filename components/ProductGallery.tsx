'use client'

import { useState } from 'react'

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="bg-rw-light flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
        <span className="text-rw-gray text-xs font-sans uppercase tracking-wider">No Image</span>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-hidden bg-rw-light mb-4" style={{ aspectRatio: '1/1' }}>
        <img src={images[active]} alt={name} className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`overflow-hidden border transition-colors ${i === active ? 'border-rw-gold' : 'border-transparent hover:border-rw-border'}`}
              style={{ aspectRatio: '1/1' }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
