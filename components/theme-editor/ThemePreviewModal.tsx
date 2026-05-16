'use client';

import { useMemo } from 'react';
import { Eye, X } from 'lucide-react';
import { useThemeEditorStore } from '@/stores/theme-editor.store';
import { resolvePreviewTokens } from '@/components/theme-editor/ai-preview/utils';
import { AiPreviewSlides } from '@/components/theme-editor/ai-preview/AiPreviewSlides';

export function ThemePreviewModal() {
  const previewModalOpen = useThemeEditorStore((s) => s.previewModalOpen);
  const closePreviewModal = useThemeEditorStore((s) => s.closePreviewModal);
  const colourOverrides = useThemeEditorStore((s) => s.colourOverrides);
  const themeName = useThemeEditorStore((s) => s.themeName);

  const tokens = useMemo(
    () => resolvePreviewTokens(colourOverrides),
    [colourOverrides]
  );

  if (!previewModalOpen) return null;

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="Theme preview"
      onClick={closePreviewModal}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <section
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFF',
          borderRadius: 16,
          width: '100%',
          maxWidth: 780,
          minHeight: 'min(820px, 94vh)',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
        }}
      >
        <header
          style={{
            height: 56,
            borderBottom: '1px solid #E2E8F0',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Eye size={16} className="text-primary" />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>
              Theme Preview
            </span>
            {themeName ? (
              <span style={{ fontSize: 13, color: '#6B7280' }}>— {themeName}</span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={closePreviewModal}
            aria-label="Close preview"
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#6B7280',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </header>

        <section
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px 24px 28px',
            minHeight: 640,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AiPreviewSlides tokens={tokens} />
        </section>

        <footer
          style={{
            height: 56,
            borderTop: '1px solid #E2E8F0',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={closePreviewModal}
            style={{
              height: 36,
              padding: '0 20px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: '#FFF',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
              fontFamily: 'inherit',
            }}
          >
            Close
          </button>
        </footer>
      </section>
    </section>
  );
}
