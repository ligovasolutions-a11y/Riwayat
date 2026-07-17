'use client';

import { useState } from 'react';

// Matches original behavior: purely decorative tab switching (no
// client-side filtering was ever wired up in the static site).
export default function TabList({ tabs }: { tabs: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="tab-list">
      {tabs.map((tab, i) => (
        <button key={tab} className={i === active ? 'active' : ''} onClick={() => setActive(i)}>{tab}</button>
      ))}
    </div>
  );
}
