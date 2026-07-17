'use client';

import { useState } from 'react';

export default function Accordion({ items }: { items: { title: string; content: string }[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div key={i} className={`accordion-item${openIndex === i ? ' open' : ''}`}>
          <button onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
            {item.title} <span className="plus">+</span>
          </button>
          <div className="panel">{item.content}</div>
        </div>
      ))}
    </div>
  );
}
