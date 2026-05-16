'use client';

import { PreviewShell, SectionLabel, tk, type SlideProps } from './shared';

const ALERTS = [
  {
    message: '✓ Changes saved successfully',
    background: '#F0FDF4',
    borderColor: (t: Record<string, string>) => `${tk(t, 'success', '#16A34A')}40`,
    textColor: (t: Record<string, string>) => tk(t, 'alertSuccessText', '#15803D'),
  },
  {
    message: '⚠ Review required before continuing',
    background: '#FFFBEB',
    borderColor: (t: Record<string, string>) => `${tk(t, 'warning', '#D97706')}40`,
    textColor: (t: Record<string, string>) => tk(t, 'alertWarningText', '#B45309'),
  },
  {
    message: '✕ Something went wrong',
    background: '#FEF2F2',
    borderColor: (t: Record<string, string>) => `${tk(t, 'error', '#DC2626')}40`,
    textColor: (t: Record<string, string>) => tk(t, 'alertErrorText', '#B91C1C'),
  },
  {
    message: 'ℹ New update available',
    background: '#EFF6FF',
    borderColor: () => '#93C5FD',
    textColor: (t: Record<string, string>) => tk(t, 'alertInfoText', '#0369A1'),
  },
] as const;

export function AlertsSlide({ tokens }: SlideProps) {
  return (
    <PreviewShell tokens={tokens} title="Alerts" activeTab={2}>
      {ALERTS.map((alert) => (
        <p
          key={alert.message}
          style={{
            borderRadius: 8,
            padding: '8px 10px',
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            margin: 0,
            flexShrink: 0,
            background: alert.background,
            border: `1px solid ${alert.borderColor(tokens)}`,
            color: alert.textColor(tokens),
          }}
        >
          {alert.message}
        </p>
      ))}
      <SectionLabel tokens={tokens}>Progress</SectionLabel>
      <section
        style={{
          height: 6,
          borderRadius: 999,
          background: tk(tokens, 'progressBackground', '#E2E8F0'),
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: 'block',
            width: '65%',
            height: '100%',
            background: tk(tokens, 'progressValue', '#111827'),
            borderRadius: 999,
          }}
        />
      </section>
      <section
        style={{
          height: 4,
          borderRadius: 999,
          background: tk(tokens, 'progressBackground', '#E2E8F0'),
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            background: tk(tokens, 'progressSuccess', '#16A34A'),
          }}
        />
      </section>
      <SectionLabel tokens={tokens}>Badges</SectionLabel>
      <section style={{ display: 'flex', gap: 5, flexWrap: 'wrap', flexShrink: 0 }}>
        {[
          ['successBackground', 'successDark', '#DCFCE7', '#15803D', 'Active'],
          ['warningBackground', 'warningDark', '#FEF3C7', '#B45309', 'Pending'],
          ['errorBackground', 'errorDark', '#FEE2E2', '#B91C1C', 'Error'],
        ].map(([bgKey, colorKey, bgFb, colorFb, label]) => (
          <span
            key={label}
            style={{
              borderRadius: 999,
              padding: '2px 8px',
              fontSize: 8,
              background: tk(tokens, bgKey, bgFb),
              color: tk(tokens, colorKey, colorFb),
              flexShrink: 0,
            }}
          >
            {label}
          </span>
        ))}
      </section>
    </PreviewShell>
  );
}
