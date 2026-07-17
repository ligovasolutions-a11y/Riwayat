import Link from 'next/link';
import { IconGlyph } from '@/lib/icons';
import type { CategoriesBlock } from '@/lib/blockTypes';

export default function CategoryGrid({ data }: { data: CategoriesBlock }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2>{data.heading}</h2>
          <p>{data.description}</p>
        </div>
        <div className="category-grid">
          {data.items.map((item, i) => (
            <Link key={i} href={item.href} className="category-card">
              <IconGlyph name={item.icon} className="category-icon" />
              <h3>{item.label}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
