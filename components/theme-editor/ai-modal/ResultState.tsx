'use client';

import { RotateCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
          <Button
            type="button"
            variant="link"
            className="h-9 w-[130px] gap-1.5 text-primary"
            onClick={onNewPrompt}
          >
            <Plus className="size-3.5" />
            New prompt
          </Button>
        </div>
      </div>
      <p
        style={{
          margin: 0,
          padding: '16px 24px 0',
          fontSize: 12,
          fontStyle: 'italic',
          color: '#6B7280',
          lineHeight: 1.5,
        }}
      >
        {result.description}
      </p>
      <section style={{ padding: '16px 24px' }}>
        <AiPreviewSlides tokens={result.tokens} />
      </section>
      <section style={{ padding: '0 24px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <PaletteStrip palette={result.palette} />
      </section>
    </section>
  );
}
