'use client';

import { RotateCcw, Plus } from 'lucide-react';
import { AiPreviewSlides } from '../ai-preview/AiPreviewSlides';
import { PaletteStrip } from '../ai-preview/PaletteStrip';
import type { AiGenerateResponse } from '@/types/api';

type Props = {
  result: AiGenerateResponse;
  onRegenerate: (prompt: string) => void;
  onNewPrompt: () => void;
};

export function ResultState({ result, onRegenerate, onNewPrompt }: Props) {
  return (
    <section>
      <div style={{ padding: 24, borderBottom: '1px solid #E2E8F0', display: 'flex', gap: 12 }}>
        <div
          style={{
            flex: 1,
            background: '#F9FAFB',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            color: '#374151',
            lineHeight: 1.5,
          }}
        >
          {result.promptUsed}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => onRegenerate(result.promptUsed)}
            style={{
              width: 130,
              height: 36,
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: '#FFF',
              cursor: 'pointer',
              fontSize: 13,
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontFamily: 'inherit',
            }}
          >
            <RotateCcw size={13} /> Regenerate
          </button>
          <button
            type="button"
            onClick={onNewPrompt}
            style={{
              width: 130,
              height: 36,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 13,
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontFamily: 'inherit',
            }}
          >
            <Plus size={13} /> New prompt
          </button>
        </div>
      </div>
      <div
        style={{
          padding: '16px 24px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#9CA3AF',
          }}
        >
          PREVIEW
        </span>
        <span
          style={{
            fontSize: 12,
            fontStyle: 'italic',
            color: '#6B7280',
            maxWidth: 300,
            textAlign: 'right',
          }}
        >
          {result.description}
        </span>
      </div>
      <section style={{ padding: '16px 24px' }}>
        <AiPreviewSlides tokens={result.tokens} />
      </section>
      <section style={{ padding: '0 24px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <PaletteStrip palette={result.palette} />
      </section>
    </section>
  );
}
