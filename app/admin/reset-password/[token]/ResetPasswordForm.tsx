'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import PasswordRules, { isPasswordStrong } from '@/components/admin/PasswordRules';

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!isPasswordStrong(password)) {
      setError('Please meet all password requirements below.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not reset password.');
        setLoading(false);
        return;
      }
      setDone(true);
      setTimeout(() => router.push('/admin/login'), 1800);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  if (done) return <div className="a-alert a-alert-success">Password updated. Redirecting to sign in…</div>;

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="a-alert a-alert-error">{error}</div>}
      <div className="a-field">
        <label htmlFor="password">New Password</label>
        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <PasswordRules password={password} />
      <div className="a-field">
        <label htmlFor="confirm">Confirm New Password</label>
        <input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      <button type="submit" className="a-btn a-btn-gold a-btn-block" disabled={loading}>
        {loading ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  );
}
