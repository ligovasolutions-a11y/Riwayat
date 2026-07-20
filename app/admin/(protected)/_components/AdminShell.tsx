'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Layers, Calendar, BookOpen,
  Home, Settings, Menu, X, ChevronRight, Bell, Search,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/homepage', icon: Home, label: 'Homepage' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/collections', icon: Layers, label: 'Collections' },
  { href: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { href: '/admin/journal', icon: BookOpen, label: 'Journal' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const closeSidebarToggle = () => {
    setSidebarOpen((v) => !v)
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-rw-black flex-shrink-0 flex flex-col transition-all duration-300 min-h-screen
          fixed inset-y-0 left-0 z-40 w-64 transform
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'lg:w-64' : 'lg:w-16'}`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          {(sidebarOpen || mobileOpen) && (
            <div>
              <div className="text-lg tracking-[0.3em] font-serif font-light text-white uppercase">Riwaayat</div>
              <div className="text-[8px] tracking-[0.4em] uppercase font-sans text-rw-gold">Admin Portal</div>
            </div>
          )}
          <button
            onClick={closeSidebarToggle}
            className="ml-auto text-white/50 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150 group ${
                  active ? 'bg-rw-gold text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon size={16} className="flex-shrink-0" />
                {(sidebarOpen || mobileOpen) && <span className="text-xs tracking-wide">{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-xs w-full"
          >
            <LogOut size={14} className="flex-shrink-0" />
            {(sidebarOpen || mobileOpen) && 'Log Out'}
          </button>
          <Link href="/" className="flex items-center gap-3 text-white/30 hover:text-white transition-colors text-xs">
            <ChevronRight size={14} />
            {(sidebarOpen || mobileOpen) && 'View Website'}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center gap-3 lg:gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-gray-600 flex-shrink-0"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 hidden sm:flex items-center gap-3 max-w-md">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products, orders, customers…"
              className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-rw-gold flex items-center justify-center text-white text-xs font-medium rounded-full flex-shrink-0">
                {email[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-gray-800">Admin</p>
                <p className="text-[10px] text-gray-400">{email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
