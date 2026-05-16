'use client';

import { PreviewShell, SectionLabel, tk, type SlideProps } from './shared';

const METRICS = [
  {
    label: 'Total clients',
    value: '2,847',
    delta: '+12%',
    deltaKey: 'textSuccess',
    accent: 'primary',
  },
  {
    label: 'Sessions today',
    value: '184',
    delta: 'Live',
    deltaKey: 'success',
    accent: 'success',
  },
] as const;

const ACTIVITY = [
  {
    name: 'Sarah Chen',
    detail: 'Strength · 45 min',
    badge: 'Done',
    badgeBg: 'successBackground',
    badgeText: 'successDark',
  },
  {
    name: 'Marcus Webb',
    detail: 'Check-in pending',
    badge: 'Pending',
    badgeBg: 'warningBackground',
    badgeText: 'warningDark',
  },
] as const;

function HeroBanner({ tokens }: SlideProps) {
  const start = tk(tokens, 'primaryGradientStart', '#111827');
  const end = tk(tokens, 'primaryGradientEnd', '#4B5563');
  return (
    <article
      style={{
        borderRadius: 10,
        padding: '12px 14px',
        flexShrink: 0,
        background: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
      }}
    >
      <p
        style={{
          fontSize: 8,
          color: tk(tokens, 'textInverse', '#FFFFFF'),
          opacity: 0.85,
          margin: 0,
        }}
      >
        This week
      </p>
      <p
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: tk(tokens, 'textInverse', '#FFFFFF'),
          margin: '4px 0 2px',
        }}
      >
        94% on track
      </p>
      <p
        style={{
          fontSize: 8,
          color: tk(tokens, 'textInverse', '#FFFFFF'),
          opacity: 0.75,
          margin: 0,
        }}
      >
        12 of 13 goals met
      </p>
    </article>
  );
}

function MetricCard({
  tokens,
  label,
  value,
  delta,
  deltaKey,
  accent,
}: SlideProps & (typeof METRICS)[number]) {
  return (
    <article
      style={{
        flex: 1,
        borderRadius: 8,
        padding: '10px 12px',
        flexShrink: 0,
        background: tk(tokens, 'cardBackground', '#FFFFFF'),
        border: `1px solid ${tk(tokens, 'cardBorder', '#E5E7EB')}`,
        borderTop: `3px solid ${tk(tokens, accent, '#111827')}`,
      }}
    >
      <p
        style={{
          fontSize: 8,
          color: tk(tokens, 'textTertiary', '#6B7280'),
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: tk(tokens, 'textPrimary', '#111827'),
          margin: '4px 0 2px',
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: 8,
          fontWeight: 600,
          color: tk(tokens, deltaKey, '#16A34A'),
          margin: 0,
        }}
      >
        {delta}
      </p>
    </article>
  );
}

export function DashboardSlide({ tokens }: SlideProps) {
  return (
    <PreviewShell tokens={tokens} title="Dashboard" activeTab={0} mailBadge={3}>
      <section style={{ flexShrink: 0 }}>
        <p
          style={{
            fontSize: 9,
            color: tk(tokens, 'textSecondary', '#374151'),
            margin: 0,
          }}
        >
          Good morning
        </p>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: tk(tokens, 'textPrimary', '#111827'),
            margin: '2px 0 0',
          }}
        >
          Overview
        </p>
      </section>

      <HeroBanner tokens={tokens} />

      <section style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {METRICS.map((m) => (
          <MetricCard key={m.label} tokens={tokens} {...m} />
        ))}
      </section>

      <section style={{ flexShrink: 0 }}>
        <section
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 8, color: tk(tokens, 'textSecondary', '#374151') }}>
            Weekly goal
          </span>
          <span
            style={{
              fontSize: 8,
              fontWeight: 600,
              color: tk(tokens, 'primary', '#111827'),
            }}
          >
            72%
          </span>
        </section>
        <section
          style={{
            height: 5,
            borderRadius: 999,
            background: tk(tokens, 'progressBackground', '#E5E7EB'),
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              display: 'block',
              width: '72%',
              height: '100%',
              background: tk(tokens, 'progressValue', tk(tokens, 'primary', '#111827')),
              borderRadius: 999,
            }}
          />
        </section>
      </section>

      <section
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: tk(tokens, 'cardBackground', '#FFFFFF'),
          border: `1px solid ${tk(tokens, 'cardBorder', '#E5E7EB')}`,
          borderRadius: 10,
          padding: '10px 12px',
          overflow: 'hidden',
        }}
      >
        <SectionLabel tokens={tokens}>Recent activity</SectionLabel>
        {ACTIVITY.map((item, i) => (
          <section
            key={item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              paddingBottom: i < ACTIVITY.length - 1 ? 8 : 0,
              borderBottom:
                i < ACTIVITY.length - 1
                  ? `1px solid ${tk(tokens, 'divider', '#E5E7EB')}`
                  : 'none',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: tk(tokens, 'avatarBackground', '#E5E7EB'),
                color: tk(tokens, 'avatarText', '#111827'),
                fontSize: 10,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {item.name.charAt(0)}
            </span>
            <section style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: tk(tokens, 'textPrimary', '#111827'),
                  margin: 0,
                }}
              >
                {item.name}
              </p>
              <p
                style={{
                  fontSize: 8,
                  color: tk(tokens, 'textTertiary', '#6B7280'),
                  margin: 0,
                }}
              >
                {item.detail}
              </p>
            </section>
            <span
              style={{
                borderRadius: 999,
                padding: '2px 8px',
                fontSize: 7,
                fontWeight: 600,
                background: tk(tokens, item.badgeBg, '#F3F4F6'),
                color: tk(tokens, item.badgeText, '#374151'),
                flexShrink: 0,
              }}
            >
              {item.badge}
            </span>
          </section>
        ))}
      </section>
    </PreviewShell>
  );
}
