'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: number | string;
  subLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  isLoading?: boolean;
}

function iconTintBackground(color: string): string {
  if (color.startsWith('#') && color.length === 7) {
    return `${color}1A`;
  }
  return 'rgba(37, 99, 235, 0.1)';
}

const cardClassName =
  'flex flex-col gap-3 rounded-xl border border-border bg-white p-6 shadow-sm';

export function StatCard({
  label,
  value,
  subLabel,
  icon: Icon,
  iconColor = '#6B7280',
  trend,
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className={cardClassName}>
        <div className="flex items-start justify-between">
          <div className="h-2.5 w-[60px] animate-pulse rounded bg-[#E5E7EB]" />
          <div className="size-9 animate-pulse rounded-lg bg-[#E5E7EB]" />
        </div>
        <div className="h-8 w-20 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-3 w-10 animate-pulse rounded bg-[#E5E7EB]" />
      </div>
    );
  }

  return (
    <div className={cardClassName}>
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-medium tracking-wider text-[#6B7280] uppercase">
          {label}
        </p>
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: iconTintBackground(iconColor) }}
        >
          <Icon className="size-[18px]" style={{ color: iconColor }} />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <p className="text-[32px] leading-none font-bold text-foreground">
          {value}
        </p>
        {trend ? (
          <span
            className={cn(
              'text-xs font-medium',
              trend.positive ? 'text-gray-600' : 'text-gray-500'
            )}
          >
            {trend.value}
          </span>
        ) : null}
      </div>

      {subLabel ? (
        <p className="text-[13px] text-[#6B7280]">{subLabel}</p>
      ) : null}
    </div>
  );
}
