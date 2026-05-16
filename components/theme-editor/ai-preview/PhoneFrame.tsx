'use client';

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 240,
        height: 460,
        flexShrink: 0,
        background: '#1A1A1A',
        borderRadius: 28,
        border: '3px solid #333',
        padding: 10,
        boxShadow: '0 24px 48px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 28,
          background: '#1A1A1A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 60,
            height: 8,
            background: '#000',
            borderRadius: 999,
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          borderRadius: 4,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>
    </div>
  );
}
