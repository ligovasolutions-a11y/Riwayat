import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import LoginForm from './LoginForm'

export default async function AdminLoginPage() {
  const session = await getSession()
  if (session) redirect('/admin')

  return (
    <div className="min-h-screen bg-rw-black flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src="/logo-icon.png" alt="" className="h-16 w-auto mx-auto mb-4" />
          <div className="text-2xl tracking-[0.2em] font-serif font-light text-white uppercase whitespace-nowrap">Riwaayat Jewels</div>
          <div className="text-[9px] tracking-[0.5em] uppercase font-sans text-rw-gold mt-1">Admin Portal</div>
        </div>
        <LoginForm />
        <p className="text-center text-white/30 text-xs font-sans mt-6">
          This portal is only for Riwaayat Jewels staff.
        </p>
      </div>
    </div>
  )
}
