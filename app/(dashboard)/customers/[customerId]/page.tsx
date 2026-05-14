'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  ChevronRight,
  Loader2,
  Palette,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthHydration } from '@/hooks/use-auth-hydration';
import { useAuthStore } from '@/stores/auth.store';
import { customersApi } from '@/lib/api/customers.api';
import { themesApi } from '@/lib/api/themes.api';
import { getApiErrorMessage } from '@/lib/api/client';
import type { Customer, CustomerStatus, ThemeListItem, ThemeTokenMap, ThemeFontTokens } from '@/types/api';
import { EditCustomerSheet } from '@/components/customers/edit-customer-sheet';
import { ChurnCustomerDialog } from '@/components/customers/customer-dialogs';
import { cn } from '@/lib/utils';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(s: string): boolean {
  return UUID_REGEX.test(s);
}

function companyInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase() || '?';
  }
  return (name.trim().slice(0, 2) || '?').toUpperCase();
}

function formatDetailDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function shortCustomerId(id: string): string {
  if (id.length <= 14) return id;
  return `${id.slice(0, 8)}…${id.slice(-4)}`;
}

function statusBadgeClass(s: CustomerStatus): string {
  if (s === 'active') {
    return 'border-emerald-200 bg-emerald-50 font-semibold text-emerald-800';
  }
  if (s === 'churned') {
    return 'border-red-200 bg-red-50 font-semibold text-red-800';
  }
  return 'border-amber-200 bg-amber-50 font-semibold text-amber-800';
}

function statusLabel(s: CustomerStatus): string {
  return s.toUpperCase();
}

function tokenHexColors(tokens: ThemeTokenMap | undefined, max = 7): string[] {
  if (!tokens) return [];
  return Object.values(tokens)
    .filter((v) =>
      typeof v === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim())
    )
    .slice(0, max);
}

function hashSwatches(seed: string, count = 6): string[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return Array.from({ length: count }, (_, i) => {
    const hue = (h + i * 47) % 360;
    const sat = 38 + (i % 4) * 8;
    const light = 32 + (i % 5) * 9;
    return `hsl(${hue} ${sat}% ${light}%)`;
  });
}

function formatFontLine(ft: ThemeFontTokens | undefined): string {
  if (!ft?.families) return '—';
  const names = [...new Set(Object.values(ft.families))].filter(Boolean);
  return names.length ? names.slice(0, 2).join(' / ') : '—';
}

function isLikelyDefaultTheme(t: ThemeListItem): boolean {
  const id = t.themeId.toLowerCase();
  const n = t.themeName.trim().toLowerCase();
  return id === 'default' || n === 'default';
}

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = typeof params.customerId === 'string' ? params.customerId : '';
  const validId = isUuid(customerId);

  const ready = useAuthHydration();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const qc = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [churnOpen, setChurnOpen] = useState(false);

  const enabled = ready && isAuthenticated && validId;

  const customerQuery = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => customersApi.get(customerId),
    enabled,
  });

  const themesQuery = useQuery({
    queryKey: ['themes', customerId],
    queryFn: () => themesApi.listByCustomer(customerId),
    enabled,
  });

  const activeThemeQuery = useQuery({
    queryKey: ['theme-active', customerId],
    queryFn: () => themesApi.getActive(customerId),
    enabled,
    retry: false,
  });

  const customer = customerQuery.data;

  const activateMutation = useMutation({
    mutationFn: (themeId: string) => themesApi.activate(customerId, themeId),
    onSuccess: () => {
      toast.success('Theme activated');
      void qc.invalidateQueries({ queryKey: ['themes', customerId] });
      void qc.invalidateQueries({ queryKey: ['theme-active', customerId] });
      void qc.invalidateQueries({ queryKey: ['customer', customerId] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const resolvedActive = activeThemeQuery.data;

  const themeCards = useMemo(() => {
    const list = themesQuery.data ?? [];
    return list.map((item) => {
      const isSameAsResolved =
        resolvedActive && resolvedActive.themeId === item.themeId;
      const tokens = isSameAsResolved ? resolvedActive.tokens : undefined;
      const fonts = isSameAsResolved ? resolvedActive.font_tokens : undefined;
      const hexes = tokenHexColors(tokens);
      const swatches =
        hexes.length > 0 ? hexes : hashSwatches(item.themeId + item.themeName);
      return { item, swatches, fonts };
    });
  }, [themesQuery.data, resolvedActive]);

  if (!validId) {
    return (
      <div className="space-y-6">
        <Card className="border shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
          <CardHeader>
            <CardTitle>Invalid customer</CardTitle>
            <CardDescription>
              The URL must include a valid customer UUID.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/customers">Back to customers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const showMainLoading =
    !ready || !isAuthenticated || customerQuery.isPending;

  if (showMainLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        <span className="text-sm">Loading customer…</span>
      </div>
    );
  }

  if (customerQuery.isError || !customer) {
    return (
      <div className="space-y-6">
        <Button asChild variant="ghost" className="h-8 gap-1 px-0 text-muted-foreground">
          <Link href="/customers" className="inline-flex items-center gap-1">
            ← Customers
          </Link>
        </Button>
        <Card className="border shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
          <CardHeader>
            <CardTitle className="text-destructive">Could not load customer</CardTitle>
            <CardDescription>{getApiErrorMessage(customerQuery.error)}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/customers">Back to customers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEditThemes = customer.status === 'active';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <nav
            className="flex flex-wrap items-center gap-1 text-sm"
            style={{ color: 'var(--color-text-tertiary)' }}
            aria-label="Breadcrumb"
          >
            <Link
              href="/customers"
              className="font-medium hover:underline"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Customers
            </Link>
            <ChevronRight className="size-4 shrink-0 opacity-60" aria-hidden />
            <span
              className="truncate font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {customer.companyName}
            </span>
          </nav>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setEditOpen(true)}>
            Edit customer
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={() => setChurnOpen(true)}
            disabled={customer.status !== 'active'}
          >
            Churn customer
          </Button>
        </div>
      </div>

      <Card className="border shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start">
          <div
            className="flex size-20 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {companyInitials(customer.companyName)}
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className="text-xl font-bold tracking-tight md:text-2xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {customer.companyName}
              </h1>
              <Badge
                variant="outline"
                className={cn(
                  'rounded-md px-2 py-0.5 text-[11px] tracking-wide uppercase',
                  statusBadgeClass(customer.status)
                )}
              >
                {statusLabel(customer.status)}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-mono text-xs uppercase">
                {customer.customerCode}
              </Badge>
              {customer.industry.trim() ? (
                <Badge variant="outline" className="text-xs">
                  {customer.industry}
                </Badge>
              ) : null}
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Primary contact</dt>
                <dd className="mt-0.5 font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {customer.contactName}
                </dd>
                <dd className="text-muted-foreground">{customer.primaryEmail}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="mt-0.5 font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {customer.primaryPhone?.trim() || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Customer ID</dt>
                <dd
                  className="mt-0.5 font-mono text-xs break-all"
                  title={customer.customerId}
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {shortCustomerId(customer.customerId)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Account created</dt>
                <dd className="mt-0.5" style={{ color: 'var(--color-text-primary)' }}>
                  {formatDetailDate(customer.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Last updated</dt>
                <dd className="mt-0.5" style={{ color: 'var(--color-text-primary)' }}>
                  {formatDistanceToNow(new Date(customer.updatedAt), { addSuffix: true })}
                </dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="admin-section-label flex items-center gap-2">
            <Palette className="size-4" aria-hidden />
            Themes
          </h2>
          <Button variant="outline" size="sm" className="h-8" asChild>
            <Link href={`/customers/${customerId}/themes/new`}>New theme</Link>
          </Button>
        </div>
        {themesQuery.isPending ? (
          <div className="flex items-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Loading themes…
          </div>
        ) : themesQuery.isError ? (
          <Card className="border p-6 shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm text-destructive">{getApiErrorMessage(themesQuery.error)}</p>
          </Card>
        ) : themeCards.length === 0 ? (
          <Card className="border p-6 shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm text-muted-foreground">No themes returned for this customer.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {themeCards.map(({ item, swatches, fonts }) => (
              <ThemeSummaryCard
                key={item.themeId}
                customerId={customerId}
                item={item}
                swatches={swatches}
                typography={formatFontLine(fonts)}
                activating={
                  activateMutation.isPending &&
                  activateMutation.variables === item.themeId
                }
                onActivate={() => activateMutation.mutate(item.themeId)}
                canActivate={canEditThemes && !item.isActive}
              />
            ))}
          </div>
        )}
      </section>

      <EditCustomerSheet
        customer={customer}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ChurnCustomerDialog
        customer={customer}
        open={churnOpen}
        onOpenChange={setChurnOpen}
      />
    </div>
  );
}

function ThemeSummaryCard({
  customerId,
  item,
  swatches,
  typography,
  activating,
  onActivate,
  canActivate,
}: {
  customerId: string;
  item: ThemeListItem;
  swatches: string[];
  typography: string;
  activating: boolean;
  onActivate: () => void;
  canActivate: boolean;
}) {
  const active = item.isActive;
  const defaultTheme = isLikelyDefaultTheme(item);

  return (
    <Card
      className={cn(
        'flex flex-col border shadow-sm transition-shadow',
        active && 'ring-2 ring-primary/30'
      )}
      style={{ borderColor: active ? 'var(--color-primary)' : 'var(--color-border)' }}
    >
      <CardHeader className="space-y-2 pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">{item.themeName}</CardTitle>
          <div className="flex flex-wrap justify-end gap-1">
            {defaultTheme ? (
              <Badge variant="secondary" className="text-[10px] uppercase">
                System default
              </Badge>
            ) : null}
            {active ? (
              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-50 text-[10px] font-semibold uppercase text-emerald-800"
              >
                Active
              </Badge>
            ) : null}
          </div>
        </div>
        <CardDescription className="text-xs leading-relaxed">
          {active
            ? 'Current theme applied to instance.'
            : 'Available theme for this customer.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <div className="flex flex-wrap gap-1.5" aria-label="Color preview">
          {swatches.map((c, i) => (
            <span
              key={i}
              className="size-7 shrink-0 rounded-md border border-black/10 shadow-inner"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">Typography</span> {typography}
        </div>
        <button
          type="button"
          className="text-left text-xs font-medium text-primary hover:underline"
        >
          {item.overrideCount} overrides
        </button>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
          <span>Version v{item.version}</span>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" className="h-8" asChild>
              <Link
                href={`/customers/${customerId}/themes/${encodeURIComponent(item.themeId)}`}
              >
                Edit theme
              </Link>
            </Button>
            {!active ? (
              <Button
                type="button"
                size="sm"
                className="inline-flex h-8 items-center gap-1.5 font-semibold"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground)',
                }}
                disabled={!canActivate || activating}
                onClick={onActivate}
              >
                {activating ? (
                  <>
                    <Loader2 className="mr-1 size-3.5 animate-spin" />
                    Activating…
                  </>
                ) : (
                  'Activate'
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
