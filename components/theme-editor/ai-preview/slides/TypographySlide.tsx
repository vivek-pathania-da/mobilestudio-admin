'use client';

type Props = { tokens: Record<string, string> };
const tk = (tokens: Record<string, string>, key: string, fb = '#E5E7EB') => tokens[key] ?? fb;

function AppBar({ tokens }: Props) {
  return (
    <div style={{ height: 44, background: tk(tokens, 'appBarBackground', '#FFF'),
      borderBottom: `1px solid ${tk(tokens, 'appBarBorder', '#E2E8F0')}`,
      padding: '0 12px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexShrink: 0 }}>
      <span style={{ fontSize: 16, color: tk(tokens, 'appBarIcon', '#0F172A') }}>≡</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: tk(tokens, 'appBarText', '#0F172A') }}>FlightApp</span>
      <div style={{ width: 24, height: 24, borderRadius: '50%', background: tk(tokens, 'primary', '#2563EB'),
        color: tk(tokens, 'buttonPrimaryText', '#FFF'), fontSize: 9, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>VP</div>
    </div>
  );
}

export function TypographySlide({ tokens }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppBar tokens={tokens} />
      <div style={{ flex: 1, background: tk(tokens, 'background', '#F9FAFB'), padding: 12,
        overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: tk(tokens, 'textPrimary', '#0F172A') }}>Fly the World</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: tk(tokens, 'textPrimary', '#0F172A') }}>Holiday Destinations</div>
        <div style={{ fontSize: 12, fontWeight: 400, color: tk(tokens, 'textSecondary', '#374151'), lineHeight: 1.5 }}>
          Experience the magic of travel this festive season.
        </div>
        <div style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.08em',
          color: tk(tokens, 'textTertiary', '#6B7280') }}>AVAILABLE ROUTES</div>
        <div style={{ fontSize: 12, color: tk(tokens, 'textLink', '#2563EB'), textDecoration: 'underline' }}>
          View all routes →
        </div>
        <div style={{ fontSize: 11, color: tk(tokens, 'textDisabled', '#9CA3AF') }}>Route unavailable</div>
        <div style={{ height: 1, background: tk(tokens, 'divider', '#E2E8F0') }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: tk(tokens, 'success', '#16A34A') }}>✓</span>
          <span style={{ fontSize: 12, color: tk(tokens, 'textSuccess', '#15803D') }}>Booking Confirmed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: tk(tokens, 'error', '#DC2626') }}>✕</span>
          <span style={{ fontSize: 12, color: tk(tokens, 'textError', '#B91C1C') }}>Payment Failed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: tk(tokens, 'warning', '#D97706') }}>⚠</span>
          <span style={{ fontSize: 12, color: tk(tokens, 'textWarning', '#B45309') }}>Gate closes in 10 min</span>
        </div>
      </div>
    </div>
  );
}
