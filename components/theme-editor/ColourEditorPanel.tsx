'use client';

import { useEffect, useMemo, useState } from 'react';
import { Palette } from 'lucide-react';
import { DEFAULT_THEME } from '@/lib/theme-editor/default-theme';
import { findTokenCategory, hexToRgb, isValidHex } from '@/lib/theme-editor/theme-editor.utils';
import { useThemeEditorStore } from '@/stores/theme-editor.store';
import { ColourPicker } from '@/components/theme-editor/ColourPicker';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';

export function ColourEditorPanel() {
  const selectedTokenKey = useThemeEditorStore((s) => s.selectedTokenKey);
  /** Subscribe to data, not store methods — method refs are stable and skip re-renders. */
  const colourOverrides = useThemeEditorStore((s) => s.colourOverrides);
  const setTokenValue = useThemeEditorStore((s) => s.setTokenValue);
  const resetToken = useThemeEditorStore((s) => s.resetToken);

  const currentValue = useMemo(() => {
    if (!selectedTokenKey) return '';
    return (
      colourOverrides[selectedTokenKey] ??
      DEFAULT_THEME[selectedTokenKey] ??
      '#000000'
    );
  }, [selectedTokenKey, colourOverrides]);

  const isModified = selectedTokenKey
    ? Object.prototype.hasOwnProperty.call(colourOverrides, selectedTokenKey)
    : false;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        useThemeEditorStore.getState().selectToken(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void useThemeEditorStore
          .getState()
          .save()
          .catch((err) => toast.error(getApiErrorMessage(err)));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!selectedTokenKey) {
    return (
      <aside className="flex h-full w-80 shrink-0 flex-col border-l border-[#E2E8F0] bg-white">
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <Palette className="size-8 text-[#9CA3AF]" />
          <p className="mt-3 text-sm text-[#6B7280]">Select a colour token</p>
          <p className="mt-1 text-xs text-[#9CA3AF]">Click any colour swatch to edit</p>
        </div>
      </aside>
    );
  }

  const tokenKey = selectedTokenKey;
  const defaultValue = DEFAULT_THEME[tokenKey] ?? '#000000';
  const rgba = hexToRgb(currentValue);
  const meta = findTokenCategory(tokenKey);

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-[#E2E8F0] bg-white">
      <div className="shrink-0 border-b border-[#E2E8F0] px-4 py-4">
        <p className="text-[10px] font-medium tracking-[0.2em] text-[#9CA3AF] uppercase">
          Colour editor
        </p>
      </div>

      <div className="shrink-0 border-b border-[#E2E8F0] px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {meta?.categoryId ? (
            <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 font-mono text-[11px] text-[#475569] uppercase">
              {meta.categoryId}
            </span>
          ) : null}
          {meta?.subcategoryLabel ? (
            <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] text-[#1D4ED8]">
              {meta.subcategoryLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-2 font-mono text-sm font-semibold text-[#0F172A]">{tokenKey}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <ColourPicker
          value={currentValue}
          onChange={(hex6) => {
            const key = tokenKey;
            const row =
              useThemeEditorStore.getState().colourOverrides[key] ??
              DEFAULT_THEME[key] ??
              '#000000';
            if (/^#[0-9A-Fa-f]{8}$/i.test(row)) {
              setTokenValue(
                key,
                `${hex6.slice(0, 7)}${row.slice(7)}`.toUpperCase()
              );
            } else {
              setTokenValue(key, hex6.toUpperCase());
            }
          }}
        />

        <div className="mt-4 flex gap-3">
          <div className="min-w-0 flex-1">
            <label className="mb-1 block text-[10px] font-medium tracking-wide text-[#9CA3AF] uppercase">
              Hex
            </label>
            <div className="flex overflow-hidden rounded-lg border border-[#E2E8F0]">
              <span className="shrink-0 border-r border-[#E2E8F0] bg-muted px-2 py-1.5 text-sm text-[#9CA3AF]">
                #
              </span>
              <HexField
                currentValue={currentValue}
                onCommit={(hex) => setTokenValue(tokenKey, hex)}
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <label className="mb-1 block text-[10px] font-medium tracking-wide text-[#9CA3AF] uppercase">
              RGBA
            </label>
            <p className="py-1.5 font-mono text-[13px] text-[#374151]">
              {rgba.r}, {rgba.g}, {rgba.b}, {rgba.a}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-[#E2E8F0] pt-4">
          <p className="text-[10px] font-medium tracking-wide text-[#9CA3AF] uppercase">
            Default value
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="size-5 shrink-0 rounded border border-[#E2E8F0]"
              style={{ backgroundColor: defaultValue }}
            />
            <span className="font-mono text-[13px] text-[#6B7280]">{defaultValue}</span>
            <span className="flex-1" />
            {isModified ? (
              <button
                type="button"
                className="cursor-pointer text-xs text-[#2563EB] underline"
                onClick={() => resetToken(tokenKey)}
              >
                Reset to default
              </button>
            ) : (
              <span className="text-xs text-[#9CA3AF]">Same as default</span>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-[#E2E8F0] px-3 py-3 text-center font-mono text-[11px] text-[#9CA3AF]">
        ⌘S to save · Esc to close
      </div>
    </aside>
  );
}

function HexField({
  currentValue,
  onCommit,
}: {
  currentValue: string;
  onCommit: (hex: string) => void;
}) {
  const [draft, setDraft] = useState(() =>
    currentValue.replace(/^#/, '').toUpperCase()
  );
  useEffect(() => {
    setDraft(currentValue.replace(/^#/, '').toUpperCase());
  }, [currentValue]);
  return (
    <input
      type="text"
      value={draft}
      maxLength={8}
      className="min-w-0 flex-1 border-0 px-2 py-1.5 font-mono text-sm outline-none focus:ring-0"
      onChange={(e) => setDraft(e.target.value.replace(/#/g, '').toUpperCase())}
      onBlur={() => {
        const candidate = `#${draft}`;
        if (isValidHex(candidate)) {
          onCommit(candidate.toUpperCase());
        } else {
          setDraft(currentValue.replace(/^#/, '').toUpperCase());
        }
      }}
    />
  );
}
