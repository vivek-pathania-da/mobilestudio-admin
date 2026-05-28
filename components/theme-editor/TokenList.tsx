'use client';

import { useMemo } from 'react';
import { DEFAULT_THEME, DEFAULT_RADIUS_TOKENS, COMPONENT_RADIUS_KEYS } from '@/lib/theme-editor/default-theme';
import { TOKEN_CATEGORIES } from '@/lib/theme-editor/token-categories';
import { getCategoryTokenCount } from '@/lib/theme-editor/theme-editor.utils';
import { useThemeEditorStore } from '@/stores/theme-editor.store';
import { FontEditor } from '@/components/theme-editor/FontEditor';
import { TokenRow } from '@/components/theme-editor/TokenRow';

const COMPONENT_TOKENS = [
  { key: 'radiusButton', label: 'Button', max: 9999, pillable: true },
  { key: 'radiusInput', label: 'Input Field', max: 9999, pillable: true },
  { key: 'radiusCard', label: 'Card', max: 24, pillable: false },
  { key: 'radiusModal', label: 'Modal', max: 28, pillable: false },
  { key: 'radiusChip', label: 'Chip', max: 9999, pillable: true },
  { key: 'radiusBottomSheet', label: 'Bottom Sheet', max: 32, pillable: false },
  { key: 'radiusIconButton', label: 'Icon Button', max: 9999, pillable: true },
] as const;

const RADIUS_PRESETS = {
  sharp: {
    radiusButton: 4,
    radiusInput: 4,
    radiusCard: 4,
    radiusModal: 8,
    radiusChip: 4,
    radiusBottomSheet: 12,
    radiusIconButton: 4,
  },
  rounded: {
    radiusButton: 8,
    radiusInput: 8,
    radiusCard: 12,
    radiusModal: 16,
    radiusChip: 8,
    radiusBottomSheet: 24,
    radiusIconButton: 8,
  },
  soft: {
    radiusButton: 12,
    radiusInput: 12,
    radiusCard: 16,
    radiusModal: 24,
    radiusChip: 16,
    radiusBottomSheet: 32,
    radiusIconButton: 12,
  },
  pill: {
    radiusButton: 9999,
    radiusInput: 9999,
    radiusCard: 16,
    radiusModal: 24,
    radiusChip: 9999,
    radiusBottomSheet: 32,
    radiusIconButton: 9999,
  },
} as const;

type PresetId = keyof typeof RADIUS_PRESETS;

const PERSONALITY_CARDS: {
  id: PresetId;
  label: string;
  sublabel: string;
  btnR: number;
  cardR: number;
  chipR: number;
}[] = [
  { id: 'sharp', label: 'Sharp', sublabel: '0–4dp', btnR: 2, cardR: 2, chipR: 2 },
  { id: 'rounded', label: 'Rounded', sublabel: '6–10dp', btnR: 6, cardR: 6, chipR: 6 },
  { id: 'soft', label: 'Soft', sublabel: '12–20dp', btnR: 12, cardR: 12, chipR: 12 },
  { id: 'pill', label: 'Pill', sublabel: 'Full', btnR: 9999, cardR: 12, chipR: 9999 },
];

function presetMatchesValues(
  preset: PresetId,
  getRadiusValue: (key: string) => number
): boolean {
  const values = RADIUS_PRESETS[preset];
  return COMPONENT_TOKENS.every(({ key }) => getRadiusValue(key) === values[key]);
}

function PersonalityMockup({
  btnR,
  cardR,
  chipR,
}: {
  btnR: number;
  cardR: number;
  chipR: number;
}) {
  const btnRadius = btnR === 9999 ? 9999 : btnR;
  const cardRadius = Math.min(cardR, 8);
  const chipRadius = chipR === 9999 ? 9999 : chipR;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span
          style={{
            width: 36,
            height: 20,
            borderRadius: btnRadius,
            background: '#E2E8F0',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            width: 36,
            height: 20,
            borderRadius: btnRadius,
            background: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
            flexShrink: 0,
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span
          style={{
            flex: 1,
            height: 16,
            borderRadius: cardRadius,
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            boxSizing: 'border-box',
          }}
        />
        <span
          style={{
            width: 40,
            height: 16,
            borderRadius: chipRadius,
            background: '#F1F5F9',
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
}

function ComponentRadiusSlider({
  tokenKey,
  label,
  max,
  pillable,
  value,
  defaultValue,
  isModified,
  isSelected,
  onSelect,
  onChange,
  onReset,
  onTogglePill,
}: {
  tokenKey: string;
  label: string;
  max: number;
  pillable: boolean;
  value: number;
  defaultValue: number;
  isModified: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (v: number) => void;
  onReset: () => void;
  onTogglePill: () => void;
}) {
  const isPill = value === 9999;
  const sliderMax = max === 9999 ? 32 : max;
  const fillPct = isPill ? 100 : Math.round((value / sliderMax) * 100);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-selected={isSelected}
      style={{
        padding: '14px 16px',
        borderBottom: '1px solid #F8FAFC',
        borderLeft: isSelected
          ? '3px solid var(--color-border-strong)'
          : isModified
            ? '3px solid var(--color-primary)'
            : '3px solid transparent',
        background: isSelected ? 'var(--color-primary-light)' : 'transparent',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#0F172A',
            width: 100,
            flexShrink: 0,
            lineHeight: '20px',
          }}
        >
          {label}
        </span>

        <div
          style={{ flex: 1, maxWidth: 320 }}
          onClick={(e) => e.stopPropagation()}
        >
          {isPill ? (
            <div
              style={{
                height: 4,
                borderRadius: 9999,
                background: 'var(--color-primary, #47cd89)',
                width: '100%',
              }}
            />
          ) : (
            <input
              className="shape-range"
              type="range"
              min={0}
              max={sliderMax}
              step={1}
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value, 10))}
              aria-label={`${label} radius`}
              style={{
                width: '100%',
                accentColor: 'var(--color-primary, #47cd89)',
                background: `linear-gradient(to right, var(--color-primary, #47cd89) 0%, var(--color-primary, #47cd89) ${fillPct}%, #E2E8F0 ${fillPct}%, #E2E8F0 100%)`,
              }}
            />
          )}
        </div>

        <span
          style={{
            width: 52,
            flexShrink: 0,
            textAlign: 'center',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isPill ? (
            <span
              style={{
                background: '#0F172A',
                color: '#FFFFFF',
                fontSize: 10,
                padding: '2px 8px',
                borderRadius: 999,
                fontWeight: 600,
              }}
            >
              Pill
            </span>
          ) : (
            <span
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#374151',
                fontSize: 12,
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              {value}dp
            </span>
          )}
        </span>

        {pillable ? (
          <button
            type="button"
            aria-label={isPill ? `Disable pill for ${label}` : `Make ${label} pill`}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePill();
            }}
            style={{
              width: 24,
              height: 24,
              flexShrink: 0,
              borderRadius: '50%',
              background: isPill ? 'var(--color-primary, #47cd89)' : '#FFFFFF',
              border: isPill ? 'none' : '1px solid #E2E8F0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'inherit',
              lineHeight: 1,
            }}
            title="Make pill"
          >
            <span
              style={{
                fontSize: 10,
                color: isPill ? '#FFFFFF' : '#CBD5E1',
              }}
            >
              {isPill ? '●' : '○'}
            </span>
          </button>
        ) : null}

        {isModified ? (
          <button
            type="button"
            aria-label={`Reset ${label} radius`}
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            style={{
              width: 24,
              height: 24,
              flexShrink: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94A3B8';
            }}
            title="Reset to default"
          >
            ↺
          </button>
        ) : (
          <span style={{ width: 24, height: 24, flexShrink: 0 }} />
        )}
      </div>
    </div>
  );
}

export function TokenList() {
  const selectedCategoryId = useThemeEditorStore((s) => s.selectedCategoryId);
  const category = TOKEN_CATEGORIES.find((c) => c.id === selectedCategoryId);
  const resetCategory = useThemeEditorStore((s) => s.resetCategory);
  const colourOverrides = useThemeEditorStore((s) => s.colourOverrides);
  const selectedTokenKey = useThemeEditorStore((s) => s.selectedTokenKey);
  const selectToken = useThemeEditorStore((s) => s.selectToken);
  const resetToken = useThemeEditorStore((s) => s.resetToken);
  const radiusOverrides = useThemeEditorStore((s) => s.radiusOverrides);
  const setRadiusToken = useThemeEditorStore((s) => s.setRadiusToken);
  const resetRadiusToken = useThemeEditorStore((s) => s.resetRadiusToken);
  const getRadiusValue = useThemeEditorStore((s) => s.getRadiusValue);

  const isShape = selectedCategoryId === 'shape';
  const isTypography = selectedCategoryId === 'typography';

  const activePreset = useMemo(() => {
    if (!isShape) return null;
    for (const card of PERSONALITY_CARDS) {
      if (presetMatchesValues(card.id, getRadiusValue)) return card.id;
    }
    return null;
  }, [isShape, radiusOverrides]);

  if (!category && !isShape) return null;

  const count = getCategoryTokenCount(isShape ? 'shape' : category!.id);
  const label = isShape ? 'Shape' : category!.label;

  function applyRadiusPreset(preset: PresetId) {
    const values = RADIUS_PRESETS[preset];
    for (const { key } of COMPONENT_TOKENS) {
      setRadiusToken(key, values[key]);
    }
    for (const key of Object.keys(radiusOverrides)) {
      if (
        !COMPONENT_RADIUS_KEYS.includes(
          key as (typeof COMPONENT_RADIUS_KEYS)[number]
        )
      ) {
        resetRadiusToken(key);
      }
    }
    selectToken('radiusButton');
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 flex-row items-center justify-between border-b border-border bg-white px-4 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">{label}</h2>
          <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 font-mono text-[11px] text-[#64748B]">
            {count} tokens
          </span>
        </div>
        <button
          type="button"
          onClick={() => resetCategory(selectedCategoryId)}
          className="text-[13px] font-medium text-[#DC2626] hover:underline"
        >
          Reset category
        </button>
      </header>

      {isTypography ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <FontEditor />
        </div>
      ) : isShape ? (
        <div className="min-h-0 flex-1 overflow-y-auto bg-white">
          <div style={{ display: 'flex', gap: 8, padding: 16 }}>
            {PERSONALITY_CARDS.map((card) => {
              const selected = activePreset === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => applyRadiusPreset(card.id)}
                  style={{
                    flex: 1,
                    height: 88,
                    border: selected
                      ? '1.5px solid var(--color-primary)'
                      : '1px solid #E2E8F0',
                    background: selected
                      ? 'var(--color-primary-light)'
                      : '#FFFFFF',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={(e) => {
                    if (selected) return;
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.background = '#FAFAFA';
                  }}
                  onMouseLeave={(e) => {
                    if (selected) {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.background = 'var(--color-primary-light)';
                      return;
                    }
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  <PersonalityMockup
                    btnR={card.btnR}
                    cardR={card.cardR}
                    chipR={card.chipR}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto',
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>
                      {card.label}
                    </span>
                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>
                      {card.sublabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid #F1F5F9' }}>
            <p
              style={{
                fontSize: 10,
                color: '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '12px 16px 4px',
                margin: 0,
              }}
            >
              Components
            </p>
            {COMPONENT_TOKENS.map(({ key, label: rowLabel, max, pillable }) => {
              const value = getRadiusValue(key);
              const defaultValue = DEFAULT_RADIUS_TOKENS[key] ?? 0;
              const isModified =
                key in radiusOverrides &&
                radiusOverrides[key] !== DEFAULT_RADIUS_TOKENS[key];

              return (
                <ComponentRadiusSlider
                  key={key}
                  tokenKey={key}
                  label={rowLabel}
                  max={max}
                  pillable={pillable}
                  value={value}
                  defaultValue={defaultValue}
                  isModified={isModified}
                  isSelected={selectedTokenKey === key}
                  onSelect={() => selectToken(key)}
                  onChange={(v) => setRadiusToken(key, v)}
                  onReset={() => resetRadiusToken(key)}
                  onTogglePill={() =>
                    setRadiusToken(key, value === 9999 ? 8 : 9999)
                  }
                />
              );
            })}
          </div>

          <style jsx global>{`
            .shape-range {
              -webkit-appearance: none;
              appearance: none;
              width: 100%;
              height: 4px;
              border-radius: 999px;
              outline: none;
              background: #e2e8f0;
            }

            .shape-range:focus {
              outline: none;
              box-shadow: none;
            }

            .shape-range::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: var(--color-primary, #47cd89);
              border: none;
              box-shadow: none;
            }

            .shape-range::-moz-range-thumb {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: var(--color-primary, #47cd89);
              border: none;
              box-shadow: none;
            }

            .shape-range::-moz-range-track {
              height: 4px;
              border-radius: 999px;
              background: transparent;
              border: none;
            }
          `}</style>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto bg-[#F9FAFB]">
          {category!.subcategories.map((sub) => (
            <section key={sub.label}>
              <h3 className="mb-2 px-4 pt-4 pb-2 text-[10px] font-medium tracking-[0.2em] text-[#9CA3AF] uppercase">
                {sub.label}
              </h3>
              <div className="bg-white">
                {sub.tokens.map((tokenKey) => (
                  <TokenRow
                    key={tokenKey}
                    tokenKey={tokenKey}
                    value={
                      colourOverrides[tokenKey] ??
                      DEFAULT_THEME[tokenKey] ??
                      '#000000'
                    }
                    isModified={Object.prototype.hasOwnProperty.call(
                      colourOverrides,
                      tokenKey
                    )}
                    isSelected={selectedTokenKey === tokenKey}
                    onSelect={() => selectToken(tokenKey)}
                    onReset={() => resetToken(tokenKey)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
