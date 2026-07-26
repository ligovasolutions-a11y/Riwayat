'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import type { HeroSlide } from '@/lib/homepage'

type HeroButtons = { btn1: string; btn2: string; btn3: string }

export default function HeroClient({ slides, buttons }: { slides: HeroSlide[]; buttons: HeroButtons }) {
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setLoaded(true)
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [slides.length])

  if (slides.length === 0) return null
  const slide = slides[current]

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background images */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-24">
        <div
          key={current}
          className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-rw-gold text-xs tracking-[0.4em] uppercase font-sans mb-6 lg:mb-8">
            {slide.label}
          </p>
          <h1 className="font-serif font-light text-white text-5xl sm:text-7xl lg:text-8xl xl:text-9xl leading-none mb-4 lg:mb-6">
            {slide.headline}
            <br />
            <em className="italic">{slide.headline2}</em>
          </h1>
          <p className="text-white/75 text-sm lg:text-base font-sans font-light tracking-wide max-w-lg mx-auto mt-6 mb-10 lg:mb-14">
            {slide.sub}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/jewellery" className="btn-gold min-w-[200px] text-center">
              {buttons.btn1}
            </Link>
            <Link href="/watches" className="btn-outline-gold min-w-[200px] text-center border-white text-white hover:bg-white hover:text-rw-black">
              {buttons.btn2}
            </Link>
            <Link href="/appointments" className="btn-outline-gold min-w-[200px] text-center border-white text-white hover:bg-white hover:text-rw-black">
              {buttons.btn3}
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-px transition-all duration-500 ${i === current ? 'w-12 bg-rw-gold' : 'w-6 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase font-sans">Scroll</span>
        <ChevronDown size={16} className="text-white/60" />
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-20 right-8 z-10 text-white/50 text-xs font-sans tracking-widest">
        0{current + 1} / 0{slides.length}
      </div>
    </section>
  )
}
