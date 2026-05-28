'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, Eye, Loader2, Pencil, Sparkles, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { customersApi } from '@/lib/api/customers.api';
import { themeTokensLookMissing } from '@/lib/api/theme-cache';
import { themesApi } from '@/lib/api/themes.api';
import { ensureAccessToken } from '@/lib/auth/refresh-access-token';
import { getApiErrorMessage } from '@/lib/api/client';
import { invalidateCustomerThemes } from '@/lib/query/invalidate-customer-themes';
import { useThemeEditorStore } from '@/stores/theme-editor.store';
import { CategoryNav } from '@/components/theme-editor/CategoryNav';
import { TokenList } from '@/components/theme-editor/TokenList';
import { ColourEditorPanel } from '@/components/theme-editor/ColourEditorPanel';
import { AiGeneratorModal } from '@/components/theme-editor/AiGeneratorModal';
import { ThemePreviewModal } from '@/components/theme-editor/ThemePreviewModal';

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
  const queryClient = useQueryClient();
  const initRef = useRef(false);

  const themesListQuery = useQuery({
    queryKey: ['themes', customerId],
    queryFn: () => themesApi.listByCustomer(customerId),
    enabled: !!customerId && !!themeId,
  });

  const themeMeta = themesListQuery.data?.find((t) => t.themeId === themeId);

  const themeQuery = useQuery({
    queryKey: ['theme-editor-theme', customerId, themeId],
    queryFn: async () => {
      await ensureAccessToken();
      return themesApi.getById(customerId, themeId);
    },
    enabled: !!customerId && !!themeId,
  });

  const tokensFailedToLoad =
    !!themeQuery.data &&
    themeTokensLookMissing(themeQuery.data, themeMeta?.overrideCount);

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
  const openAiModal = useThemeEditorStore((s) => s.openAiModal);
  const openPreviewModal = useThemeEditorStore((s) => s.openPreviewModal);
  const canUndoAi = useThemeEditorStore((s) => s.canUndoAi);
  const undoAiTheme = useThemeEditorStore((s) => s.undoAiTheme);
  const colourOverrides = useThemeEditorStore((s) => s.colourOverrides);
  const fontFamilyOverrides = useThemeEditorStore((s) => s.fontFamilyOverrides);
  const fontSizeOverrides = useThemeEditorStore((s) => s.fontSizeOverrides);
  const radiusOverrides = useThemeEditorStore((s) => s.radiusOverrides);

  const [editingName, setEditingName] = useState(false);
  const { confirm, dialogProps } = useConfirmDialog();

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
      data.font_tokens.sizes,
      data.radius_tokens?.tokens as Record<string, number> | undefined
    );
  }, [themeQuery.data, customerId, initialise]);

  const displayCustomerName =
    customerQuery.data?.companyName ?? customerName;

  const handleSave = async () => {
    try {
      const updated = await save();
      queryClient.setQueryData(
        ['theme-editor-theme', customerId, themeId],
        updated
      );
      invalidateCustomerThemes(queryClient, customerId);
      toast.success('Theme saved');
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  const handleActivate = async () => {
    const ok = await confirm({
      title: 'Activate this theme?',
      description:
        'This theme will become the active theme for the customer mobile app.',
      confirmLabel: 'Activate',
      variant: 'default',
    });
    if (!ok) return;
    try {
      await activate();
      invalidateCustomerThemes(queryClient, customerId);
      toast.success('Theme activated');
      void themeQuery.refetch();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  const handleDiscard = async () => {
    if (!isDirty) return;
    const ok = await confirm({
      title: 'Discard unsaved changes?',
      description: 'Your edits will be lost and cannot be recovered.',
      confirmLabel: 'Discard',
      variant: 'destructive',
    });
    if (!ok) return;
    discard();
    void themeQuery.refetch();
    router.back();
  };

  const handleResetAll = async () => {
    const ok = await confirm({
      title: 'Reset all overrides?',
      description: 'All token overrides will be cleared back to defaults.',
      confirmLabel: 'Reset all',
      variant: 'destructive',
    });
    if (!ok) return;
    resetAll();
  };

  if (themeQuery.isPending) {
    return (
      <div className="flex h-screen flex-col bg-[#F9FAFB]">
        <div className="h-14 shrink-0 animate-pulse border-b bg-white" />
        <div className="flex flex-1 gap-0">
          <div className="w-[260px] shrink-0 animate-pulse border-r border-border bg-white" />
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
    Object.keys(fontSizeOverrides).length +
    Object.keys(radiusOverrides).length;

  return (
    <>
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <header className="grid h-14 shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 border-b border-border bg-white px-6">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <Link href="/customers" className="text-[#6B7280] hover:text-foreground">
            Customers
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-[#9CA3AF]" />
          <Link
            href={`/customers/${customerId}`}
            className="truncate text-[#6B7280] hover:text-foreground"
          >
            {displayCustomerName}
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-[#9CA3AF]" />
          <Link
            href={`/customers/${customerId}`}
            className="text-[#6B7280] hover:text-foreground"
          >
            Themes
          </Link>
        </div>

        <div className="flex shrink-0 justify-center px-2">
          {!editingName ? (
            <button
              type="button"
              className="flex max-w-[min(100vw,24rem)] items-center gap-1.5 truncate text-base font-semibold text-foreground"
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
            onClick={() => void handleResetAll()}
          >
            Reset all
          </button>
          <span className="h-6 w-px bg-border" />
          {canUndoAi ? (
            <button
              type="button"
              onClick={undoAiTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                height: 36,
                padding: '0 14px',
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                background: '#FFF',
                cursor: 'pointer',
                fontSize: 13,
                color: '#374151',
                fontFamily: 'inherit',
              }}
            >
              <Undo2 size={14} />
              Undo AI
            </button>
          ) : null}
          <button
            type="button"
            onClick={openPreviewModal}
            aria-label="Preview theme"
            title="Preview"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              padding: 0,
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: '#FFF',
              cursor: 'pointer',
              color: '#374151',
              flexShrink: 0,
            }}
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            onClick={openAiModal}
            aria-label="Generate with AI"
            title="Generate with AI"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              padding: 0,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              color: '#FFFFFF',
              flexShrink: 0,
              background: 'var(--color-primary)',
            }}
          >
            <Sparkles size={16} />
          </button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!isDirty}
            onClick={() => void handleDiscard()}
          >
            Discard
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-border text-foreground hover:bg-muted"
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
            <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
              Active
            </span>
          ) : (
            <Button
              type="button"
              size="sm"
              className="bg-primary font-medium text-primary-foreground hover:bg-[var(--color-primary-hover)]"
              onClick={() => void handleActivate()}
            >
              Activate
            </Button>
          )}
        </div>
      </header>

      {tokensFailedToLoad ? (
        <div
          className="shrink-0 border-b border-amber-200 bg-amber-50 px-6 py-2.5 text-sm text-amber-950"
          role="alert"
        >
          Saved overrides for this theme could not be loaded. You are seeing
          default colours only. Try signing out and back in, then reopen this
          theme. Avoid saving or you may overwrite custom colours on the server.
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <CategoryNav />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#F9FAFB] p-6">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm">
            <TokenList />
          </div>
        </div>
        <div className="h-full min-h-0 w-80 shrink-0 overflow-y-auto border-l border-border bg-white">
          <ColourEditorPanel />
        </div>
      </div>
    </div>
    <AiGeneratorModal />
    <ThemePreviewModal />
    {dialogProps ? <ConfirmDialog {...dialogProps} /> : null}
    </>
  );
}
