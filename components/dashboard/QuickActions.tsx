'use client';

import { useRouter } from 'next/navigation';
import { Clock, Palette, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const cardClassName =
  'flex flex-row flex-wrap items-center gap-3 rounded-xl border border-border bg-white p-5 shadow-sm';

export function QuickActions() {
  const router = useRouter();

  return (
    <div className={cardClassName}>
      <p className="text-[13px] font-semibold text-[#374151]">Quick Actions</p>

      <div className="h-5 w-px bg-border" aria-hidden />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-[var(--color-primary-hover)]"
          onClick={() => router.push('/customers')}
        >
          <Plus className="size-3.5" />
          Add Customer
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-9 gap-1.5 border-border bg-white text-foreground hover:bg-muted"
          onClick={() => router.push('/customers')}
        >
          <Palette className="size-3.5" />
          Manage Themes
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-9 gap-1.5 border-border bg-white text-foreground hover:bg-muted"
          onClick={() => router.push('/users')}
        >
          <Users className="size-3.5" />
          View Users
        </Button>
      </div>

      <p className="ml-auto flex items-center gap-1 text-[11px] text-[#9CA3AF]">
        <Clock className="size-3" aria-hidden />
        Data cached · refreshes every 5 min
      </p>
    </div>
  );
}
