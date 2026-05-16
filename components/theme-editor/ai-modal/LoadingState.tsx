'use client';

import { Sparkles } from 'lucide-react';

const STEPS = [
  { label: 'PALETTE', status: 'done' as const },
  { label: 'TOKENS', status: 'active' as const },
  { label: 'VALIDATING', status: 'pending' as const },
];

export function LoadingState() {
  return (
    <section style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
      <Sparkles size={36} color="#2563EB" style={{ animation: 'pulse 1.5s infinite' }} />
      <p style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginTop: 16, textAlign: 'center' }}>
        Designing your theme...
      </p>
      <p style={{ fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center' }}>
        Claude is choosing colours based on your brief
      </p>
      <div style={{ width: '100%', height: 6, background: '#E2E8F0', borderRadius: 999, marginTop: 24, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: '#2563EB', borderRadius: 999, animation: 'aiProgress 3s ease-in-out infinite' }} />
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
        {STEPS.map((step) => (
          <div key={step.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 12,
              background: step.status === 'done' ? '#16A34A' : step.status === 'active' ? '#2563EB' : '#E2E8F0',
              color: step.status === 'pending' ? '#9CA3AF' : '#FFF' }}>
              {step.status === 'done' ? '✓' : '●'}
            </div>
            <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: step.status === 'done' ? '#16A34A' : step.status === 'active' ? '#2563EB' : '#9CA3AF' }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 16 }}>This usually takes 4–8 seconds</p>
      <style>{`
        @keyframes aiProgress { 0% { width: 0% } 60% { width: 80% } 100% { width: 90% } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
      `}</style>
    </section>
  );
}
