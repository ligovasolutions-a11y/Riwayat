'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  {
    label: 'Overview', items: [
      { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    ],
  },
  {
    label: 'Pages', items: [
      { href: '/admin/pages/home', label: 'Home' },
      { href: '/admin/pages/shop', label: 'Shop' },
      { href: '/admin/pages/about', label: 'Our Story' },
      { href: '/admin/pages/contact', label: 'Contact' },
    ],
  },
  {
    label: 'Site-Wide', items: [
      { href: '/admin/nav', label: 'Navigation' },
      { href: '/admin/footer', label: 'Footer' },
      { href: '/admin/contact-info', label: 'Contact Info' },
    ],
  },
  {
    label: 'Catalog', items: [
      { href: '/admin/products', label: 'Products' },
      { href: '/admin/media', label: 'Media Library' },
    ],
  },
  {
    label: 'Content', items: [
      { href: '/admin/blog', label: 'Blog' },
      { href: '/admin/enquiries', label: 'Enquiries' },
    ],
  },
  {
    label: 'Settings', items: [
      { href: '/admin/seo', label: 'SEO' },
      { href: '/admin/settings', label: 'Site Settings' },
      { href: '/admin/security', label: 'Security & Logs' },
    ],
  },
];

function NavIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="10" r="3" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className="a-sidebar">
      <div className="a-sidebar-brand">Riwayat <span>Jewels</span></div>
      {NAV.map((group) => (
        <div className="a-nav-group" key={group.label}>
          <div className="a-nav-label">{group.label}</div>
          {group.items.map((item) => (
            <Link key={item.href} href={item.href} className={`a-nav-link${pathname === item.href ? ' active' : ''}`}>
              <NavIcon />
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
