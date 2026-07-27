'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Heart, User, Menu, X, ChevronDown } from 'lucide-react'

const baseNavLinks = [
  { label: 'Jewellery', href: '/jewellery', sub: [] as string[] },
  { label: 'Watches', href: '/watches', sub: ['Rolex', 'Omega', 'TAG Heuer', 'Longines', 'Tissot', 'IWC'] },
  { label: 'Collections', href: '/collections', sub: ['New Arrivals', 'Bestsellers', 'Limited Edition', 'Gift Sets'] },
  { label: 'Journal', href: '/journal', sub: [] },
  { label: 'Appointments', href: '/appointments', sub: [] },
  { label: 'Get a Quote', href: '/get-a-quote', sub: [] },
  { label: 'About', href: '/about', sub: [] },
]
const LEFT_NAV_COUNT = 3

export default function NavigationClient({ announcement, jewelleryCategories }: { announcement: string; jewelleryCategories: string[] }) {
  const navLinks = baseNavLinks.map((link) =>
    link.label === 'Jewellery' ? { ...link, sub: jewelleryCategories } : link
  )
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const announcementParts = announcement.split('|').map((s) => s.trim()).filter(Boolean)

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-rw-black text-white text-center py-2 text-xs tracking-widest font-sans uppercase">
        {announcementParts.map((part, i) => (
          <span key={i}>
            {i > 0 && '  |  '}
            {part}
          </span>
        ))}
      </div>

      <nav
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-white shadow-sm border-b border-rw-border' : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        {/* Main nav */}
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left nav */}
            <div className="hidden xl:flex items-center gap-8 flex-1">
              {navLinks.slice(0, LEFT_NAV_COUNT).map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-xs tracking-widest uppercase font-sans font-medium text-rw-black hover:text-rw-gold transition-colors duration-200"
                  >
                    {link.label}
                    {link.sub.length > 0 && <ChevronDown size={10} className="mt-0.5" />}
                  </Link>
                  {link.sub.length > 0 && activeDropdown === link.label && (
                    // The pt-2 wrapper (instead of a margin gap) keeps the hoverable
                    // area contiguous from the trigger down into the panel, so moving
                    // the cursor diagonally into the submenu doesn't hit a dead zone
                    // that closes the dropdown before it's reached.
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div className="bg-white border border-rw-border shadow-xl min-w-[200px] py-4">
                        {link.sub.map((s) => (
                          <Link
                            key={s}
                            href={`${link.href}/${s.toLowerCase().replace(' ', '-')}`}
                            className="block px-6 py-2 text-xs tracking-wider uppercase font-sans text-rw-gray hover:text-rw-gold hover:bg-rw-light transition-colors duration-150"
                          >
                            {s}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Center logo */}
            <div className="flex-1 flex justify-center">
              <Link href="/" className="text-center group flex flex-col items-center">
                <img src="/logo-icon.png" alt="" className="h-8 lg:h-9 w-auto mb-1 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="text-base lg:text-xl tracking-[0.2em] lg:tracking-[0.25em] font-serif font-light text-rw-black group-hover:text-rw-gold transition-colors duration-300 uppercase whitespace-nowrap">
                  Riwaayat Jewels
                </div>
              </Link>
            </div>

            {/* Right nav */}
            <div className="hidden xl:flex items-center gap-8 flex-1 justify-end">
              {navLinks.slice(LEFT_NAV_COUNT).map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs tracking-widest uppercase font-sans font-medium text-rw-black hover:text-rw-gold transition-colors duration-200 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 ml-4 border-l border-rw-border pl-4">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-rw-black hover:text-rw-gold transition-colors duration-200"
                >
                  <Search size={16} />
                </button>
                <Link href="/wishlist" className="text-rw-black hover:text-rw-gold transition-colors duration-200">
                  <Heart size={16} />
                </Link>
                <Link href="/admin" title="Admin Login" className="text-rw-black hover:text-rw-gold transition-colors duration-200">
                  <User size={16} />
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="xl:hidden text-rw-black p-2 -m-2"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-white z-[100] flex flex-col xl:hidden">
            <div className="flex items-center justify-between p-6 border-b border-rw-border">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                <img src="/logo-icon.png" alt="" className="h-9 w-auto" />
                <div className="text-lg tracking-[0.2em] font-serif font-light text-rw-black uppercase whitespace-nowrap">Riwaayat Jewels</div>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 -m-2">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {navLinks.map((link) => (
                <div key={link.label} className="border-b border-rw-border py-4">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg tracking-[0.2em] uppercase font-serif font-light text-rw-black hover:text-rw-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                  {link.sub.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {link.sub.map((s) => (
                        <Link
                          key={s}
                          href={`${link.href}/${s.toLowerCase().replace(' ', '-')}`}
                          onClick={() => setMobileOpen(false)}
                          className="text-xs tracking-wider uppercase text-rw-gray hover:text-rw-gold transition-colors"
                        >
                          {s}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-rw-border flex gap-6 justify-center">
              <button onClick={() => { setSearchOpen(true); setMobileOpen(false) }} className="p-2 -m-2">
                <Search size={20} className="text-rw-black" />
              </button>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="p-2 -m-2">
                <Heart size={20} className="text-rw-black" />
              </Link>
              <Link href="/admin" title="Admin Login" onClick={() => setMobileOpen(false)} className="p-2 -m-2">
                <User size={20} className="text-rw-black" />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Full-screen Search */}
      {searchOpen && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col">
          <div className="flex items-center justify-between p-6 lg:p-12 border-b border-rw-border">
            <span className="text-xs tracking-[0.3em] uppercase font-sans text-rw-gold">Search</span>
            <button onClick={() => setSearchOpen(false)} className="p-2 -m-2">
              <X size={24} className="text-rw-black" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-6 lg:px-24">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewellery, watches, brands…"
              className="w-full max-w-3xl text-3xl lg:text-5xl font-serif font-light border-0 border-b-2 border-rw-black outline-none pb-4 bg-transparent placeholder-rw-border text-rw-black"
            />
            <div className="mt-12 flex flex-wrap gap-3 max-w-3xl">
              {['Diamond Rings', 'Rolex Watches', 'Bridal Sets', 'Gold Bangles', 'Swiss Watches'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSearchQuery(s)}
                  className="px-5 py-2 border border-rw-border text-xs tracking-wider uppercase font-sans text-rw-gray hover:border-rw-gold hover:text-rw-gold transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
