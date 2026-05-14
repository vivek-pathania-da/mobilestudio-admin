'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthHydration } from '@/hooks/use-auth-hydration';
import { useAuthStore } from '@/stores/auth.store';

export function DashboardAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const ready = useAuthHydration();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [ready, isAuthenticated, router]);

  if (!ready) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: 'var(--color-page-background)' }}
      >
        <p
          className="text-sm"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Loading…
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
