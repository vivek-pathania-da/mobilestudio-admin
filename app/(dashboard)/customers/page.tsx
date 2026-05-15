'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Plus,
  Search,
  UserX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthHydration } from '@/hooks/use-auth-hydration';
import { useAuthStore } from '@/stores/auth.store';
import { customersApi } from '@/lib/api/customers.api';
import { getApiErrorMessage } from '@/lib/api/client';
import type { Customer, CustomerStatus } from '@/types/api';
import { AddCustomerDialog, ChurnCustomerDialog } from '@/components/customers/customer-dialogs';
import { statusConfig } from '@/lib/design-system';
import { formatPaginationSummary } from '@/lib/dashboard-utils';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 5;

function formatListDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function industryBadgeClass(_industry: string): string {
  return 'border-gray-200 bg-gray-50 text-foreground';
}

function industryBadgeLabel(industry: string): string {
  const t = industry.trim();
  return t ? t.toUpperCase() : '—';
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

export default function CustomersPage() {
  const router = useRouter();
  const ready = useAuthHydration();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [churnCustomer, setChurnCustomer] = useState<Customer | null>(null);

  const apiStatus: CustomerStatus | undefined =
    statusFilter === 'all' ? undefined : (statusFilter as CustomerStatus);

  const {
    data: customers = [],
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['customers', apiStatus ?? 'all'],
    queryFn: () =>
      customersApi.list(
        apiStatus !== undefined ? { status: apiStatus } : undefined
      ),
    enabled: ready && isAuthenticated,
  });

  const industryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of customers) {
      const v = c.industry?.trim();
      if (v) set.add(v);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [customers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((row: Customer) => {
      if (industryFilter !== 'all') {
        const ind = (row.industry ?? '').trim();
        if (
          ind.toLowerCase() !== industryFilter.trim().toLowerCase()
        ) {
          return false;
        }
      }
      if (!q) return true;
      const blob = [
        row.companyName,
        row.customerCode,
        row.customerId,
        row.contactName,
        row.primaryEmail,
        row.industry,
      ]
        .join(' ')
        .toLowerCase();
      return blob.includes(q);
    });
  }, [customers, search, industryFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, industryFilter]);

  useEffect(() => {
    if (industryFilter === 'all') return;
    if (!industryOptions.some((o) => o === industryFilter)) {
      setIndustryFilter('all');
    }
  }, [industryOptions, industryFilter]);

  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  const showingFrom = total === 0 ? 0 : startIdx + 1;
  const showingTo = Math.min(startIdx + PAGE_SIZE, total);

  const pageNumbers = useMemo((): (number | 'ellipsis')[] => {
    const last = totalPages;
    const cur = safePage;
    if (last <= 7) {
      return Array.from({ length: last }, (_, i) => i + 1);
    }
    if (cur <= 3) {
      return [1, 2, 3, 'ellipsis', last];
    }
    if (cur >= last - 2) {
      return [1, 'ellipsis', last - 2, last - 1, last];
    }
    return [1, 'ellipsis', cur - 1, cur, cur + 1, 'ellipsis', last];
  }, [totalPages, safePage]);

  const showTableLoading = !ready || !isAuthenticated || isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold tracking-tight md:text-3xl"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Customers
        </h1>
        <p
          className="mt-1 text-sm md:text-base"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Manage your white-label clients
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8"
              aria-label="Search customers"
              disabled={showTableLoading || isError}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              disabled={showTableLoading || isError}
            >
              <SelectTrigger className="h-9 w-full min-w-[140px] sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="churned">Churned</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={industryFilter}
              onValueChange={setIndustryFilter}
              disabled={showTableLoading || isError || industryOptions.length === 0}
            >
              <SelectTrigger className="h-9 w-full min-w-[160px] sm:w-[180px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industryOptions.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          className="h-9 shrink-0 gap-1.5 font-semibold"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
          }}
          type="button"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="size-4" />
          Add Customer
        </Button>
      </div>

      {isError ? (
        <Card
          className="border p-6 shadow-sm"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p className="text-sm font-medium text-destructive">
            {getApiErrorMessage(error)}
          </p>
          <p
            className="mt-2 text-sm"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Check that you are signed in as an admin and that{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              NEXT_PUBLIC_API_URL
            </code>{' '}
            points at your API (e.g. …/dev).
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </Card>
      ) : null}

      <Card
        className="overflow-hidden border shadow-sm"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <CardContent className="relative px-0 pb-0">
          {isFetching && !isPending ? (
            <div className="absolute top-2 right-4 z-10 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Updating…
            </div>
          ) : null}
          <Table>
            <TableHeader>
              <TableRow
                className="hover:bg-transparent"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <TableHead
                  className="admin-section-label h-11 pl-6 font-medium"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Customer
                </TableHead>
                <TableHead
                  className="admin-section-label h-11 font-medium"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Industry
                </TableHead>
                <TableHead
                  className="admin-section-label h-11 font-medium"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Contact
                </TableHead>
                <TableHead
                  className="admin-section-label h-11 font-medium"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Status
                </TableHead>
                <TableHead
                  className="admin-section-label h-11 font-medium"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Created Date
                </TableHead>
                <TableHead
                  className="admin-section-label h-11 w-12 pr-6 text-right font-medium"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showTableLoading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="py-4 pl-6">
                      <div className="h-10 animate-pulse rounded-md bg-muted" />
                    </TableCell>
                  </TableRow>
                ))
              ) : pageRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No customers match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row) => (
                  <TableRow
                    key={row.customerId}
                    className="cursor-pointer hover:bg-[var(--color-primary-light)]"
                    style={{ borderColor: 'var(--color-border)' }}
                    onClick={() => router.push(`/customers/${row.customerId}`)}
                  >
                    <TableCell className="pl-6">
                      <div
                          className="font-semibold"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {row.companyName}
                        </div>
                      <div
                        className="text-xs"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        Code:{' '}
                        <span className="font-medium text-foreground/80">
                          {row.customerCode}
                        </span>
                      </div>
                      <div
                        className="mt-0.5 break-all font-mono text-[11px] leading-snug"
                        style={{ color: 'var(--color-text-tertiary)' }}
                        title={row.customerId}
                      >
                        UUID: {row.customerId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
                          industryBadgeClass(row.industry)
                        )}
                      >
                        {industryBadgeLabel(row.industry)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div
                        className="font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {row.contactName}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {row.primaryEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          row.status === 'active' ? 'default' : 'outline'
                        }
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
                          row.status !== 'active' && statusBadgeClass(row.status)
                        )}
                      >
                        {statusLabel(row.status)}
                      </Badge>
                    </TableCell>
                    <TableCell
                      style={{ color: 'var(--color-text-secondary)' }}
                      className="text-sm"
                    >
                      {formatListDate(row.createdAt)}
                    </TableCell>
                    <TableCell
                      className="pr-6 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={`Details for ${row.companyName}`}
                          title="Details"
                          onClick={() =>
                            router.push(`/customers/${row.customerId}`)
                          }
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                          aria-label={`Churn ${row.companyName}`}
                          title="Churn"
                          disabled={row.status !== 'active'}
                          onClick={() => setChurnCustomer(row)}
                        >
                          <UserX className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter
          className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p className="text-sm text-muted-foreground">
            {formatPaginationSummary(total, showingFrom, showingTo)}
          </p>
          {totalPages > 1 ? (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-8"
              disabled={showTableLoading || isError || safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            {pageNumbers.map((p, idx) =>
              p === 'ellipsis' ? (
                <span
                  key={`e-${idx}`}
                  className="px-1 text-sm text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  type="button"
                  variant={p === safePage ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'min-w-8 px-2',
                    p === safePage &&
                      'pointer-events-none border-transparent font-semibold'
                  )}
                  style={
                    p === safePage
                      ? {
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-primary-foreground)',
                        }
                      : undefined
                  }
                  disabled={showTableLoading || isError}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-8"
              disabled={
                showTableLoading || isError || safePage >= totalPages
              }
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          ) : null}
        </CardFooter>
      </Card>

      <AddCustomerDialog open={addOpen} onOpenChange={setAddOpen} />
      <ChurnCustomerDialog
        customer={churnCustomer}
        open={churnCustomer !== null}
        onOpenChange={(o) => {
          if (!o) setChurnCustomer(null);
        }}
      />
    </div>
  );
}
