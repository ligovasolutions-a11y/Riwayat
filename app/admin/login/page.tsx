import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(session.user.mustChangePassword ? '/admin/change-password' : '/admin');

  return (
    <div className="a-auth-wrap">
      <div className="a-auth-card">
        <div className="a-auth-logo">Riwayat <span>Jewels</span></div>
        <div className="a-auth-sub">Admin Panel</div>
        <LoginForm />
        <div className="a-auth-links">
          <a href="/admin/forgot-password">Forgot password?</a>
        </div>
      </div>
    </div>
  );
}
