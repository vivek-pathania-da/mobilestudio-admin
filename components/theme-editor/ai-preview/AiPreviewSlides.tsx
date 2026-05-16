'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AiPreviewPhone } from './AiPreviewPhone';
import type { AiPreviewSlide } from './types';

const SLIDES: { id: AiPreviewSlide; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'form', label: 'Form' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'typography', label: 'Type' },
];

type Props = { tokens: Record<string, string> };

export function AiPreviewSlides({ tokens }: Props) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent((i) => (i + 1) % SLIDES.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid #E2E8F0',
            background: '#FFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={16} color="#6B7280" />
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <AiPreviewPhone tokens={tokens} slide={SLIDES[current].id} />
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid #E2E8F0',
            background: '#FFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ChevronRight size={16} color="#6B7280" />
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`${s.label} slide`}
            aria-current={i === current ? 'true' : undefined}
            style={{
              cursor: 'pointer',
              borderRadius: 999,
              border: 'none',
              padding: 0,
              transition: 'all 0.2s',
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? '#0F172A' : '#D1D5DB',
            }}
          />
        ))}
      </div>
    </div>
  );
}
