'use client';

import { DashboardAuthGuard } from '@/components/dashboard/dashboard-auth-guard';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </DashboardAuthGuard>
  );
}
