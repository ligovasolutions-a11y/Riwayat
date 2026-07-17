'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import type { NavBlock } from '@/lib/blockTypes';

export default function SiteChrome({ nav, logoImage }: { nav: NavBlock; logoImage?: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <div className={`overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        <div className="mobile-nav-close" onClick={() => setMenuOpen(false)}>Close ✕</div>
        {nav.items.map((item, i) => (
          <Link key={i} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
        ))}
      </nav>

      <div className="topbar">
        <div className="container">
          <div className="topbar-links">
            {nav.topbarLeft.map((l, i) => <Link key={i} href={l.href}>{l.label}</Link>)}
          </div>
          <div>{nav.announcement}</div>
          <div className="topbar-links">
            {nav.topbarRight.map((l, i) => <Link key={i} href={l.href}>{l.label}</Link>)}
          </div>
        </div>
      </div>

      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="header-inner container">
          <button className="nav-toggle" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <span></span><span></span><span></span>
          </button>

          <Link href="/" className="logo">
            {logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/uploads/${logoImage}`} alt={`${nav.logoLine1} ${nav.logoLine2}`} style={{ maxHeight: 42 }} />
            ) : (
              <>{nav.logoLine1} <span>{nav.logoLine2}</span></>
            )}
            <small>{nav.tagline}</small>
          </Link>

          <nav className="main-nav">
            {nav.items.map((item, i) => <Link key={i} href={item.href}>{item.label}</Link>)}
          </nav>

          <div className="header-actions">
            <button className="icon-btn hide-mobile" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </button>
            <button className="icon-btn hide-mobile" aria-label="Account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" /></svg>
            </button>
            <button className="icon-btn hide-mobile" aria-label="Wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-4.6-9.5-8.8C.6 8.4 2 5 5.4 4.4 7.7 4 9.9 5.2 12 7.5c2.1-2.3 4.3-3.5 6.6-3.1C22 5 23.4 8.4 21.5 12.2 19 16.4 12 21 12 21z" /></svg>
            </button>
            <Link href="/shop" className="icon-btn" aria-label="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
              <span className="cart-count">{count}</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
