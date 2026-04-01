'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useIdeas } from '@/lib/store'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Lightbulb,
  Timer,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/ideas', label: 'Ideas', icon: Lightbulb },
  { href: '/sessions', label: 'Sessions', icon: Timer },
]

function NavLink({
  href,
  label,
  icon: Icon,
  badge,
  active,
  mobile,
}: {
  href: string
  label: string
  icon: React.ElementType
  badge?: number
  active: boolean
  mobile?: boolean
}) {
  if (mobile) {
    return (
      <Link
        href={href}
        className={`flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors ${
          active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <span className="relative">
          <Icon size={20} />
          {badge != null && badge > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </span>
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-primary/15 text-primary'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }`}
    >
      <Icon size={18} />
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="h-5 min-w-5 rounded-full bg-primary text-xs font-bold text-primary-foreground flex items-center justify-center px-1">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [ideas] = useIdeas()
  const inboxCount = ideas.filter((i) => i.status === 'inbox').length

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col flex-shrink-0 border-r border-border bg-card">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-border">
          <span className="text-2xl">⛳</span>
          <div>
            <div className="text-sm font-bold text-primary tracking-wide">RYP HUB</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Command Center
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.href === '/ideas' ? inboxCount : undefined}
              active={isActive(item.href)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border">
          <p className="text-[10px] text-muted-foreground">hub.rypgolf.com · Phase 1</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0 min-h-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-card">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            badge={item.href === '/ideas' ? inboxCount : undefined}
            active={isActive(item.href)}
            mobile
          />
        ))}
      </nav>
    </div>
  )
}
