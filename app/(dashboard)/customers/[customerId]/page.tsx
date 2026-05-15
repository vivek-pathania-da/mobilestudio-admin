'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Calendar,
  ChevronRight,
  CircleCheck,
  Clock,
  Loader2,
  Mail,
  Palette,
  Pencil,
  Phone,
  Plus,
  Trash2,
  User,
  UserX,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthHydration } from '@/hooks/use-auth-hydration';
import { useAuthStore } from '@/stores/auth.store';
import { customersApi } from '@/lib/api/customers.api';
import { firebaseApi } from '@/lib/api/firebase.api';
import { themesApi } from '@/lib/api/themes.api';
import { getApiErrorMessage } from '@/lib/api/client';
import type { Customer, CustomerStatus, ThemeListItem, ThemeTokenMap, ThemeFontTokens } from '@/types/api';
import { EditCustomerSheet } from '@/components/customers/edit-customer-sheet';
import { ChurnCustomerDialog } from '@/components/customers/customer-dialogs';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { statusConfig } from '@/lib/design-system';
import { toCssHexColor } from '@/lib/theme-editor/theme-editor.utils';
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

function titleCaseIndustry(industry: string): string {
  return industry
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function DetailItem({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden />
        {label}
      </dt>
      <dd
        className="mt-1 text-sm font-medium"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {children}
      </dd>
    </div>
  );
}

function statusBadgeClass(s: CustomerStatus): string {
  const key = s in statusConfig ? s : 'churned';
  const config = statusConfig[key as keyof typeof statusConfig];
  return cn(
    'font-semibold',
    config.color,
    config.bg,
    config.border
  );
}

function statusLabel(s: CustomerStatus): string {
  return s.toUpperCase();
}

function tokenHexColors(tokens: ThemeTokenMap | undefined, max = 7): string[] {
  if (!tokens) return [];
  return Object.values(tokens)
    .filter(
      (v) =>
        typeof v === 'string' &&
        /^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(v.trim())
    )
    .map((v) => toCssHexColor(v))
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
  const [deleteTheme, setDeleteTheme] = useState<ThemeListItem | null>(null);

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
    onSuccess: (activated) => {
      toast.success('Theme activated');
      void firebaseApi.notifyThemeUpdated(activated.customerId).catch(() => {});
      void qc.invalidateQueries({ queryKey: ['themes', customerId] });
      void qc.invalidateQueries({ queryKey: ['theme-active', customerId] });
      void qc.invalidateQueries({ queryKey: ['customer', customerId] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const deleteThemeMutation = useMutation({
    mutationFn: (themeId: string) => themesApi.delete(customerId, themeId),
    onSuccess: () => {
      toast.success('Theme deleted');
      setDeleteTheme(null);
      void qc.invalidateQueries({ queryKey: ['themes', customerId] });
      void qc.invalidateQueries({ queryKey: ['theme-active', customerId] });
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
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-9"
            aria-label="Edit customer"
            title="Edit customer"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-9 border-destructive/40 text-destructive hover:bg-destructive/10"
            aria-label="Churn customer"
            title="Churn customer"
            onClick={() => setChurnOpen(true)}
            disabled={customer.status !== 'active'}
          >
            <UserX className="size-4" />
          </Button>
        </div>
      </div>

      <Card className="border shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start">
          <div
            className="flex size-20 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
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
                variant={
                  customer.status === 'active' ? 'default' : 'outline'
                }
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
                  customer.status !== 'active' &&
                    statusBadgeClass(customer.status)
                )}
              >
                {statusLabel(customer.status)}
              </Badge>
            </div>
            <p className="font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {customer.customerCode}
            </p>
            <div className="grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-4">
                <DetailItem icon={User} label="Primary contact">
                  {customer.contactName}
                </DetailItem>
                <DetailItem icon={Calendar} label="Account created">
                  {formatDetailDate(customer.createdAt)}
                </DetailItem>
              </div>
              <div className="flex flex-col gap-4">
                <DetailItem icon={Mail} label="Email">
                  <a
                    href={`mailto:${customer.primaryEmail}`}
                    className="font-medium text-foreground hover:text-[#374151] hover:underline"
                  >
                    {customer.primaryEmail}
                  </a>
                </DetailItem>
                <DetailItem icon={Clock} label="Last updated">
                  {formatDistanceToNow(new Date(customer.updatedAt), {
                    addSuffix: true,
                  })}
                </DetailItem>
              </div>
              <div className="flex flex-col gap-4">
                <DetailItem icon={Phone} label="Phone">
                  {customer.primaryPhone?.trim() ? (
                    <a
                      href={`tel:${customer.primaryPhone.trim()}`}
                      className="font-medium text-foreground hover:text-[#374151] hover:underline"
                    >
                      {customer.primaryPhone.trim()}
                    </a>
                  ) : (
                    <span className="font-normal text-muted-foreground">—</span>
                  )}
                </DetailItem>
                <DetailItem icon={Building2} label="Industry">
                  {customer.industry.trim() ? (
                    titleCaseIndustry(customer.industry)
                  ) : (
                    <span className="font-normal text-muted-foreground">—</span>
                  )}
                </DetailItem>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="admin-section-label flex items-center gap-2">
            <Palette className="size-4" aria-hidden />
            Themes
          </h2>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" asChild>
            <Link href={`/customers/${customerId}/themes/new`}>
              <Plus className="size-4" aria-hidden />
              New theme
            </Link>
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
                onDelete={() => setDeleteTheme(item)}
                canDelete={canEditThemes && !item.isActive}
                deleting={
                  deleteThemeMutation.isPending &&
                  deleteThemeMutation.variables === item.themeId
                }
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
      <ConfirmDialog
        open={deleteTheme !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTheme(null);
        }}
        title="Delete theme?"
        description={
          deleteTheme
            ? `"${deleteTheme.themeName}" will be permanently removed. This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete theme"
        variant="destructive"
        isLoading={deleteThemeMutation.isPending}
        onConfirm={() => {
          if (!deleteTheme) return;
          return deleteThemeMutation.mutateAsync(deleteTheme.themeId);
        }}
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
  onDelete,
  canDelete,
  deleting,
}: {
  customerId: string;
  item: ThemeListItem;
  swatches: string[];
  typography: string;
  activating: boolean;
  onActivate: () => void;
  canActivate: boolean;
  onDelete: () => void;
  canDelete: boolean;
  deleting: boolean;
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
                variant="default"
                className="rounded-full text-[10px] font-semibold uppercase"
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
              className="size-7 shrink-0 rounded-full border border-black/10 shadow-inner"
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
          className="text-left text-xs font-medium text-foreground hover:text-[#374151] hover:underline"
        >
          {item.overrideCount} overrides
        </button>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
          <span>Version v{item.version}</span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8 text-muted-foreground hover:bg-muted"
              title="Edit theme"
              aria-label={`Edit ${item.themeName}`}
              asChild
            >
              <Link
                href={`/customers/${customerId}/themes/${encodeURIComponent(item.themeId)}`}
              >
                <Pencil className="size-4" />
              </Link>
            </Button>
            {!active ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8 text-muted-foreground hover:bg-muted"
                title="Set as active theme"
                aria-label={`Set ${item.themeName} as active`}
                disabled={!canActivate || activating}
                onClick={onActivate}
              >
                {activating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CircleCheck className="size-4" />
                )}
              </Button>
            ) : null}
            {!active ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8 text-red-600 hover:bg-red-50 disabled:opacity-40"
                title="Delete theme"
                aria-label={`Delete ${item.themeName}`}
                disabled={!canDelete || deleting}
                onClick={onDelete}
              >
                {deleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
