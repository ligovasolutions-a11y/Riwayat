'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    quote: "Riwaayat crafted our entire bridal jewellery set. Every piece was breathtaking — the craftsmanship, the weight, the finish. Our family couldn't stop complimenting us.",
    name: 'Priya Mehta',
    title: 'Bride, December 2023',
    location: 'Mumbai',
  },
  {
    quote: "I purchased a Rolex from Riwaayat three years ago. The experience was unlike any watch purchase I've had — truly private, informed, and absolutely no pressure. World-class service.",
    name: 'Arjun Kapoor',
    title: 'Watch Collector',
    location: 'Delhi',
  },
  {
    quote: "The diamond solitaire I bought for our anniversary was certified, fairly priced, and exactly what I wanted. Riwaayat has earned our trust for life.",
    name: 'Sanjay & Neha Patel',
    title: 'Loyal Customers since 2008',
    location: 'Pune',
  },
  {
    quote: "What sets Riwaayat apart is how they make you feel. You're not a customer — you're a guest. Their team is knowledgeable, patient, and genuinely passionate about jewellery.",
    name: 'Ritu Sharma',
    title: 'Brand Loyalist',
    location: 'Bangalore',
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)
  const t = testimonials[current]

  return (
    <section className="py-20 lg:py-32 px-6 lg:px-12 bg-rw-light">
      <div className="max-w-4xl mx-auto text-center">
        <p className="section-label mb-8">What Our Clients Say</p>

        <div className="relative min-h-[280px] flex flex-col items-center justify-center">
          <div key={current} className="transition-opacity duration-500">
            <div className="text-rw-gold text-6xl font-serif leading-none mb-6 select-none">"</div>
            <blockquote className="luxury-heading text-xl lg:text-2xl xl:text-3xl text-rw-black font-light italic leading-relaxed mb-8">
              {t.quote}
            </blockquote>
            <div>
              <p className="font-sans font-medium text-rw-black tracking-wider text-sm">{t.name}</p>
              <p className="font-sans text-rw-gray text-xs tracking-wider mt-1">{t.title} · {t.location}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-10">
          <button onClick={prev} className="border border-rw-border p-3 hover:border-rw-gold hover:text-rw-gold transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-px transition-all duration-300 ${i === current ? 'w-8 bg-rw-gold' : 'w-4 bg-rw-border'}`}
              />
            ))}
          </div>
          <button onClick={next} className="border border-rw-border p-3 hover:border-rw-gold hover:text-rw-gold transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
