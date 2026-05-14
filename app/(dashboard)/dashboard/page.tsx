'use client';

import Link from 'next/link';
import { Activity, Building2, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthStore } from '@/stores/auth.store';

const metrics = [
  {
    label: 'Total Customers',
    value: '1,248',
    hint: '+12%',
    icon: Building2,
  },
  {
    label: 'Active',
    value: '942',
    sub: '75% total',
    badge: 'LIVE',
    badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    icon: Activity,
  },
  {
    label: 'Total Users',
    value: '8.4k',
    sub: 'Global',
    icon: Users,
  },
] as const;

const recentCustomers = [
  {
    company: 'Stellar AI',
    code: 'STE-01',
    industry: 'Technology',
    status: 'Active' as const,
    created: '2h ago',
  },
  {
    company: 'Nexus Media',
    code: 'NEX-44',
    industry: 'Entertainment',
    status: 'Churned' as const,
    created: '5h ago',
  },
  {
    company: 'GreenCloud',
    code: 'GRE-19',
    industry: 'Ecology',
    status: 'Active' as const,
    created: '1d ago',
  },
  {
    company: 'Velocity Corp',
    code: 'VEL-03',
    industry: 'Logistics',
    status: 'Churned' as const,
    created: '2d ago',
  },
];

function statusBadge(status: 'Active' | 'Churned') {
  if (status === 'Active') {
    return (
      <Badge
        variant="outline"
        className="border-emerald-200 bg-emerald-50 font-medium text-emerald-800"
      >
        <span
          className="mr-1.5 inline-block size-1.5 rounded-full"
          style={{ backgroundColor: 'var(--color-success)' }}
        />
        Active
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-slate-200 bg-slate-100 font-medium text-slate-700"
    >
      <span className="mr-1.5 inline-block size-1.5 rounded-full bg-slate-400" />
      Churned
    </Badge>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-2xl font-bold tracking-tight md:text-3xl"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Dashboard
        </h1>
        <p
          className="mt-1 text-sm md:text-base"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card
            key={m.label}
            className="border shadow-sm"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle
                className="admin-section-label font-normal"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {m.label}
              </CardTitle>
              <m.icon
                className="size-4 shrink-0"
                style={{ color: 'var(--color-text-tertiary)' }}
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold tracking-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {m.value}
              </div>
              {'hint' in m && m.hint ? (
                <p
                  className="mt-1 text-xs font-medium"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {m.hint}
                </p>
              ) : null}
              {'sub' in m && m.sub ? (
                <p
                  className="mt-1 text-xs"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {m.sub}
                </p>
              ) : null}
              {'badge' in m && m.badge ? (
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${m.badgeClass}`}
                  >
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-success)' }}
                    />
                    {m.badge}
                  </span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card
        className="border shadow-sm"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle
            className="text-base font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Recent Customers
          </CardTitle>
          <Link
            href="/customers"
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            See full list
          </Link>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <Table>
            <TableHeader>
              <TableRow
                className="hover:bg-transparent"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <TableHead
                  className="admin-section-label h-10 pl-6 font-medium"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Company
                </TableHead>
                <TableHead
                  className="admin-section-label h-10 font-medium"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Code
                </TableHead>
                <TableHead
                  className="admin-section-label h-10 font-medium"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Industry
                </TableHead>
                <TableHead
                  className="admin-section-label h-10 font-medium"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Status
                </TableHead>
                <TableHead
                  className="admin-section-label h-10 pr-6 text-right font-medium"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Created
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCustomers.map((row) => (
                <TableRow
                  key={row.code}
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <TableCell
                    className="pl-6 font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {row.company}
                  </TableCell>
                  <TableCell style={{ color: 'var(--color-text-secondary)' }}>
                    {row.code}
                  </TableCell>
                  <TableCell style={{ color: 'var(--color-text-secondary)' }}>
                    {row.industry}
                  </TableCell>
                  <TableCell>{statusBadge(row.status)}</TableCell>
                  <TableCell
                    className="pr-6 text-right"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {row.created}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
