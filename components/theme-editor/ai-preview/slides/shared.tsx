'use client';

import type { ReactNode } from 'react';

export type SlideProps = { tokens: Record<string, string> };

/** Status-bar inset for flat preview (scaled from iPhone safe area). */
export const PREVIEW_SAFE_TOP = 14;

export const tk = (
  tokens: Record<string, string>,
  key: string,
  fb = '#E5E7EB'
) => tokens[key] ?? fb;

const NAV_ITEMS = [
  { label: 'Home', icon: '⌂' },
  { label: 'Form', icon: '▤' },
  { label: 'Alerts', icon: '!' },
  { label: 'Type', icon: 'Aa' },
] as const;

function HeaderIconButton({
  tokens,
  children,
  badge,
}: SlideProps & { children: ReactNode; badge?: number }) {
  const iconColor = tk(tokens, 'appBarIcon', '#111827');
  return (
    <span style={{ position: 'relative', flexShrink: 0 }}>
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: `${iconColor}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          color: iconColor,
        }}
      >
        {children}
      </span>
      {badge != null && badge > 0 ? (
        <span
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            minWidth: 14,
            height: 14,
            borderRadius: 999,
            padding: '0 3px',
            background: tk(tokens, 'badgeBackground', '#DC2626'),
            color: tk(tokens, 'badgeText', '#FFFFFF'),
            fontSize: 7,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1.5px solid ${tk(tokens, 'appBarBackground', '#FFFFFF')}`,
          }}
        >
          {badge}
        </span>
      ) : null}
    </span>
  );
}

export function FlatHeader({
  tokens,
  title,
  mailBadge,
}: SlideProps & { title: string; mailBadge?: number }) {
  return (
    <header
      style={{
        padding: `${PREVIEW_SAFE_TOP}px 12px 10px`,
        background: tk(tokens, 'appBarBackground', '#FFFFFF'),
        borderBottom: `1px solid ${tk(tokens, 'appBarBorder', '#E5E7EB')}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <HeaderIconButton tokens={tokens}>○</HeaderIconButton>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: tk(tokens, 'appBarText', '#111827'),
        }}
      >
        {title}
      </span>
      <HeaderIconButton tokens={tokens} badge={mailBadge}>
        ✉
      </HeaderIconButton>
    </header>
  );
}

export function FlatBottomNav({
  tokens,
  activeIndex,
}: SlideProps & { activeIndex: number }) {
  const barBg = tk(tokens, 'bottomNavBackground', '#FFFFFF');
  const selectedBg = tk(tokens, 'bottomNavSelected', '#111827');
  const unselectedColor = tk(tokens, 'bottomNavUnselected', '#9CA3AF');
  const indicatorColor = tk(tokens, 'bottomNavIndicator', '#111827');

  return (
    <nav
      style={{
        flexShrink: 0,
        background: barBg,
        padding: '8px 10px 12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: 999,
          padding: 4,
          gap: 2,
        }}
      >
        {NAV_ITEMS.map((item, i) => {
          const active = i === activeIndex;
          return (
            <span
              key={item.label}
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                padding: '6px 4px 8px',
                borderRadius: 999,
                background: active ? selectedBg : 'transparent',
                color: active
                  ? tk(tokens, 'textInverse', '#FFFFFF')
                  : unselectedColor,
                fontSize: 8,
                fontWeight: active ? 600 : 400,
              }}
            >
              <span style={{ fontSize: 11, lineHeight: 1 }}>{item.icon}</span>
              <span>{item.label}</span>
              {active ? (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 3,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 18,
                    height: 2,
                    borderRadius: 999,
                    background: indicatorColor,
                  }}
                />
              ) : null}
            </span>
          );
        })}
      </div>
    </nav>
  );
}

export function PreviewShell({
  tokens,
  title,
  activeTab,
  children,
  mailBadge,
}: SlideProps & {
  title: string;
  activeTab: number;
  children: ReactNode;
  mailBadge?: number;
}) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: tk(tokens, 'screenBackground', '#F9FAFB'),
      }}
    >
      <FlatHeader tokens={tokens} title={title} mailBadge={mailBadge} />
      <section
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          minHeight: 0,
        }}
      >
        {children}
      </section>
      <FlatBottomNav tokens={tokens} activeIndex={activeTab} />
    </section>
  );
}

export function SectionLabel({
  tokens,
  children,
}: SlideProps & { children: string }) {
  return (
    <p
      style={{
        fontSize: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: tk(tokens, 'textTertiary', '#6B7280'),
        margin: 0,
        flexShrink: 0,
      }}
    >
      {children}
    </p>
  );
}
