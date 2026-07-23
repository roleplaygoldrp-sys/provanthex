'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  CreditCard,
  Brain,
  Sparkles,
  Settings,
  LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Nova Conversa',
    href: '/chat',
    icon: MessageSquare,
  },
  {
    title: 'Perfil',
    href: '/profile',
    icon: User,
  },
  {
    title: 'Assinatura',
    href: '/billing',
    icon: CreditCard,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Vanthex <span className="text-purple-400">IA</span></span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2',
                  isActive 
                    ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Pro Banner */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span className="text-sm font-medium text-white">Plano Pro</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Tenha acesso a todos os especialistas e respostas detalhadas.
          </p>
          <Link href="/billing">
            <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs">
              Upgrade
            </Button>
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>
    </aside>
  )
}
