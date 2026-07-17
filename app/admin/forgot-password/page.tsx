'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      setMessage(data.message || 'If that account exists, a reset link has been generated.');
    } catch {
      setMessage('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="a-auth-wrap">
      <div className="a-auth-card">
        <div className="a-auth-logo">Riwayat <span>Jewels</span></div>
        <div className="a-auth-sub">Reset Password</div>
        {message ? (
          <div className="a-alert a-alert-success">{message}</div>
        ) : (
          <form onSubmit={onSubmit}>
            <p style={{ fontSize: 13, color: 'var(--a-text-muted)', marginBottom: 18 }}>
              Enter your admin username. A one-time reset link will be generated — since no email service is
              configured for this deployment, ask whoever manages the server to retrieve it from the server logs.
            </p>
            <div className="a-field">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <button type="submit" className="a-btn a-btn-gold a-btn-block" disabled={loading}>
              {loading ? 'Requesting…' : 'Request Reset Link'}
            </button>
          </form>
        )}
        <div className="a-auth-links"><Link href="/admin/login">Back to Sign In</Link></div>
      </div>
    </div>
  );
}
