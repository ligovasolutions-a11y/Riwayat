import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import ChangePasswordForm from './ChangePasswordForm';

export default async function ChangePasswordPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="a-auth-wrap">
      <div className="a-auth-card">
        <div className="a-auth-logo">Riwayat <span>Jewels</span></div>
        <div className="a-auth-sub">{session.user.mustChangePassword ? 'Set A New Password To Continue' : 'Change Password'}</div>
        {session.user.mustChangePassword && (
          <div className="a-alert a-alert-error" style={{ marginBottom: 18 }}>
            You&apos;re using the default password. For security, you must set a new one before accessing the dashboard.
          </div>
        )}
        <ChangePasswordForm csrfToken={session.csrfToken} mustChangePassword={session.user.mustChangePassword} />
      </div>
    </div>
  );
}
