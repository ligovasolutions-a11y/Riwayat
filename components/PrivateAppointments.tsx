'use client'

import Link from 'next/link'
import { Calendar, MapPin, Crown, Watch } from 'lucide-react'

const appointmentTypes = [
  { icon: MapPin, label: 'Boutique Visit', desc: 'Experience our showroom' },
  { icon: Crown, label: 'Bridal Consultation', desc: 'Dedicated wedding expert' },
  { icon: Watch, label: 'Watch Consultation', desc: 'With our horology team' },
  { icon: Calendar, label: 'Private Preview', desc: 'VIP exclusive experience' },
]

export default function PrivateAppointments() {
  return (
    <section className="py-20 lg:py-32 bg-rw-black relative overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover opacity-20"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920&q=60&auto=format&fit=crop)' }}
      />
      <div className="absolute inset-0 bg-rw-black/70" />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-12 text-center">
        <p className="section-label mb-6">By Appointment</p>
        <h2 className="luxury-heading text-4xl lg:text-6xl xl:text-7xl text-white leading-none mb-6">
          Experience Riwaayat<br /><em className="italic text-rw-gold">Privately</em>
        </h2>
        <p className="text-white/60 font-sans font-light text-base lg:text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
          We believe luxury deserves your full, undivided attention. Book a private consultation 
          and let our experts guide you through our collections at your own pace, in complete comfort.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto mb-12">
          {appointmentTypes.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="border border-white/20 hover:border-rw-gold p-6 lg:p-8 transition-all duration-300 group cursor-pointer"
            >
              <Icon size={24} className="text-rw-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-serif text-base font-light mb-1">{label}</h3>
              <p className="text-white/40 text-[10px] tracking-wider uppercase font-sans">{desc}</p>
            </div>
          ))}
        </div>

        <Link href="/appointments" className="btn-gold text-base px-12 py-4">
          Book a Private Consultation
        </Link>
      </div>
    </section>
  )
}
