'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdvancedOptions, type AdvancedOptionsValue } from './AdvancedOptions';

type Props = {
  onGenerate: (prompt: string, advancedOptions: AdvancedOptionsValue) => void;
  initialPrompt?: string;
};

const DEFAULT_ADVANCED_OPTIONS: AdvancedOptionsValue = {
  themeMode: 'auto',
  brandColours: [],
  darkVersionMode: false,
  image: null,
};

export function PromptInput({ onGenerate, initialPrompt = '' }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [advancedOptions, setAdvancedOptions] =
    useState<AdvancedOptionsValue>(DEFAULT_ADVANCED_OPTIONS);

  const canGenerate =
    prompt.trim().length >= 5 || advancedOptions.image !== null;

  return (
    <section className="border-b border-border px-6 py-6">
      <p className="mb-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
        Describe your theme
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        maxLength={500}
        autoFocus
        placeholder="e.g. luxury airline with dark navy and gold accents for Christmas"
        className="box-border min-h-20 w-full resize-none rounded-lg border border-border bg-white px-3 py-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      {advancedOptions.image && prompt.trim().length === 0 && (
        <p
          style={{
            fontSize: 12,
            color: '#6B7280',
            margin: '4px 0 0 0',
          }}
        >
          Add a description to guide the style, or leave blank to let Claude decide from
          the image.
        </p>
      )}
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{prompt.length} / 500</span>
        </div>
        <AdvancedOptions onChange={setAdvancedOptions} />
        <div className="flex justify-end">
          <Button
            type="button"
            size="lg"
            className="h-10 gap-1.5 px-5"
            disabled={!canGenerate}
            onClick={() => onGenerate(prompt, advancedOptions)}
          >
            <Sparkles className="size-3.5" />
            Generate Theme →
          </Button>
        </div>
      </div>
    </section>
  );
}
