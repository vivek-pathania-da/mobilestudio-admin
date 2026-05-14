'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Building2,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Plus,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customers', label: 'Customers', icon: Building2 },
  { href: '/users', label: 'Users', icon: Users },
] as const;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || '?';
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside
        className="flex shrink-0 flex-col border-r py-4"
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--color-sidebar)',
          borderColor: 'var(--color-sidebar-border)',
        }}
      >
        <div className="flex items-center gap-2 px-4 pb-6">
          <div
            className="flex size-8 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            MS
          </div>
          <span
            className="font-semibold tracking-tight"
            style={{ color: 'var(--color-sidebar-foreground)' }}
          >
            MobileStudio
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--color-sidebar-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-sidebar-foreground)]'
                )}
              >
                <Icon className="size-4 shrink-0 opacity-90" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2 px-2 pt-4">
          <Button
            className="w-full justify-center gap-2 font-semibold"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            <Plus className="size-4" />
            New Project
          </Button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--color-sidebar-hover)]"
            style={{ color: 'var(--color-sidebar-muted)' }}
          >
            <CircleHelp className="size-4" />
            Support
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--color-sidebar-hover)]"
            style={{ color: 'var(--color-sidebar-muted)' }}
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex h-[var(--topbar-height)] shrink-0 items-center justify-end gap-2 border-b px-6"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-muted)]"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label="Notifications"
            >
              <Bell className="size-4" />
            </button>
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-muted)]"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label="Help"
            >
              <CircleHelp className="size-4" />
            </button>
            <Avatar className="size-9">
              <AvatarFallback className="text-xs font-medium">
                {user?.name ? initials(user.name) : '—'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main
          className="flex-1 overflow-auto p-6 md:p-8"
          style={{ backgroundColor: 'var(--color-page-background)' }}
        >
          <div className="mx-auto w-full max-w-[var(--content-max-width)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
