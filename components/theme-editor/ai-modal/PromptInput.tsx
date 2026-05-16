'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

type Props = {
  onGenerate: (prompt: string) => void;
  initialPrompt?: string;
};

export function PromptInput({ onGenerate, initialPrompt = '' }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const canSubmit = prompt.trim().length >= 5;

  return (
    <section style={{ padding: 24, borderBottom: '1px solid #E2E8F0' }}>
      <p
        style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#9CA3AF',
          marginBottom: 8,
        }}
      >
        DESCRIBE YOUR THEME
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        maxLength={500}
        autoFocus
        placeholder="e.g. luxury airline with dark navy and gold accents for Christmas"
        style={{
          width: '100%',
          minHeight: 80,
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          padding: 12,
          fontSize: 14,
          fontFamily: 'inherit',
          resize: 'none',
          outline: 'none',
          boxSizing: 'border-box',
          color: '#374151',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#2563EB';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#E2E8F0';
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{prompt.length} / 500</span>
        <button
          type="button"
          onClick={() => onGenerate(prompt)}
          disabled={!canSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '0 20px',
            height: 40,
            borderRadius: 8,
            border: 'none',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            background: canSubmit ? '#2563EB' : '#E2E8F0',
            color: canSubmit ? '#FFFFFF' : '#9CA3AF',
            fontSize: 14,
            fontWeight: 500,
            fontFamily: 'inherit',
          }}
        >
          <Sparkles size={14} />
          Generate Theme →
        </button>
      </div>
    </section>
  );
}
