'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AiPreviewPhone } from './AiPreviewPhone';

const SLIDES = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'typography', label: 'Typography', icon: 'Aa' },
  { id: 'buttons', label: 'Buttons', icon: '⬜' },
  { id: 'status', label: 'Status', icon: '✓' },
  { id: 'navigation', label: 'Nav', icon: '☰' },
] as const;

type SlideId = (typeof SLIDES)[number]['id'];

type Props = { tokens: Record<string, string> };

export function AiPreviewSlides({ tokens }: Props) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent((i) => (i + 1) % SLIDES.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrent(i)}
            style={{
              height: 28, padding: '0 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
              border: 'none', whiteSpace: 'nowrap', fontFamily: 'inherit',
              background: i === current ? '#0F172A' : '#F3F4F6',
              color: i === current ? '#FFFFFF' : '#6B7280',
              fontWeight: i === current ? 500 : 400,
            }}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button type="button" onClick={prev}
          style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #E2E8F0',
            background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0 }}>
          <ChevronLeft size={16} color="#6B7280" />
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <AiPreviewPhone tokens={tokens} slide={SLIDES[current].id as SlideId} />
        </div>
        <button type="button" onClick={next}
          style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #E2E8F0',
            background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0 }}>
          <ChevronRight size={16} color="#6B7280" />
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {SLIDES.map((_, i) => (
          <button key={i} type="button" onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`}
            style={{
              cursor: 'pointer', borderRadius: 999, border: 'none', padding: 0,
              transition: 'all 0.2s', width: i === current ? 20 : 6, height: 6,
              background: i === current ? '#0F172A' : '#D1D5DB',
            }}
          />
        ))}
      </div>
    </div>
  );
}
