import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { CsrfProvider } from '@/components/admin/CsrfContext';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.user.mustChangePassword) redirect('/admin/change-password');

  return (
    <CsrfProvider token={session.csrfToken}>
      <div className="a-shell">
        <Sidebar />
        <div className="a-main">
          <Topbar username={session.user.username} />
          <div className="a-content">{children}</div>
        </div>
      </div>
    </CsrfProvider>
  );
}
