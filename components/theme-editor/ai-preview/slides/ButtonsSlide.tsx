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

export function ButtonsSlide({ tokens }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppBar tokens={tokens} />
      <div style={{ flex: 1, background: tk(tokens, 'background', '#F9FAFB'), padding: 12,
        overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 8, textTransform: 'uppercase', color: tk(tokens, 'textTertiary', '#6B7280') }}>BUTTON STYLES</div>
        <div style={{ height: 34, borderRadius: 6, background: tk(tokens, 'buttonPrimaryBackground', '#2563EB'),
          color: tk(tokens, 'buttonPrimaryText', '#FFF'), fontSize: 11, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Primary Action</div>
        <div style={{ height: 34, borderRadius: 6, background: tk(tokens, 'buttonSecondaryBackground', '#FFF'),
          border: `1px solid ${tk(tokens, 'buttonSecondaryBorder', '#2563EB')}`,
          color: tk(tokens, 'buttonSecondaryText', '#2563EB'), fontSize: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Secondary Action</div>
        <div style={{ height: 28, background: 'transparent', color: tk(tokens, 'buttonTertiaryText', '#2563EB'),
          fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Tertiary Action</div>
        <div style={{ height: 34, borderRadius: 6,
          background: tk(tokens, 'buttonPrimaryDisabledBackground', '#94A3B8'),
          color: tk(tokens, 'buttonPrimaryDisabledText', '#F1F5F9'), fontSize: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Disabled State</div>
        <div style={{ fontSize: 8, textTransform: 'uppercase', color: tk(tokens, 'textTertiary', '#6B7280'), marginTop: 4 }}>
          INPUT STYLES
        </div>
        <div style={{ height: 30, borderRadius: 6, background: tk(tokens, 'inputBackground', '#FFF'),
          border: `1px solid ${tk(tokens, 'inputBorder', '#E2E8F0')}`, padding: '0 8px', fontSize: 11,
          color: tk(tokens, 'inputHint', '#6B7280'), display: 'flex', alignItems: 'center' }}>
          Enter flight number
        </div>
        <div>
          <div style={{ fontSize: 8, color: tk(tokens, 'inputFocusedLabel', '#2563EB'), marginBottom: 2 }}>
            FLIGHT NUMBER
          </div>
          <div style={{ height: 30, borderRadius: 6, background: tk(tokens, 'inputBackground', '#FFF'),
            border: `2px solid ${tk(tokens, 'inputFocusedBorder', '#2563EB')}`, padding: '0 8px',
            fontSize: 11, color: tk(tokens, 'inputText', '#0F172A'), display: 'flex', alignItems: 'center' }}>
            BA107
          </div>
        </div>
        <div style={{ height: 30, borderRadius: 6, background: tk(tokens, 'inputBackground', '#FFF'),
          border: `1px solid ${tk(tokens, 'inputErrorBorder', '#DC2626')}`, padding: '0 8px', fontSize: 11,
          color: tk(tokens, 'inputHint', '#6B7280'), display: 'flex', alignItems: 'center' }}>Invalid number</div>
        <div style={{ fontSize: 9, color: tk(tokens, 'textError', '#B91C1C'), marginTop: 2 }}>Invalid flight number</div>
      </div>
    </div>
  );
}
