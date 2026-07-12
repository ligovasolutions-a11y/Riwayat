'use client'

import { Package, Calendar, TrendingUp, Users, Eye, ShoppingBag, Star, ArrowUpRight } from 'lucide-react'

const stats = [
  { label: 'Total Products', value: '342', change: '+12 this month', icon: Package, color: 'bg-blue-50 text-blue-600' },
  { label: 'Appointments', value: '28', change: '8 pending today', icon: Calendar, color: 'bg-amber-50 text-amber-600' },
  { label: 'Page Views', value: '14.2K', change: '+18% this week', icon: Eye, color: 'bg-green-50 text-green-600' },
  { label: 'Enquiries', value: '64', change: '12 unread', icon: Users, color: 'bg-purple-50 text-purple-600' },
]

const recentAppointments = [
  { name: 'Priya Mehta', type: 'Bridal Consultation', date: 'Today, 3:00 PM', status: 'confirmed' },
  { name: 'Arjun Kapoor', type: 'Watch Viewing', date: 'Today, 5:00 PM', status: 'confirmed' },
  { name: 'Sanjay Patel', type: 'Jewellery Consultation', date: 'Tomorrow, 11:00 AM', status: 'pending' },
  { name: 'Ritu Sharma', type: 'Private VIP', date: 'Tomorrow, 2:00 PM', status: 'pending' },
  { name: 'Vikram Singh', type: 'Boutique Visit', date: 'Dec 15, 4:00 PM', status: 'confirmed' },
]

const recentEnquiries = [
  { product: 'Rolex Submariner', customer: 'A. Mehta', time: '2 hrs ago', status: 'new' },
  { product: 'Bridal Gold Set', customer: 'R. Iyer', time: '4 hrs ago', status: 'replied' },
  { product: 'Diamond Solitaire Ring', customer: 'P. Kumar', time: '6 hrs ago', status: 'new' },
  { product: 'Omega Seamaster', customer: 'V. Nair', time: '1 day ago', status: 'replied' },
]

export default function AdminDashboard() {
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
            <h2 className="font-sans font-medium text-gray-900 text-sm">Upcoming Appointments</h2>
            <a href="/admin/appointments" className="text-xs text-rw-gold hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentAppointments.map((apt) => (
              <div key={apt.name} className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-rw-light rounded-full flex items-center justify-center text-rw-gray text-xs font-medium flex-shrink-0">
                  {apt.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{apt.name}</p>
                  <p className="text-xs text-gray-500">{apt.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-600">{apt.date}</p>
                  <span className={`text-[10px] uppercase tracking-wider font-medium ${apt.status === 'confirmed' ? 'text-green-600' : 'text-amber-600'}`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiries */}
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-sans font-medium text-gray-900 text-sm">Recent Enquiries</h2>
            <a href="/admin/enquiries" className="text-xs text-rw-gold hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentEnquiries.map((enq, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: enq.status === 'new' ? '#C8A96A' : '#9CA3AF' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{enq.product}</p>
                  <p className="text-xs text-gray-500">{enq.customer}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">{enq.time}</p>
                  <span className={`text-[10px] uppercase tracking-wider ${enq.status === 'new' ? 'text-rw-gold font-medium' : 'text-gray-400'}`}>
                    {enq.status}
                  </span>
                </div>
              </div>
            ))}
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
