'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { themesApi } from '@/lib/api/themes.api';
import { getApiErrorMessage } from '@/lib/api/client';

export default function NewThemePage() {
  const params = useParams();
  const router = useRouter();
  const customerId = typeof params.customerId === 'string' ? params.customerId : '';
  const [themeName, setThemeName] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      themesApi.create(customerId, {
        themeName: themeName.trim(),
        tokens: {},
      }),
    onSuccess: (data) => {
      toast.success('Theme created');
      router.push(
        `/customers/${customerId}/themes/${encodeURIComponent(data.themeId)}`
      );
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <div className="flex h-screen flex-col bg-[#F9FAFB]">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-6">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Link href="/customers" className="hover:text-[#0F172A]">
            Customers
          </Link>
          <ChevronRight className="size-3.5 text-[#9CA3AF]" />
          <Link
            href={`/customers/${customerId}`}
            className="hover:text-[#0F172A]"
          >
            Customer
          </Link>
          <ChevronRight className="size-3.5 text-[#9CA3AF]" />
          <span className="font-medium text-[#0F172A]">New theme</span>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </header>

      <main className="mx-auto mt-16 w-full max-w-[520px] flex-1 px-4 pb-16">
        <div className="mb-8 flex justify-center gap-4">
          {[
            { n: 1, label: 'Name your theme', active: true },
            { n: 2, label: 'Customise colours', active: false },
            { n: 3, label: 'Activate', active: false },
          ].map((step) => (
            <div key={step.n} className="flex flex-col items-center gap-2 text-center">
              <div
                className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold ${
                  step.active
                    ? 'bg-[#2563EB] text-white'
                    : 'border-2 border-[#E2E8F0] text-[#9CA3AF]'
                }`}
              >
                {step.n}
              </div>
              <span className="max-w-[100px] text-[11px] text-[#6B7280]">{step.label}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-md">
          <h1 className="text-center text-2xl font-bold text-[#0F172A]">
            Create a new theme
          </h1>
          <p className="mt-2 text-center text-sm text-[#6B7280]">
            Give your theme a name to get started.
          </p>

          <div className="mt-6">
            <Label className="text-[11px] font-medium tracking-wide text-[#6B7280] uppercase">
              Theme name *
            </Label>
            <Input
              autoFocus
              maxLength={100}
              placeholder="e.g. Ocean Blue, Dark Corporate"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              className="mt-2 h-11 rounded-lg text-base"
            />
            <p className="mt-1 text-right text-xs text-[#9CA3AF]">
              {themeName.length} / 100
            </p>
          </div>

          <hr className="my-6 border-[#E2E8F0]" />

          <p className="mb-3 text-[11px] font-medium tracking-wide text-[#6B7280] uppercase">
            Start from
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-lg border-2 border-[#2563EB] bg-[#EFF6FF] px-4 py-4 text-left text-sm font-medium text-[#1D4ED8]"
            >
              Default theme
            </button>
            <button
              type="button"
              disabled
              className="flex-1 cursor-not-allowed rounded-lg border border-[#E2E8F0] px-4 py-4 text-left text-sm text-[#9CA3AF]"
            >
              Copy existing
            </button>
          </div>

          <Button
            type="button"
            className="mt-6 h-11 w-full bg-[#2563EB] font-semibold text-white hover:bg-[#1D4ED8]"
            disabled={themeName.trim().length === 0 || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? 'Creating…' : 'Continue to editor →'}
          </Button>
        </div>

        <p className="mt-6 text-center text-[13px] text-[#9CA3AF]">
          All changes are auto-saved in the editor
        </p>
      </main>
    </div>
  );
}
