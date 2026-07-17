import Link from 'next/link';
import type { FooterBlock, NavBlock } from '@/lib/blockTypes';

const SOCIAL_ICONS: Record<string, JSX.Element> = {
  Instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg>,
  Facebook: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 8h2V5h-2a4 4 0 0 0-4 4v2H9v3h2v6h3v-6h2.2l.8-3H14V9a1 1 0 0 1 1-1z" /></svg>,
  Pinterest: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M9 18c1-3 1.5-5 1.5-5m0 0C10 11 11 8.5 13.2 8.5c2 0 3 1.3 3 3 0 2.2-1.2 4.5-3.4 4.5-1 0-1.6-.5-1.8-1" /></svg>,
  WhatsApp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 20l1.2-3.6A7.9 7.9 0 1 1 8.6 19L4 20z" /></svg>,
};

export default function SiteFooter({ footer, nav }: { footer: FooterBlock; nav: NavBlock }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link href="/" className="logo" style={{ textAlign: 'left' }}>
              {nav.logoLine1} <span>{nav.logoLine2}</span>
            </Link>
            <p>{footer.aboutText}</p>
            <div className="social-row">
              {footer.social.map((s, i) => (
                <a key={i} href={s.href} aria-label={s.platform}>{SOCIAL_ICONS[s.platform] || SOCIAL_ICONS.Instagram}</a>
              ))}
            </div>
          </div>
          {footer.columns.map((col, i) => (
            <div key={i}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l, j) => <li key={j}><Link href={l.href}>{l.label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div>{footer.copyright}</div>
          <div className="payment-icons">
            {footer.payments.map((p, i) => <span key={i}>{p}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
