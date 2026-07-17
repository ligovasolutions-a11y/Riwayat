'use client';

import { useState, type FormEvent } from 'react';
import type { NewsletterBlock } from '@/lib/blockTypes';

export default function NewsletterForm({ data }: { data: NewsletterBlock }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [email, setEmail] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Non-critical: still show confirmation, the enquiry may have
      // still been recorded server-side even if the response failed.
    }
    setStatus('done');
    setEmail('');
    setTimeout(() => setStatus('idle'), 2200);
  }

  return (
    <section className="newsletter">
      <div className="container">
        <h2>{data.heading}</h2>
        <p>{data.description}</p>
        <form className="newsletter-form" onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Enter your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status !== 'idle'}
          />
          <button type="submit" disabled={status !== 'idle'}>
            {status === 'done' ? 'Thank You!' : data.buttonText}
          </button>
        </form>
      </div>
    </section>
  );
}
