'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { statusConfig } from '@/lib/design-system';
import { companyInitials } from '@/lib/dashboard-utils';
import { cn } from '@/lib/utils';
import type { CustomerDashboardStatus, DashboardRecentCustomer } from '@/types/api';

export interface RecentActivityProps {
  customers: DashboardRecentCustomer[];
  isLoading: boolean;
}

const cardClassName =
  'flex flex-col rounded-xl border border-border bg-white p-6 shadow-sm';

const CUSTOMER_STATUS_KEYS = [
  'active',
  'trial',
  'suspended',
  'churned',
] as const;

type CustomerStatusKey = (typeof CUSTOMER_STATUS_KEYS)[number];

function isCustomerStatusKey(
  status: CustomerDashboardStatus
): status is CustomerStatusKey {
  return (CUSTOMER_STATUS_KEYS as readonly string[]).includes(status);
}

function SkeletonRows() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-3 border-b border-border py-3 last:border-b-0"
        >
          <div className="size-9 shrink-0 animate-pulse rounded-lg bg-[#E5E7EB]" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3 w-32 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-2.5 w-20 animate-pulse rounded bg-[#E5E7EB]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: CustomerDashboardStatus }) {
  if (!isCustomerStatusKey(status)) {
    return (
      <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
        {status}
      </span>
    );
  }

  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
        config.color,
        config.bg,
        config.border
      )}
    >
      <span className={cn('size-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}

export function RecentActivity({ customers, isLoading }: RecentActivityProps) {
  const router = useRouter();
  const list = (customers ?? []).slice(0, 5);

  return (
    <div className={cardClassName}>
      <header className="mb-4 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center">
          <Clock className="size-4 text-[#6B7280]" aria-hidden />
          <h2 className="ml-2 text-[15px] font-semibold text-foreground">
            Recent Customers
          </h2>
        </div>
        <Link
          href="/customers"
          className="text-[13px] font-medium text-foreground hover:text-[#374151] hover:underline"
        >
          See all →
        </Link>
      </header>

      {isLoading ? (
        <SkeletonRows />
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <Users className="size-8 text-[#9CA3AF]" aria-hidden />
          <p className="mt-3 text-sm text-[#374151]">No customers yet</p>
          <p className="mt-1 text-[13px] text-[#6B7280]">
            Add your first customer to get started
          </p>
          <Button
            type="button"
            size="sm"
            className="mt-4 h-9 bg-primary text-primary-foreground hover:bg-[var(--color-primary-hover)]"
            onClick={() => router.push('/customers')}
          >
            Add Customer
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col">
          {list.map((customer, index) => {
            const created = new Date(customer.createdAt);
            const relativeTime = Number.isNaN(created.getTime())
              ? '—'
              : formatDistanceToNow(created, { addSuffix: true });

            return (
              <li
                key={customer.customerId}
                className={cn(
                  'flex items-center gap-3 py-2.5',
                  index < list.length - 1 && 'border-b border-border'
                )}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]">
                  <span className="text-xs font-semibold text-[var(--color-primary-foreground)]">
                    {companyInitials(customer.companyName)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-foreground">
                    {customer.companyName}
                  </p>
                  <p className="font-mono text-[11px] text-[#9CA3AF]">
                    {customer.customerCode}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={customer.status} />
                  <span className="text-[11px] text-[#9CA3AF]">
                    {relativeTime}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
