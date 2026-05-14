'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { customersApi } from '@/lib/api/customers.api';
import { themesApi } from '@/lib/api/themes.api';
import { getApiErrorMessage } from '@/lib/api/client';
import { useThemeEditorStore } from '@/stores/theme-editor.store';
import { CategoryNav } from '@/components/theme-editor/CategoryNav';
import { TokenList } from '@/components/theme-editor/TokenList';
import { ColourEditorPanel } from '@/components/theme-editor/ColourEditorPanel';

export interface ThemeEditorShellProps {
  customerId: string;
  themeId: string;
  customerName: string;
}

export function ThemeEditorShell({
  customerId,
  themeId,
  customerName,
}: ThemeEditorShellProps) {
  const router = useRouter();
  const initRef = useRef(false);

  const themeQuery = useQuery({
    queryKey: ['theme-editor-theme', customerId, themeId],
    queryFn: () => themesApi.getById(customerId, themeId),
    enabled: !!customerId && !!themeId,
  });

  const customerQuery = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => customersApi.get(customerId),
    enabled: !!customerId,
  });

  const initialise = useThemeEditorStore((s) => s.initialise);
  const themeName = useThemeEditorStore((s) => s.themeName);
  const setStoreThemeName = useThemeEditorStore((s) => s.setThemeName);
  const isDirty = useThemeEditorStore((s) => s.isDirty);
  const isSaving = useThemeEditorStore((s) => s.isSaving);
  const isActive = useThemeEditorStore((s) => s.isActive);
  const resetAll = useThemeEditorStore((s) => s.resetAll);
  const discard = useThemeEditorStore((s) => s.discard);
  const save = useThemeEditorStore((s) => s.save);
  const activate = useThemeEditorStore((s) => s.activate);
  const colourOverrides = useThemeEditorStore((s) => s.colourOverrides);
  const fontFamilyOverrides = useThemeEditorStore((s) => s.fontFamilyOverrides);
  const fontSizeOverrides = useThemeEditorStore((s) => s.fontSizeOverrides);

  const [editingName, setEditingName] = useState(false);

  useEffect(() => {
    initRef.current = false;
  }, [customerId, themeId]);

  useEffect(() => {
    const data = themeQuery.data;
    if (!data || initRef.current) return;
    initRef.current = true;
    initialise(
      customerId,
      data.themeId,
      data.themeName,
      data.isActive,
      data.version,
      data.tokens,
      data.font_tokens.families,
      data.font_tokens.sizes
    );
  }, [themeQuery.data, customerId, initialise]);

  const displayCustomerName =
    customerQuery.data?.companyName ?? customerName;

  const handleSave = async () => {
    try {
      await save();
      void themeQuery.refetch();
      toast.success('Theme saved');
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  const handleActivate = async () => {
    if (!window.confirm('Activate this theme for the customer?')) return;
    try {
      await activate();
      toast.success('Theme activated');
      void themeQuery.refetch();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  const handleDiscard = () => {
    if (!isDirty) return;
    if (!window.confirm('Discard unsaved changes?')) return;
    discard();
    void themeQuery.refetch();
    router.back();
  };

  const handleResetAll = () => {
    if (!window.confirm('Reset all overrides to defaults?')) return;
    resetAll();
  };

  if (themeQuery.isPending) {
    return (
      <div className="flex h-screen flex-col bg-[#F9FAFB]">
        <div className="h-14 shrink-0 animate-pulse border-b bg-white" />
        <div className="flex flex-1 gap-0">
          <div className="w-[260px] shrink-0 animate-pulse bg-[#111827]" />
          <div className="flex-1 animate-pulse bg-[#F3F4F6]" />
          <div className="w-80 shrink-0 animate-pulse bg-white" />
        </div>
      </div>
    );
  }

  if (themeQuery.isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-white px-6">
        <p className="text-sm text-destructive">{getApiErrorMessage(themeQuery.error)}</p>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const count =
    Object.keys(colourOverrides).length +
    Object.keys(fontFamilyOverrides).length +
    Object.keys(fontSizeOverrides).length;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <header className="grid h-14 shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 border-b border-[#E2E8F0] bg-white px-6">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <Link href="/customers" className="text-[#6B7280] hover:text-[#0F172A]">
            Customers
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-[#9CA3AF]" />
          <Link
            href={`/customers/${customerId}`}
            className="truncate text-[#6B7280] hover:text-[#0F172A]"
          >
            {displayCustomerName}
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-[#9CA3AF]" />
          <Link
            href={`/customers/${customerId}`}
            className="text-[#6B7280] hover:text-[#0F172A]"
          >
            Themes
          </Link>
        </div>

        <div className="flex shrink-0 justify-center px-2">
          {!editingName ? (
            <button
              type="button"
              className="flex max-w-[min(100vw,24rem)] items-center gap-1.5 truncate text-base font-semibold text-[#0F172A]"
              onClick={() => setEditingName(true)}
            >
              <span className="truncate">{themeName}</span>
              <Pencil className="size-3.5 shrink-0 text-[#9CA3AF]" />
            </button>
          ) : (
            <Input
              autoFocus
              value={themeName}
              onChange={(e) => setStoreThemeName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setEditingName(false);
              }}
              className="max-w-xs text-center text-base font-semibold"
            />
          )}
        </div>

        <div className="flex min-w-0 items-center justify-end gap-3">
          {count > 0 ? (
            <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 font-mono text-[11px] text-[#64748B]">
              {count} overrides
            </span>
          ) : null}
          <button
            type="button"
            className="text-[13px] font-medium text-[#DC2626] hover:underline"
            onClick={handleResetAll}
          >
            Reset all
          </button>
          <span className="h-6 w-px bg-[#E2E8F0]" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!isDirty}
            onClick={handleDiscard}
          >
            Discard
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
            disabled={!isDirty || isSaving}
            onClick={() => void handleSave()}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-1 size-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              'Save theme'
            )}
          </Button>
          {isActive ? (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              Active
            </span>
          ) : (
            <Button
              type="button"
              size="sm"
              className="bg-emerald-600 font-medium text-white hover:bg-emerald-700"
              onClick={() => void handleActivate()}
            >
              Activate
            </Button>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <CategoryNav />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#F9FAFB] p-6">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
            <TokenList />
          </div>
        </div>
        <div className="h-full min-h-0 w-80 shrink-0 overflow-y-auto border-l border-[#E2E8F0] bg-white">
          <ColourEditorPanel />
        </div>
      </div>
    </div>
  );
}
