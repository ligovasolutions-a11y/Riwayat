import Link from 'next/link'
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react'
import { getAllSettings } from '@/lib/db'

const footerLinks = {
  Jewellery: ['Bridal Collections', 'Diamond Jewellery', 'Gold Jewellery', 'Polki & Kundan', 'Earrings', 'Bangles & Bracelets', 'Pendants & Necklaces'],
  Watches: ['Rolex', 'Omega', 'TAG Heuer', 'Longines', 'IWC', 'Tissot', 'All Brands'],
  Services: ['Private Appointments', 'Bridal Consultation', 'Jewellery Repair', 'Diamond Certification', 'Watch Servicing', 'Gift Cards', 'Certificate Verification'],
  Company: ['Our Story', 'Journal', 'Careers', 'Press', 'Sustainability', 'Store Locator', 'Contact Us'],
}

export default function Footer() {
  const settings = getAllSettings()
  const phone = settings.phone || '+91 99999 88888'
  const email = settings.email || 'hello@riwaayatjewels.com'
  const address = settings.address || '123 Luxury Lane, Bandra West, Mumbai — 400050'
  const instagram = settings.instagram || 'riwaayatjewels'
  const facebook = settings.facebook || 'riwaayatjewels'
  const youtube = settings.youtube || '@riwaayatjewels'
  const [addressLine1, addressLine2] = address.split(',').length > 1
    ? [address.split(',').slice(0, -1).join(',').trim(), address.split(',').slice(-1)[0].trim()]
    : [address, '']

  return (
    <footer className="bg-rw-black text-white">
      {/* Top section */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 pt-20 pb-12">
        {/* Logo & tagline */}
        <div className="text-center mb-16 pb-16 border-b border-white/10">
          <img src="/logo-icon.png" alt="" className="h-14 lg:h-16 w-auto mx-auto mb-4" />
          <div className="text-xl sm:text-2xl lg:text-4xl tracking-[0.15em] sm:tracking-[0.25em] lg:tracking-[0.35em] font-serif font-light text-white mb-6 uppercase whitespace-nowrap px-4">
            Riwaayat Jewels
          </div>
          <p className="text-white/40 font-sans font-light text-sm max-w-md mx-auto">
            Where Heritage Meets Time — crafting timeless jewellery and curating exceptional timepieces since 1974.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8">
            <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-rw-gold transition-colors">
              <Instagram size={18} />
            </a>
            <a href={`https://facebook.com/${facebook}`} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-rw-gold transition-colors">
              <Facebook size={18} />
            </a>
            <a href={`https://youtube.com/${youtube}`} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-rw-gold transition-colors">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[10px] tracking-[0.4em] uppercase font-sans text-rw-gold mb-6">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-white/50 hover:text-white transition-colors text-xs font-sans tracking-wide"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16 border-b border-white/10">
          <div className="flex items-start gap-3">
            <MapPin size={14} className="text-rw-gold mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gold mb-1">Boutique</p>
              <p className="text-white/50 text-xs font-sans leading-relaxed">{addressLine1}{addressLine2 && <><br />{addressLine2}</>}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={14} className="text-rw-gold mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gold mb-1">Telephone</p>
              <p className="text-white/50 text-xs font-sans">{phone}</p>
              <p className="text-white/50 text-xs font-sans">+91 22 4000 5555</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={14} className="text-rw-gold mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-rw-gold mb-1">Email</p>
              <p className="text-white/50 text-xs font-sans">{email}</p>
              <p className="text-white/50 text-xs font-sans">appointments@riwaayatjewels.com</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-white/30 text-xs font-sans">
            © 2024 Riwaayat Jewels. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-white/30 hover:text-white/60 text-[10px] tracking-wider uppercase font-sans transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
