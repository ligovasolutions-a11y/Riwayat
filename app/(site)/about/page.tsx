import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getPublishedBlock } from '@/lib/content';
import { IconGlyph } from '@/lib/icons';
import type { HeroStoryBlock, ValuesBlock, AtelierBlock } from '@/lib/blockTypes';
import { DEFAULT_HERO_STORY, DEFAULT_VALUES, DEFAULT_ATELIER } from '@/lib/blockDefaults';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await prisma.seoMeta.findUnique({ where: { page: 'about' } });
  if (!seo) return {};
  return { title: seo.title, description: seo.description, keywords: seo.keywords };
}

export default async function AboutPage() {
  const [hero, values, atelier] = await Promise.all([
    getPublishedBlock<HeroStoryBlock>('about', 'hero_story'),
    getPublishedBlock<ValuesBlock>('about', 'values'),
    getPublishedBlock<AtelierBlock>('about', 'atelier'),
  ]);

  const heroData = hero || DEFAULT_HERO_STORY;
  const valuesData = values || DEFAULT_VALUES;
  const atelierData = atelier || DEFAULT_ATELIER;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Our Story</h1>
          <div className="breadcrumb"><Link href="/">Home</Link> / Our Story</div>
        </div>
      </div>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">{heroData.eyebrow}</span>
            <h2>{heroData.heading}</h2>
            {heroData.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            <div className="stat-row">
              {heroData.stats.map((s, i) => (
                <div key={i}><div className="num">{s.num}</div><div className="label">{s.label}</div></div>
              ))}
            </div>
          </div>
          <div className="split-media"><div className="monogram">{heroData.monogram}</div></div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">{valuesData.eyebrow}</span>
            <h2>{valuesData.heading}</h2>
          </div>
          <div className="testimonial-grid">
            {valuesData.items.map((item, i) => (
              <div key={i} className="testimonial-card">
                <IconGlyph name={item.icon} style={{ width: 36, height: 36, color: 'var(--gold-dark)', marginBottom: 16 }} />
                <h3 style={{ fontSize: 19, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="split-media"><div className="monogram">{atelierData.monogram}</div></div>
          <div>
            <span className="eyebrow">{atelierData.eyebrow}</span>
            <h2>{atelierData.heading}</h2>
            {atelierData.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            <Link href={atelierData.buttonHref} className="btn btn-primary">{atelierData.buttonText}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
