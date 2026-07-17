import type { TestimonialsBlock } from '@/lib/blockTypes';

export default function Testimonials({ data }: { data: TestimonialsBlock }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2>{data.heading}</h2>
        </div>
        <div className="testimonial-grid">
          {data.items.map((item, i) => (
            <div key={i} className="testimonial-card">
              <div className="stars">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</div>
              <p className="quote">&quot;{item.quote}&quot;</p>
              <div className="author">— {item.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
