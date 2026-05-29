import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Pega o token do cookie
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()
  const authCookie = allCookies.find(c => c.name.includes('auth-token') || c.name.includes('access-token'))

  if (!authCookie) redirect('/login')

  try {
    const { data: { user }, error } = await supabase.auth.getUser(authCookie.value)
    if (error || !user) redirect('/login')

    const userInfo = {
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
      email: user.email,
      image: user.user_metadata?.avatar_url || null,
    }

    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar user={userInfo} />
        <main className="flex-1 ml-56 p-6">{children}</main>
      </div>
    )
  } catch {
    redirect('/login')
  }
}
