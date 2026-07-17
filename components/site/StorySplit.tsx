import Link from 'next/link';
import type { StoryBlock } from '@/lib/blockTypes';

export default function StorySplit({ data }: { data: StoryBlock }) {
  return (
    <section className="section section-alt">
      <div className="container split">
        <div className="split-media"><div className="monogram">R</div></div>
        <div>
          <span className="eyebrow">{data.eyebrow}</span>
          <h2>{data.heading}</h2>
          {data.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          <Link href={data.buttonHref} className="btn">{data.buttonText}</Link>
          <div className="stat-row">
            {data.stats.map((s, i) => (
              <div key={i}><div className="num">{s.num}</div><div className="label">{s.label}</div></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
