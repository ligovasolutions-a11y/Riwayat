import { Package, Calendar, Eye, MessageSquare, ArrowUpRight } from 'lucide-react'
import { listProducts, listAppointments, listQuotes } from '@/lib/content'

export default function AdminDashboard() {
  const products = listProducts()
  const appointments = listAppointments()
  const quotes = listQuotes()
  const pendingCount = appointments.filter((a) => a.status === 'pending').length
  const newQuoteCount = quotes.filter((q) => q.status === 'new').length
  const recentAppointments = appointments.slice(0, 5)
  const recentQuotes = quotes.slice(0, 5)

  const stats = [
    { label: 'Total Products', value: String(products.length), change: `${products.filter(p => p.status === 'active').length} published`, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Appointments', value: String(appointments.length), change: `${pendingCount} pending`, icon: Calendar, color: 'bg-amber-50 text-amber-600' },
    { label: 'Page Views', value: '14.2K', change: '+18% this week', icon: Eye, color: 'bg-green-50 text-green-600' },
    { label: 'Quotes', value: String(quotes.length), change: `${newQuoteCount} new`, icon: MessageSquare, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-light text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Here's what's happening at Riwaayat today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-sm border border-gray-200 p-6">
            <div className={`w-10 h-10 rounded-sm flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <p className="text-2xl font-serif font-light text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-xs text-rw-gold mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments */}
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-sans font-medium text-gray-900 text-sm">Recent Appointments</h2>
            <a href="/admin/appointments" className="text-xs text-rw-gold hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentAppointments.map((apt) => (
              <div key={apt.id} className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-rw-light rounded-full flex items-center justify-center text-rw-gray text-xs font-medium flex-shrink-0">
                  {apt.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{apt.name}</p>
                  <p className="text-xs text-gray-500">{apt.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-600">{apt.date}</p>
                  <span className={`text-[10px] uppercase tracking-wider font-medium ${apt.status === 'confirmed' ? 'text-green-600' : apt.status === 'cancelled' ? 'text-red-500' : 'text-amber-600'}`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
            {recentAppointments.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-400">No appointments yet.</div>
            )}
          </div>
        </div>

        {/* Quotes */}
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-sans font-medium text-gray-900 text-sm">Recent Quotes</h2>
            <a href="/admin/quotes" className="text-xs text-rw-gold hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentQuotes.map((q) => (
              <div key={q.id} className="p-4 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: q.status === 'new' ? '#C8A96A' : '#9CA3AF' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{q.product_interest || 'General enquiry'}</p>
                  <p className="text-xs text-gray-500">{q.name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-[10px] uppercase tracking-wider ${q.status === 'new' ? 'text-rw-gold font-medium' : 'text-gray-400'}`}>
                    {q.status}
                  </span>
                </div>
              </div>
            ))}
            {recentQuotes.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-400">No quote requests yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-gray-200 rounded-sm p-6">
        <h2 className="font-sans font-medium text-gray-900 text-sm mb-5">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Add Product', href: '/admin/products/new' },
            { label: 'Add Collection', href: '/admin/collections/new' },
            { label: 'Edit Homepage', href: '/admin/homepage' },
            { label: 'New Journal Post', href: '/admin/journal/new' },
            { label: 'View Appointments', href: '/admin/appointments' },
            { label: 'View Quotes', href: '/admin/quotes' },
            { label: 'Manage Settings', href: '/admin/settings' },
          ].map((a) => (
            <a
              key={a.label}
              href={a.href}
              className="px-4 py-2 border border-gray-200 text-xs font-sans text-gray-700 hover:border-rw-gold hover:text-rw-gold transition-colors tracking-wide"
            >
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
