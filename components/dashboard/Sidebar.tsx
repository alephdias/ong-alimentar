'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  LayoutDashboard, ShoppingBag, Users, Package,
  MapPin, BarChart2, LogOut, Heart
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/distribuicoes', label: 'Distribuições', icon: ShoppingBag },
  { href: '/beneficiarios', label: 'Beneficiários', icon: Users },
  { href: '/estoque', label: 'Estoque', icon: Package },
  { href: '/pontos', label: 'Pontos', icon: MapPin },
  { href: '/relatorios', label: 'Relatórios', icon: BarChart2 },
]

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-100 flex flex-col z-10">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1D9E75' }}>
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Alimentar SP</p>
            <p className="text-xs text-gray-400">Gestão da ONG</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
              <Icon className={`w-4 h-4 ${active ? 'text-brand-600' : 'text-gray-400'}`} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          {user?.image ? (
            <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-medium text-brand-700">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'V'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="w-full flex items-center gap-2 text-xs text-gray-400 hover:text-gray-700 transition-colors">
          <LogOut className="w-3.5 h-3.5" /> Sair
        </button>
      </div>
    </aside>
  )
}
