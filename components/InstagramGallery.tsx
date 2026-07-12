'use client'

import { Instagram } from 'lucide-react'

const galleryImages = [
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80&auto=format&fit=crop',
]

export default function InstagramGallery() {
  return (
    <section className="py-16 lg:py-24 px-6 lg:px-12">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-10">
          <a
            href="https://instagram.com/riwaayatjewels"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 hover:text-rw-gold transition-colors group"
          >
            <Instagram size={20} className="text-rw-gold" />
            <span className="text-sm tracking-[0.3em] uppercase font-sans text-rw-black group-hover:text-rw-gold">
              @riwaayatjewels
            </span>
          </a>
          <p className="text-rw-gray font-sans text-sm mt-2">Follow our story on Instagram</p>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-1 lg:gap-2">
          {galleryImages.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com/riwaayatjewels"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden block"
              style={{ aspectRatio: '1/1' }}
            >
              <img
                src={src}
                alt={`Instagram post ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
