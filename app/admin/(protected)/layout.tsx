import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminShell from './_components/AdminShell'

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return <AdminShell email={session.email}>{children}</AdminShell>
}
