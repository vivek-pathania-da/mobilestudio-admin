'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useThemeEditorStore } from '@/stores/theme-editor.store';
import { PromptInput } from './ai-modal/PromptInput';
import { LoadingState } from './ai-modal/LoadingState';
import { ResultState } from './ai-modal/ResultState';

export function AiGeneratorModal() {
  const {
    aiModalOpen, aiLoading, aiResult, aiError,
    closeAiModal, generateAiTheme, applyAiTheme, clearAiResult, customerId,
  } = useThemeEditorStore();
  const [promptForRegenerate, setPromptForRegenerate] = useState('');

  if (!aiModalOpen) return null;

  const handleGenerate = (prompt: string) => {
    setPromptForRegenerate(prompt);
    void generateAiTheme(prompt, customerId);
  };

  const handleRegenerate = (prompt: string) => {
    void generateAiTheme(prompt, customerId);
  };

  const handleNewPrompt = () => {
    clearAiResult();
  };

  const handleApply = () => {
    applyAiTheme();
    toast.success('AI theme applied — click Save Theme to keep it');
  };

  return (
    <div
      onClick={closeAiModal}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#FFF', borderRadius: 16, width: '100%', maxWidth: 780,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}
      >
        <div style={{ height: 56, borderBottom: '1px solid #E2E8F0', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} className="text-primary" />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>AI Theme Generator</span>
          </div>
          <button type="button" onClick={closeAiModal}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {aiLoading && <LoadingState />}
          {!aiLoading && !aiResult && !aiError && (
            <PromptInput onGenerate={handleGenerate} initialPrompt={promptForRegenerate} />
          )}
          {!aiLoading && aiError && (
            <div>
              <div style={{ margin: 24, padding: '10px 14px', background: '#FEF2F2',
                border: '1px solid #FCA5A5', borderRadius: 8, color: '#B91C1C', fontSize: 13 }}>
                {aiError}
              </div>
              <PromptInput onGenerate={handleGenerate} initialPrompt={promptForRegenerate} />
            </div>
          )}
          {!aiLoading && aiResult && (
            <ResultState result={aiResult} onRegenerate={handleRegenerate} onNewPrompt={handleNewPrompt} />
          )}
        </div>
        <div style={{ height: 64, borderTop: '1px solid #E2E8F0', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>
            {aiResult ? 'Applying replaces all colour tokens. Undo is available immediately.' : ''}
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button type="button" variant="ghost" onClick={closeAiModal}>
              Discard
            </Button>
            {aiResult ? (
              <Button type="button" onClick={handleApply} className="gap-1.5">
                <Sparkles className="size-3" />
                Apply to Editor
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
