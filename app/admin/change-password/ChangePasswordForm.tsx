'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import PasswordRules, { isPasswordStrong } from '@/components/admin/PasswordRules';

export default function ChangePasswordForm({ csrfToken, mustChangePassword }: { csrfToken: string; mustChangePassword: boolean }) {
  const router = useRouter();
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (!isPasswordStrong(password)) {
      setError('Please meet all password requirements below.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({ currentPassword: current, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not change password.');
        setLoading(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="a-alert a-alert-error">{error}</div>}
      <div className="a-field">
        <label htmlFor="current">{mustChangePassword ? 'Current (Default) Password' : 'Current Password'}</label>
        <input id="current" type="password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
      </div>
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
