import Link from 'next/link';
import type { HeroBlock } from '@/lib/blockTypes';

// heading is sanitized server-side on save (only <em>/<strong>/<br> allowed)
// before ever reaching this dangerouslySetInnerHTML — see lib/sanitize.ts.
export default function Hero({ hero }: { hero: HeroBlock }) {
  return (
    <section className="hero">
      <div className="hero-pattern"></div>
      <div className="hero-content">
        <span className="eyebrow">{hero.eyebrow}</span>
        <h1 dangerouslySetInnerHTML={{ __html: hero.heading }} />
        <p>{hero.description}</p>
        <div className="hero-actions">
          <Link href={hero.primaryBtnHref} className="btn btn-gold">{hero.primaryBtnText}</Link>
          <Link href={hero.secondaryBtnHref} className="btn">{hero.secondaryBtnText}</Link>
        </div>
      </div>
      <div className="hero-dots">
        <button className="active" aria-hidden="true"></button>
        <button aria-hidden="true"></button>
        <button aria-hidden="true"></button>
      </div>
    </section>
  );
}
