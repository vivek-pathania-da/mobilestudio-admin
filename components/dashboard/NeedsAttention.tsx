'use client';

import Link from 'next/link';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import type { DashboardCustomerSummary } from '@/types/api';

export interface NeedsAttentionProps {
  customers: DashboardCustomerSummary[];
  isLoading: boolean;
}

const cardClassName =
  'flex h-full min-h-[320px] flex-col rounded-xl border border-border bg-white p-6 shadow-sm';

function SkeletonRows() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-14 animate-pulse rounded-lg bg-[#E5E7EB]"
        />
      ))}
    </div>
  );
}

export function NeedsAttention({ customers, isLoading }: NeedsAttentionProps) {
  const list = customers ?? [];
  const preview = list.slice(0, 3);

  return (
    <div className={cardClassName}>
      <header className="mb-4 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center">
          <AlertTriangle className="size-4 text-[#D97706]" aria-hidden />
          <h2 className="ml-2 text-[15px] font-semibold text-foreground">
            Needs Attention
          </h2>
        </div>
        {list.length > 0 ? (
          <span className="rounded-full border border-[#FCA5A5] bg-[#FEE2E2] px-2.5 py-0.5 text-[11px] font-medium text-[#DC2626]">
            {list.length} action needed
          </span>
        ) : null}
      </header>

      {isLoading ? (
        <SkeletonRows />
      ) : list.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="size-8 text-[#16A34A]" aria-hidden />
          <p className="mt-3 text-sm text-[#374151]">
            All customers have active themes
          </p>
          <p className="mt-1 text-[13px] text-[#6B7280]">No action required</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-[13px] text-[#6B7280]">
            These active customers have no theme activated. Their app will show
            the default theme.
          </p>
          <ul className="flex flex-col gap-2">
            {preview.map((customer) => (
              <li
                key={customer.customerId}
                className="flex items-center gap-3 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-3"
              >
                <AlertCircle
                  className="size-4 shrink-0 text-[#DC2626]"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-foreground">
                    {customer.companyName}
                  </p>
                  <p className="font-mono text-[11px] text-[#6B7280]">
                    {customer.customerCode}
                  </p>
                </div>
                <Link
                  href={`/customers/${customer.customerId}`}
                  className="shrink-0 text-xs text-foreground underline hover:text-[#374151]"
                >
                  Set theme →
                </Link>
              </li>
            ))}
          </ul>
          {list.length > 3 ? (
            <Link
              href="/customers"
              className="mt-3 text-[13px] font-medium text-foreground hover:text-[#374151] hover:underline"
            >
              View all {list.length} customers →
            </Link>
          ) : null}
        </>
      )}
    </div>
  );
}

