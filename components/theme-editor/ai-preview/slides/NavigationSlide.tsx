'use client';

type Props = { tokens: Record<string, string> };
const tk = (tokens: Record<string, string>, key: string, fb = '#E5E7EB') => tokens[key] ?? fb;

const NAV = ['Customers', 'Themes', 'Users'] as const;

export function NavigationSlide({ tokens }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      <div style={{ width: 140, flexShrink: 0, background: tk(tokens, 'drawerBackground', '#111827'),
        display: 'flex', flexDirection: 'column', padding: 10, overflow: 'hidden' }}>
        <div style={{ background: tk(tokens, 'drawerHeader', '#1F2937'), margin: '-10px -10px 8px -10px',
          padding: 10, borderBottom: `1px solid ${tk(tokens, 'drawerDivider', '#1F2937')}` }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: tk(tokens, 'primary', '#2563EB'),
            color: '#FFF', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            VP
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#F9FAFB', marginTop: 4 }}>Vivek P</div>
          <div style={{ fontSize: 8, color: '#9CA3AF' }}>Admin</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ background: tk(tokens, 'drawerSelectedBackground', '#1F2937'),
            borderLeft: `2px solid ${tk(tokens, 'drawerSelectedItem', '#2563EB')}`, borderRadius: 4,
            padding: '6px 8px', color: tk(tokens, 'drawerSelectedItem', '#2563EB'), fontSize: 10, fontWeight: 500 }}>
            Dashboard
          </div>
          {NAV.map((item) => (
            <div key={item} style={{ padding: '6px 8px', fontSize: 10, color: tk(tokens, 'drawerItem', '#9CA3AF') }}>
              {item}
            </div>
          ))}
          <div style={{ height: 1, background: tk(tokens, 'drawerDivider', '#374151'), margin: '6px 0' }} />
          <div style={{ padding: '6px 8px', fontSize: 10, color: tk(tokens, 'drawerItem', '#9CA3AF'), opacity: 0.5 }}>
            Settings
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 9, color: tk(tokens, 'errorDark', '#B91C1C'), padding: '6px 8px' }}>
          Sign Out
        </div>
      </div>
      <div style={{ flex: 1, background: tk(tokens, 'background', '#F9FAFB'), padding: 10, overflow: 'hidden' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: tk(tokens, 'textPrimary', '#0F172A') }}>Dashboard</div>
        {[0, 1].map((i) => (
          <div key={i} style={{ marginTop: 8, background: tk(tokens, 'surface', '#FFF'),
            border: `1px solid ${tk(tokens, 'cardBorder', '#E2E8F0')}`, borderRadius: 6, height: 40, marginBottom: 8 }}>
            <div style={{ height: 10, width: '60%', background: tk(tokens, 'shimmerBase', '#E2E8F0'),
              borderRadius: 4, margin: '15px 10px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
