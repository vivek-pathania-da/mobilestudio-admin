'use client';

/** iPhone 14 logical ratio (390×844), scaled for preview. */
export const PREVIEW_WIDTH = 268;
export const PREVIEW_HEIGHT = Math.round(PREVIEW_WIDTH * (844 / 390));

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
        flexShrink: 0,
        background: '#FFFFFF',
        borderRadius: 16,
        border: '1px solid #E2E8F0',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
}
