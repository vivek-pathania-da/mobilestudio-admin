'use client';

import { useEffect, useMemo, useState } from 'react';
import { Palette } from 'lucide-react';
import { DEFAULT_THEME } from '@/lib/theme-editor/default-theme';
import {
  findTokenCategory,
  hexToRgb,
  isTransparent,
  isValidHex,
  normalizeHexColor,
  rgbToHex,
  toFullyTransparentHex,
} from '@/lib/theme-editor/theme-editor.utils';
import { useThemeEditorStore } from '@/stores/theme-editor.store';
import { ColourPicker } from '@/components/theme-editor/ColourPicker';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { cn } from '@/lib/utils';

const CHECKERBOARD_STYLE = {
  backgroundImage:
    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
  backgroundColor: '#fff',
} as const;

export function ColourEditorPanel() {
  const selectedTokenKey = useThemeEditorStore((s) => s.selectedTokenKey);
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
      <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-white">
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
  const transparent = isTransparent(currentValue);

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-white">
      <div className="shrink-0 border-b border-border px-4 py-4">
        <p className="text-[10px] font-medium tracking-[0.2em] text-[#9CA3AF] uppercase">
          Colour editor
        </p>
      </div>

      <div className="shrink-0 border-b border-border px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {meta?.categoryId ? (
            <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 font-mono text-[11px] text-[#475569] uppercase">
              {meta.categoryId}
            </span>
          ) : null}
          {meta?.subcategoryLabel ? (
            <span className="rounded-full border border-border bg-gray-50 px-2 py-0.5 text-[11px] text-foreground">
              {meta.subcategoryLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-2 font-mono text-sm font-semibold text-foreground">{tokenKey}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <ColourPicker
          value={currentValue}
          onChange={(hex) => setTokenValue(tokenKey, hex)}
        />

        <button
          type="button"
          className={cn(
            'mt-4 w-full rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
            transparent
              ? 'border-border bg-gray-50 text-foreground'
              : 'border-border bg-white text-[#374151] hover:bg-[#F9FAFB]'
          )}
          onClick={() =>
            setTokenValue(
              tokenKey,
              toFullyTransparentHex(currentValue, defaultValue)
            )
          }
        >
          Set fully transparent
        </button>

        <div className="mt-4 flex gap-3">
          <div className="min-w-0 flex-1">
            <label className="mb-1 block text-[10px] font-medium tracking-wide text-[#9CA3AF] uppercase">
              Hex
            </label>
            <div className="flex overflow-hidden rounded-lg border border-border">
              <span className="shrink-0 border-r border-border bg-muted px-2 py-1.5 text-sm text-[#9CA3AF]">
                #
              </span>
              <HexField
                currentValue={currentValue}
                onCommit={(hex) => setTokenValue(tokenKey, normalizeHexColor(hex))}
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <label className="mb-1 block text-[10px] font-medium tracking-wide text-[#9CA3AF] uppercase">
              RGBA
            </label>
            <RgbaFields
              rgba={rgba}
              onCommit={(r, g, b, a) => {
                setTokenValue(
                  tokenKey,
                  a === 0 ? rgbToHex(r, g, b, 0) : rgbToHex(r, g, b, a)
                );
              }}
            />
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <p className="text-[10px] font-medium tracking-wide text-[#9CA3AF] uppercase">
            Default value
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="size-5 shrink-0 rounded-full border border-border"
              style={
                isTransparent(defaultValue)
                  ? CHECKERBOARD_STYLE
                  : { backgroundColor: defaultValue }
              }
            />
            <span className="font-mono text-[13px] text-[#6B7280]">
              {isTransparent(defaultValue) ? 'transparent' : defaultValue}
            </span>
            <span className="flex-1" />
            {isModified ? (
              <button
                type="button"
                className="cursor-pointer text-xs text-muted-foreground underline"
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

      <div className="shrink-0 border-t border-border px-3 py-3 text-center font-mono text-[11px] text-[#9CA3AF]">
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

function RgbaFields({
  rgba,
  onCommit,
}: {
  rgba: { r: number; g: number; b: number; a: number };
  onCommit: (r: number, g: number, b: number, a: number) => void;
}) {
  const [draft, setDraft] = useState({
    r: String(rgba.r),
    g: String(rgba.g),
    b: String(rgba.b),
    a: String(Math.round(rgba.a * 100)),
  });

  useEffect(() => {
    setDraft({
      r: String(rgba.r),
      g: String(rgba.g),
      b: String(rgba.b),
      a: String(Math.round(rgba.a * 100)),
    });
  }, [rgba.r, rgba.g, rgba.b, rgba.a]);

  const commit = () => {
    const r = clamp255(Number(draft.r));
    const g = clamp255(Number(draft.g));
    const b = clamp255(Number(draft.b));
    const a = Math.max(0, Math.min(100, Number(draft.a))) / 100;
    if ([r, g, b].some((n) => Number.isNaN(n)) || Number.isNaN(a)) return;
    onCommit(r, g, b, a);
  };

  return (
    <div className="grid grid-cols-4 gap-1">
      {(['r', 'g', 'b', 'a'] as const).map((ch) => (
        <input
          key={ch}
          type="text"
          inputMode="numeric"
          value={draft[ch]}
          aria-label={ch === 'a' ? 'Alpha percent' : ch.toUpperCase()}
          className="w-full rounded border border-border px-1 py-1.5 text-center font-mono text-[11px] outline-none focus:border-[var(--color-border-focus)]"
          onChange={(e) =>
            setDraft((d) => ({ ...d, [ch]: e.target.value.replace(/[^\d]/g, '') }))
          }
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
          }}
        />
      ))}
    </div>
  );
}

function clamp255(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(255, Math.round(n)));
}
