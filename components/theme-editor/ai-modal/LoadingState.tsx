'use client';

import { Sparkles } from 'lucide-react';

const STEPS = [
  { label: 'PALETTE', status: 'done' as const },
  { label: 'TOKENS', status: 'active' as const },
  { label: 'VALIDATING', status: 'pending' as const },
];

function stepColors(status: (typeof STEPS)[number]['status']) {
  if (status === 'done') return { bg: '#16A34A', text: '#16A34A' };
  if (status === 'active') return { bg: 'var(--color-primary)', text: 'var(--color-primary)' };
  return { bg: '#E2E8F0', text: '#9CA3AF' };
}

export function LoadingState() {
  return (
    <section className="flex flex-col items-center border-b border-border px-6 py-12">
      <Sparkles size={36} className="animate-pulse text-primary" />
      <p className="mt-4 text-center text-lg font-semibold text-foreground">
        Designing your theme...
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Claude is choosing colours based on your brief
      </p>
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ animation: 'aiProgress 3s ease-in-out infinite' }}
        />
      </div>
      <div className="mt-5 flex gap-6">
        {STEPS.map((step) => {
          const colors = stepColors(step.status);
          return (
            <div key={step.label} className="flex flex-col items-center gap-1.5">
              <div
                className="flex size-7 items-center justify-center rounded-full text-xs"
                style={{
                  background: colors.bg,
                  color: step.status === 'pending' ? '#9CA3AF' : '#FFF',
                }}
              >
                {step.status === 'done' ? '✓' : '●'}
              </div>
              <span
                className="text-[9px] tracking-wider uppercase"
                style={{ color: colors.text }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">This usually takes 4–8 seconds</p>
      <style>{`
        @keyframes aiProgress { 0% { width: 0% } 60% { width: 80% } 100% { width: 90% } }
      `}</style>
    </section>
  );
}
