'use client';

import { DashboardAuthGuard } from '@/components/dashboard/dashboard-auth-guard';

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardAuthGuard>{children}</DashboardAuthGuard>;
}
