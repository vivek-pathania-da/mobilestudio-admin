'use client';

import { PreviewShell, SectionLabel, tk, tr, radiusCss, type SlideProps } from './shared';

function FieldLabel({
  tokens,
  children,
  colorKey = 'inputLabel',
  fallback = '#374151',
}: SlideProps & {
  children: string;
  colorKey?: string;
  fallback?: string;
}) {
  return (
    <p
      style={{
        fontSize: 8,
        fontWeight: 600,
        color: tk(tokens, colorKey, fallback),
        margin: '0 0 4px',
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </p>
  );
}

function TextInput({
  tokens,
  radiusTokens,
  value,
  borderKey = 'inputBorder',
  borderWidth = 1,
  textKey = 'inputHint',
}: SlideProps & {
  value: string;
  borderKey?: string;
  borderWidth?: number;
  textKey?: string;
}) {
  const r = (key: string, fallback = 8) => tr(radiusTokens ?? {}, key, fallback);
  return (
    <p
      style={{
        height: 32,
        borderRadius: radiusCss(r('radiusInput'), 8),
        margin: 0,
        background: tk(tokens, 'inputBackground', '#FFFFFF'),
        border: `${borderWidth}px solid ${tk(tokens, borderKey, '#E5E7EB')}`,
        padding: '0 10px',
        fontSize: 10,
        color: tk(tokens, textKey, '#9CA3AF'),
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      {value}
    </p>
  );
}

function CheckboxRow({
  tokens,
  radiusTokens,
  label,
  checked,
}: SlideProps & { label: string; checked: boolean }) {
  const r = (key: string, fallback = 3) => tr(radiusTokens ?? {}, key, fallback);
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'default',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: radiusCss(r('radiusXs', 3), 4),
          flexShrink: 0,
          background: checked
            ? tk(tokens, 'checkboxActive', '#111827')
            : tk(tokens, 'checkboxInactive', '#FFFFFF'),
          border: checked
            ? 'none'
            : `1.5px solid ${tk(tokens, 'checkboxBorder', '#D1D5DB')}`,
          color: tk(tokens, 'checkboxCheck', '#FFFFFF'),
          fontSize: 11,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked ? '✓' : ''}
      </span>
      <span style={{ fontSize: 10, color: tk(tokens, 'textSecondary', '#374151') }}>
        {label}
      </span>
    </label>
  );
}

function RadioRow({
  tokens,
  label,
  selected,
}: SlideProps & { label: string; selected: boolean }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'default',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          flexShrink: 0,
          background: tk(tokens, 'radioInactive', '#FFFFFF'),
          border: `1.5px solid ${tk(tokens, 'radioBorder', '#D1D5DB')}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: tk(tokens, 'radioActive', '#111827'),
            }}
          />
        ) : null}
      </span>
      <span style={{ fontSize: 10, color: tk(tokens, 'textSecondary', '#374151') }}>
        {label}
      </span>
    </label>
  );
}

export function FormSlide({ tokens, radiusTokens }: SlideProps) {
  const r = (key: string, fallback = 8) => tr(radiusTokens ?? {}, key, fallback);
  return (
    <PreviewShell tokens={tokens} title="Form" activeTab={1}>
      <SectionLabel tokens={tokens}>Contact details</SectionLabel>

      <section style={{ flexShrink: 0 }}>
        <FieldLabel tokens={tokens}>Full name</FieldLabel>
        <TextInput tokens={tokens} radiusTokens={radiusTokens} value="Jane Cooper" textKey="inputText" />
      </section>

      <section style={{ flexShrink: 0 }}>
        <FieldLabel tokens={tokens} colorKey="inputFocusedLabel">
          Email
        </FieldLabel>
        <TextInput
          tokens={tokens}
          radiusTokens={radiusTokens}
          value="jane@example.com"
          borderKey="inputFocusedBorder"
          borderWidth={2}
          textKey="inputText"
        />
      </section>

      <section style={{ flexShrink: 0 }}>
        <FieldLabel tokens={tokens} colorKey="inputErrorLabel" fallback="#B91C1C">
          Phone
        </FieldLabel>
        <TextInput
          tokens={tokens}
          radiusTokens={radiusTokens}
          value="Not a valid number"
          borderKey="inputErrorBorder"
          textKey="inputHint"
        />
        <p
          style={{
            fontSize: 8,
            color: tk(tokens, 'inputErrorLabel', '#B91C1C'),
            margin: '4px 0 0',
          }}
        >
          Please enter a valid phone number
        </p>
      </section>

      <section style={{ flexShrink: 0, opacity: 0.85 }}>
        <FieldLabel tokens={tokens} colorKey="inputDisabledLabel">
          Notes (disabled)
        </FieldLabel>
        <p
          style={{
            height: 32,
            borderRadius: radiusCss(r('radiusInput'), 8),
            margin: 0,
            background: tk(tokens, 'inputDisabledBackground', '#F3F4F6'),
            border: `1px solid ${tk(tokens, 'inputDisabledBorder', '#E5E7EB')}`,
            padding: '0 10px',
            fontSize: 10,
            color: tk(tokens, 'inputDisabledText', '#9CA3AF'),
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Optional field
        </p>
      </section>

      <SectionLabel tokens={tokens}>Preferences</SectionLabel>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flexShrink: 0,
          padding: '8px 10px',
          borderRadius: radiusCss(r('radiusCard'), 8),
          background: tk(tokens, 'cardBackground', '#FFFFFF'),
          border: `1px solid ${tk(tokens, 'cardBorder', '#E5E7EB')}`,
        }}
      >
        <CheckboxRow tokens={tokens} radiusTokens={radiusTokens} label="Email me updates" checked />
        <CheckboxRow tokens={tokens} radiusTokens={radiusTokens} label="Share activity summary" checked={false} />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flexShrink: 0,
          padding: '8px 10px',
          borderRadius: radiusCss(r('radiusCard'), 8),
          background: tk(tokens, 'cardBackground', '#FFFFFF'),
          border: `1px solid ${tk(tokens, 'cardBorder', '#E5E7EB')}`,
        }}
      >
        <FieldLabel tokens={tokens}>Contact method</FieldLabel>
        <RadioRow tokens={tokens} label="Email" selected />
        <RadioRow tokens={tokens} label="SMS" selected={false} />
        <RadioRow tokens={tokens} label="Push notification" selected={false} />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flexShrink: 0,
          marginTop: 4,
        }}
      >
        <button
          type="button"
          style={{
            height: 34,
            borderRadius: radiusCss(r('radiusButton'), 8),
            border: `1px solid ${tk(tokens, 'buttonPrimaryBorder', '#111827')}`,
            background: tk(tokens, 'buttonPrimaryBackground', '#111827'),
            color: tk(tokens, 'buttonPrimaryText', '#FFFFFF'),
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          Submit
        </button>
        <button
          type="button"
          style={{
            height: 34,
            borderRadius: radiusCss(r('radiusButton'), 8),
            background: tk(tokens, 'buttonSecondaryBackground', '#FFFFFF'),
            border: `1px solid ${tk(tokens, 'buttonSecondaryBorder', '#E2E8F0')}`,
            color: tk(tokens, 'buttonSecondaryText', '#111827'),
            fontSize: 11,
            fontFamily: 'inherit',
          }}
        >
          Cancel
        </button>
      </section>
    </PreviewShell>
  );
}
