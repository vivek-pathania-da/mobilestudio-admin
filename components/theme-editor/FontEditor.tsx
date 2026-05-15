'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  DEFAULT_FONT_FAMILIES,
  DEFAULT_FONT_SIZES,
} from '@/lib/theme-editor/default-theme';
import { useThemeEditorStore } from '@/stores/theme-editor.store';
import { cn } from '@/lib/utils';

function clampSize(n: number): number {
  return Math.max(8, Math.min(96, Math.round(n)));
}

export function FontEditor() {
  const fontFamilyOverrides = useThemeEditorStore((s) => s.fontFamilyOverrides);
  const fontSizeOverrides = useThemeEditorStore((s) => s.fontSizeOverrides);
  const setFontFamily = useThemeEditorStore((s) => s.setFontFamily);
  const setFontSize = useThemeEditorStore((s) => s.setFontSize);

  const familyKeys = Object.keys(DEFAULT_FONT_FAMILIES);
  const sizeKeys = Object.keys(DEFAULT_FONT_SIZES);

  return (
    <div className="p-6">
      <section>
        <h3 className="mb-3 text-[10px] font-medium tracking-[0.2em] text-[#9CA3AF] uppercase">
          Font families
        </h3>
        <div className="rounded-lg border border-border bg-white">
          {familyKeys.map((key) => {
            const value =
              fontFamilyOverrides[key] ?? DEFAULT_FONT_FAMILIES[key] ?? '';
            const modified = key in fontFamilyOverrides;
            return (
              <div
                key={key}
                className="flex h-11 items-center gap-3 border-b border-border px-3 last:border-b-0"
              >
                <span className="w-28 shrink-0 font-mono text-[13px] text-[#374151]">
                  {key}
                </span>
                <input
                  type="text"
                  value={value}
                  placeholder={DEFAULT_FONT_FAMILIES[key]}
                  onChange={(e) => setFontFamily(key, e.target.value)}
                  className="min-w-0 flex-1 rounded-md border border-border px-3 py-1.5 font-mono text-[13px] focus:border-[var(--color-border-focus)] focus:outline-none"
                />
                <span
                  className={cn(
                    'size-2 shrink-0 rounded-full',
                    modified ? 'bg-[#47CD89]' : 'bg-transparent'
                  )}
                />
              </div>
            );
          })}
        </div>
      </section>

      <hr className="my-6 border-border" />

      <section>
        <h3 className="mb-1 text-[10px] font-medium tracking-[0.2em] text-[#9CA3AF] uppercase">
          Font sizes
        </h3>
        <p className="mb-3 text-xs text-[#9CA3AF]">
          Values in dp/sp — used directly in the Flutter app
        </p>
        <div className="grid grid-cols-2 gap-3">
          {sizeKeys.map((key) => {
            const value =
              fontSizeOverrides[key] ?? DEFAULT_FONT_SIZES[key] ?? 14;
            const modified = key in fontSizeOverrides;
            return (
              <div
                key={key}
                className="flex items-center gap-2 rounded-md border border-border bg-white p-2"
              >
                <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-[#6B7280]">
                  {key}
                </span>
                <input
                  type="number"
                  min={8}
                  max={96}
                  step={1}
                  value={value}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === '') return;
                    const n = Number(v);
                    if (Number.isFinite(n)) {
                      setFontSize(key, clampSize(n));
                    }
                  }}
                  className="w-14 shrink-0 rounded-md border border-border px-1 py-1 text-center font-mono text-[13px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <div className="flex shrink-0 flex-col gap-0">
                  <button
                    type="button"
                    className="text-[#6B7280] hover:text-foreground"
                    aria-label="Increase"
                    onClick={() => setFontSize(key, clampSize(value + 1))}
                  >
                    <ChevronUp className="size-3" />
                  </button>
                  <button
                    type="button"
                    className="text-[#6B7280] hover:text-foreground"
                    aria-label="Decrease"
                    onClick={() => setFontSize(key, clampSize(value - 1))}
                  >
                    <ChevronDown className="size-3" />
                  </button>
                </div>
                <span
                  className={cn(
                    'ml-1 size-2 shrink-0 rounded-full',
                    modified ? 'bg-[#47CD89]' : 'bg-transparent'
                  )}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
