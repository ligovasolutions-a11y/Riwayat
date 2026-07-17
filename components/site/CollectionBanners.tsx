import Link from 'next/link';
import type { CollectionsBlock } from '@/lib/blockTypes';

export default function CollectionBanners({ data }: { data: CollectionsBlock }) {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2>{data.heading}</h2>
        </div>
        <div className="collection-banners">
          {data.items.map((item, i) => (
            <div key={i} className={`banner-card${item.variant ? ' ' + item.variant : ''}`}>
              <div className="banner-content">
                <span>{item.tag}</span>
                <h3>{item.title}</h3>
                <Link href={item.href}>Explore Collection</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
