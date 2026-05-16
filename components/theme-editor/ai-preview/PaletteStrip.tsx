'use client';

import type { AiPalette } from '@/types/api';

type Props = { palette: AiPalette };

const PALETTE_LABELS: { key: keyof AiPalette; label: string }[] = [
  { key: 'primary', label: 'primary' },
  { key: 'primaryLight', label: 'light' },
  { key: 'primaryDark', label: 'dark' },
  { key: 'secondary', label: 'secondary' },
  { key: 'accent', label: 'accent' },
  { key: 'background', label: 'bg' },
  { key: 'surface', label: 'surface' },
  { key: 'textPrimary', label: 'text' },
  { key: 'success', label: 'success' },
  { key: 'error', label: 'error' },
  { key: 'warning', label: 'warning' },
  { key: 'sidebar', label: 'sidebar' },
];

const LIGHT_KEYS: (keyof AiPalette)[] = ['background', 'surface'];

export function PaletteStrip({ palette }: Props) {
  return (
    <div>
      <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
        color: '#9CA3AF', marginBottom: 12 }}>GENERATED PALETTE</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {PALETTE_LABELS.map(({ key, label }) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: palette[key],
              border: LIGHT_KEYS.includes(key) ? '1px solid #E2E8F0' : 'none',
              boxShadow: '0 0 0 2px white, 0 0 0 3px #E2E8F0',
            }} />
            <span style={{ fontSize: 9, color: '#9CA3AF', maxWidth: 48, textAlign: 'center',
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
