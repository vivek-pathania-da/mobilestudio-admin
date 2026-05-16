'use client';

type Props = { tokens: Record<string, string> };
const tk = (tokens: Record<string, string>, key: string, fb = '#E5E7EB') => tokens[key] ?? fb;

const alertStyle = (bg: string, border: string) => ({
  background: bg, border: `1px solid ${border}`, borderRadius: 6, padding: '8px 10px', fontSize: 11,
});

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

const BADGES = [
  ['successBackground', 'successDark', '#DCFCE7', '#15803D', '● Active'],
  ['warningBackground', 'warningDark', '#FEF3C7', '#B45309', '● Trial'],
  ['errorBackground', 'errorDark', '#FEE2E2', '#B91C1C', '● Suspended'],
] as const;

export function StatusSlide({ tokens }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppBar tokens={tokens} />
      <div style={{ flex: 1, background: tk(tokens, 'background', '#F9FAFB'), padding: 12,
        overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 8, textTransform: 'uppercase', color: tk(tokens, 'textTertiary', '#6B7280') }}>
          STATUS & ALERTS
        </div>
        <div style={{ ...alertStyle(tk(tokens, 'alertSuccessBackground', '#DCFCE7'), tk(tokens, 'alertSuccessBorder', '#86EFAC')),
          color: tk(tokens, 'alertSuccessText', '#15803D') }}>✓ Boarding has commenced</div>
        <div style={{ ...alertStyle(tk(tokens, 'alertWarningBackground', '#FEF3C7'), tk(tokens, 'alertWarningBorder', '#FCD34D')),
          color: tk(tokens, 'alertWarningText', '#B45309') }}>⚠ Gate closes in 15 minutes</div>
        <div style={{ ...alertStyle(tk(tokens, 'alertErrorBackground', '#FEE2E2'), tk(tokens, 'alertErrorBorder', '#FCA5A5')),
          color: tk(tokens, 'alertErrorText', '#B91C1C') }}>✕ Flight BA107 cancelled</div>
        <div style={{ ...alertStyle(tk(tokens, 'alertInfoBackground', '#E0F2FE'), tk(tokens, 'alertInfoBorder', '#7DD3FC')),
          color: tk(tokens, 'alertInfoText', '#0369A1') }}>ℹ Check-in opens in 2 hours</div>
        <div style={{ fontSize: 8, textTransform: 'uppercase', color: tk(tokens, 'textTertiary', '#6B7280'), marginTop: 4 }}>
          BADGES
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {BADGES.map(([bgKey, colorKey, bgFb, colorFb, label]) => (
            <span key={label} style={{
              borderRadius: 999, padding: '2px 8px', fontSize: 9,
              background: tk(tokens, bgKey, bgFb), color: tk(tokens, colorKey, colorFb),
            }}>{label}</span>
          ))}
          <span style={{ borderRadius: 999, padding: '2px 8px', fontSize: 9, background: '#F3F4F6', color: '#6B7280' }}>
            ● Churned
          </span>
        </div>
      </div>
    </div>
  );
}
