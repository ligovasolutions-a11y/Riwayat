import type { TrustStripBlock } from '@/lib/blockTypes';

export default function TrustStrip({ data }: { data: TrustStripBlock }) {
  return (
    <div className="trust-strip">
      <div className="container">
        {data.items.map((item, i) => <span key={i}>{item}</span>)}
      </div>
    </div>
  );
}
