'use client';

type Props = { tokens: Record<string, string> };

const tk = (tokens: Record<string, string>, key: string, fb = '#E5E7EB') =>
  tokens[key] ?? fb;

function AppBar({ tokens }: Props) {
  return (
    <div style={{
        height: 44,
        background: tk(tokens, 'appBarBackground', '#FFF'),
        borderBottom: `1px solid ${tk(tokens, 'appBarBorder', '#E2E8F0')}`,
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
      <span style={{ fontSize: 16, color: tk(tokens, 'appBarIcon', '#0F172A') }}>≡</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: tk(tokens, 'appBarText', '#0F172A') }}>FlightApp</span>
      <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: tk(tokens, 'primary', '#2563EB'),
          color: tk(tokens, 'buttonPrimaryText', '#FFF'),
          fontSize: 9, fontWeight: 700, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>VP</div>
    </div>
  );
}

const NAV = ['Home', 'Flights', 'Book', 'Lounge', 'Me'] as const;

export function HomeSlide({ tokens }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppBar tokens={tokens} />
      <div style={{
          flex: 1, background: tk(tokens, 'background', '#F9FAFB'),
          overflow: 'hidden', padding: 10, display: 'flex',
          flexDirection: 'column', gap: 8,
        }}>
        <div style={{
            borderRadius: 8, padding: 12, flexShrink: 0,
            background: `linear-gradient(135deg, ${tk(tokens, 'primary', '#2563EB')}, ${tk(tokens, 'secondary', '#7C3AED')})`,
          }}>
          <div style={{ fontSize: 8, color: tk(tokens, 'accent', '#F59E0B'), letterSpacing: '0.08em' }}>HOLIDAY SPECIAL</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#FFF', marginTop: 4 }}>Fly in Style</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Book your Christmas journey</div>
          <span style={{ marginTop: 8, display: 'inline-block', background: tk(tokens, 'accent', '#F59E0B'), color: tk(tokens, 'textPrimary', '#0F172A'), fontSize: 8, fontWeight: 600, padding: '3px 8px', borderRadius: 4 }}>Book Now</span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <div style={{ flex: 1, background: tk(tokens, 'surface', '#FFF'), border: `1px solid ${tk(tokens, 'cardBorder', '#E2E8F0')}`, borderRadius: 6, padding: 8 }}>
            <div style={{ fontSize: 7, color: tk(tokens, 'textTertiary', '#6B7280'), textTransform: 'uppercase' }}>DEPARTURES</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: tk(tokens, 'textPrimary', '#0F172A') }}>LHR → DXB</div>
            <div style={{ fontSize: 9, color: tk(tokens, 'textSecondary', '#374151') }}>08:30 AM</div>
          </div>
          <div style={{ flex: 1, background: tk(tokens, 'surface', '#FFF'), border: `1px solid ${tk(tokens, 'cardBorder', '#E2E8F0')}`, borderRadius: 6, padding: 8 }}>
            <div style={{ fontSize: 7, color: tk(tokens, 'textTertiary', '#6B7280'), textTransform: 'uppercase' }}>STATUS</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: tk(tokens, 'success', '#16A34A') }}>On Time</div>
            <div style={{ fontSize: 9, color: tk(tokens, 'textSecondary', '#374151') }}>Terminal 5</div>
          </div>
        </div>
        <div style={{ borderRadius: 6, height: 32, background: tk(tokens, 'buttonPrimaryBackground', '#2563EB'), color: tk(tokens, 'buttonPrimaryText', '#FFF'), fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>Check In Now</div>
        <div style={{ borderRadius: 6, height: 32, background: tk(tokens, 'buttonSecondaryBackground', '#FFF'), border: `1px solid ${tk(tokens, 'buttonSecondaryBorder', '#2563EB')}`, color: tk(tokens, 'buttonSecondaryText', '#2563EB'), fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>View Booking</div>
      </div>
      <div style={{ height: 44, flexShrink: 0, background: tk(tokens, 'bottomNavBackground', '#FFF'), borderTop: `1px solid ${tk(tokens, 'appBarBorder', '#E2E8F0')}`, display: 'flex' }}>
        {NAV.map((label, i) => {
          const color = i === 0 ? tk(tokens, 'bottomNavSelected', '#2563EB') : tk(tokens, 'bottomNavUnselected', '#6B7280');
          return (
            <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: color }}></div>
              <span style={{ fontSize: 6, color }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
