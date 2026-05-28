'use client';

import { useEffect, useMemo, useState } from 'react';
import { Palette } from 'lucide-react';
import {
  DEFAULT_THEME,
  DEFAULT_RADIUS_TOKENS,
  RADIUS_TOKEN_LABELS,
  COMPONENT_RADIUS_KEYS,
} from '@/lib/theme-editor/default-theme';
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
  const selectedCategoryId = useThemeEditorStore((s) => s.selectedCategoryId);
  const selectedTokenKey = useThemeEditorStore((s) => s.selectedTokenKey);
  const colourOverrides = useThemeEditorStore((s) => s.colourOverrides);
  const setTokenValue = useThemeEditorStore((s) => s.setTokenValue);
  const resetToken = useThemeEditorStore((s) => s.resetToken);
  const getRadiusValue = useThemeEditorStore((s) => s.getRadiusValue);
  const radiusOverrides = useThemeEditorStore((s) => s.radiusOverrides);
  const resetRadiusToken = useThemeEditorStore((s) => s.resetRadiusToken);

  const isShape = selectedCategoryId === 'shape';

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
          <p className="mt-3 text-sm text-[#6B7280]">
            {isShape ? 'Shape preview' : 'Select a colour token'}
          </p>
          <p className="mt-1 text-xs text-[#9CA3AF]">
            {isShape
              ? 'Use a slider or personality preset on the left'
              : 'Click any colour swatch to edit'}
          </p>
        </div>
      </aside>
    );
  }

  if (isShape && COMPONENT_RADIUS_KEYS.includes(selectedTokenKey as (typeof COMPONENT_RADIUS_KEYS)[number])) {
    const tokenKey = selectedTokenKey;
    const radiusValue = getRadiusValue(tokenKey);
    const isPill = radiusValue === 9999;
    const defaultValue = DEFAULT_RADIUS_TOKENS[tokenKey] ?? 0;
    const isModified =
      tokenKey in radiusOverrides &&
      radiusOverrides[tokenKey] !== DEFAULT_RADIUS_TOKENS[tokenKey];

    const radiusForBox = isPill ? 9999 : radiusValue;
    const cap = (px: number, max: number) => Math.min(px, max);

    const Preview = () => {
      if (tokenKey === 'radiusButton') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                width: 160,
                height: 44,
                background: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
                borderRadius: radiusForBox,
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-radius 0.15s ease',
                userSelect: 'none',
              }}
            >
              Button
            </div>
            <div
              style={{
                width: 160,
                height: 44,
                background: '#FFFFFF',
                border: '1.5px solid var(--color-primary)',
                color: 'var(--color-primary)',
                borderRadius: radiusForBox,
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-radius 0.15s ease',
                userSelect: 'none',
              }}
            >
              Outlined
            </div>
          </div>
        );
      }

      if (tokenKey === 'radiusInput') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                width: 200,
                height: 40,
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: radiusForBox,
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                color: '#9CA3AF',
                fontSize: 12,
                transition: 'border-radius 0.15s ease',
              }}
            >
              Enter value...
            </div>
            <div
              style={{
                width: 200,
                height: 40,
                background: '#FFFFFF',
                border: '1.5px solid var(--color-primary)',
                borderRadius: radiusForBox,
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                color: '#9CA3AF',
                fontSize: 12,
                transition: 'border-radius 0.15s ease',
              }}
            >
              Focused
            </div>
          </div>
        );
      }

      if (tokenKey === 'radiusCard') {
        const r = isPill ? 24 : cap(radiusValue, 24);
        return (
          <div
            style={{
              width: 200,
              height: 80,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: r,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              padding: 12,
              transition: 'border-radius 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                height: 10,
                width: '70%',
                borderRadius: 6,
                background: 'linear-gradient(90deg, #F1F5F9, #E2E8F0, #F1F5F9)',
                backgroundSize: '200% 100%',
              }}
            />
            <div
              style={{
                height: 10,
                width: '55%',
                borderRadius: 6,
                background: 'linear-gradient(90deg, #F1F5F9, #E2E8F0, #F1F5F9)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        );
      }

      if (tokenKey === 'radiusModal') {
        const r = isPill ? 28 : cap(radiusValue, 28);
        return (
          <div
            style={{
              width: 200,
              height: 100,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: r,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              transition: 'border-radius 0.15s ease',
            }}
          >
            <div
              style={{
                height: 28,
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                borderTopLeftRadius: r,
                borderTopRightRadius: r,
              }}
            />
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  height: 10,
                  width: '72%',
                  borderRadius: 6,
                  background: '#E2E8F0',
                }}
              />
              <div
                style={{
                  height: 10,
                  width: '48%',
                  borderRadius: 6,
                  background: '#F1F5F9',
                }}
              />
            </div>
          </div>
        );
      }

      if (tokenKey === 'radiusChip') {
        const r = radiusForBox;
        const chipStyle = (active?: boolean) => ({
          width: 52,
          height: 24,
          borderRadius: r,
          border: '1px solid #E2E8F0',
          background: active ? 'var(--color-primary)' : '#F8FAFC',
          color: active ? 'var(--color-primary-foreground)' : '#374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 500,
          transition: 'border-radius 0.15s ease',
          userSelect: 'none' as const,
        });
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={chipStyle(false)}>Tag</div>
            <div style={chipStyle(false)}>Filter</div>
            <div style={chipStyle(true)}>Active</div>
          </div>
        );
      }

      if (tokenKey === 'radiusBottomSheet') {
        const r = isPill ? 32 : cap(radiusValue, 32);
        return (
          <div
            style={{
              width: 200,
              height: 80,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: `${r}px ${r}px 0 0`,
              transition: 'border-radius 0.15s ease',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: 32,
                height: 3,
                borderRadius: 999,
                background: '#E2E8F0',
                margin: '8px auto 0',
              }}
            />
          </div>
        );
      }

      return null;
    };

    return (
      <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-white">
        <div className="shrink-0 border-b border-border px-4 py-4">
          <p className="text-[10px] font-medium tracking-[0.2em] text-[#9CA3AF] uppercase">
            Shape editor
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', margin: 0 }}>
              {RADIUS_TOKEN_LABELS[tokenKey] ?? tokenKey}
            </p>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>
              {tokenKey}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Preview />
          </div>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            {isPill ? (
              <span style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>
                Pill
              </span>
            ) : (
              <>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#0F172A' }}>
                  {radiusValue}
                </span>
                <span style={{ fontSize: 14, color: '#9CA3AF', marginLeft: 4 }}>
                  dp
                </span>
              </>
            )}
          </div>

          <div style={{ marginTop: 8, textAlign: 'center' }}>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>
              Default: {defaultValue === 9999 ? 'Pill' : `${defaultValue}dp`}
            </span>
            {isModified ? (
              <>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}> · </span>
                <button
                  type="button"
                  onClick={() => resetRadiusToken(tokenKey)}
                  style={{
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    fontSize: 11,
                    color: '#DC2626',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Reset to default →
                </button>
              </>
            ) : null}
          </div>
        </div>
        <div className="shrink-0 border-t border-border px-3 py-3 text-center font-mono text-[11px] text-[#9CA3AF]">
          ⌘S to save · Esc to close
        </div>
      </aside>
    );
  }

  if (isShape) {
    return (
      <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-white">
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <Palette className="size-8 text-[#9CA3AF]" />
          <p className="mt-3 text-sm text-[#6B7280]">Shape preview</p>
          <p className="mt-1 text-xs text-[#9CA3AF]">
            Select a component slider to preview
          </p>
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
