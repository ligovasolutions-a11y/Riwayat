'use client';

import { useState, type FormEvent } from 'react';
import type { ContactFormBlock } from '@/lib/blockTypes';

export default function ContactForm({ data }: { data: ContactFormBlock }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('done');
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
    }
  }

  return (
    <div className="contact-form">
      <h2 style={{ marginBottom: 24 }}>{data.title}</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Full Name</label>
          <input type="text" placeholder="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Email Address</label>
          <input type="email" placeholder="you@example.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Phone Number</label>
          <input type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Message</label>
          <textarea placeholder="How can we help you?" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
          {status === 'done' ? 'Message Sent ✓' : status === 'error' ? 'Something went wrong — try again' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
