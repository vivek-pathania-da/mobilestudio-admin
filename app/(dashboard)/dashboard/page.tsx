'use client';

import { useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Building2,
  FlaskConical,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { StatCard } from '@/components/dashboard/StatCard';
import { NeedsAttention } from '@/components/dashboard/NeedsAttention';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useDashboardMetrics } from '@/hooks/useDashboard';
import { useAuthStore } from '@/stores/auth.store';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: metrics, isLoading, isError } = useDashboardMetrics();

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load dashboard metrics');
    }
  }, [isError]);

  const activePercent = metrics
    ? Math.round(
        (metrics.customers.active / Math.max(metrics.customers.total, 1)) * 100
      )
    : 0;

  return (
    <div
      className="mx-auto max-w-[1200px] p-8"
      style={{ background: 'var(--color-page-background, #F9FAFB)' }}
    >
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary, #0F172A)' }}
        >
          Dashboard
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: 'var(--color-text-tertiary, #6B7280)' }}
        >
          Welcome back, {user?.name ?? 'Admin'}
        </p>
      </div>

      {isError ? (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border p-4"
          style={{
            background: 'var(--color-error-light, #FEF2F2)',
            borderColor: '#FCA5A5',
          }}
        >
          <AlertTriangle className="size-4 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">
            Could not load dashboard data. Please refresh the page.
          </p>
        </div>
      ) : null}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Customers"
          value={metrics?.customers.total ?? 0}
          icon={Building2}
          iconColor="#6B7280"
          isLoading={isLoading}
        />
        <StatCard
          label="Active"
          value={metrics?.customers.active ?? 0}
          subLabel={
            metrics ? `${activePercent}% of total` : undefined
          }
          icon={Activity}
          iconColor="#16A34A"
          isLoading={isLoading}
        />
        <StatCard
          label="Trial"
          value={metrics?.customers.trial ?? 0}
          icon={FlaskConical}
          iconColor="#D97706"
          isLoading={isLoading}
        />
        <StatCard
          label="Total Users"
          value={metrics?.users.total ?? 0}
          subLabel={
            metrics
              ? `${metrics.users.admins} admin · ${metrics.users.regularUsers} users`
              : undefined
          }
          icon={Users}
          iconColor="#7C3AED"
          isLoading={isLoading}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentActivity
          customers={metrics?.recentCustomers ?? []}
          isLoading={isLoading}
        />
        <NeedsAttention
          customers={metrics?.themes.customersWithNoActiveTheme ?? []}
          isLoading={isLoading}
        />
      </div>

      <QuickActions />

      {metrics ? (
        <p
          className="mt-4 text-center text-xs"
          style={{ color: 'var(--color-text-disabled, #9CA3AF)' }}
        >
          Data generated at{' '}
          {new Date(metrics.generatedAt).toLocaleTimeString()} · cached until{' '}
          {new Date(metrics.cachedUntil).toLocaleTimeString()}
        </p>
      ) : null}
    </div>
  );
}
