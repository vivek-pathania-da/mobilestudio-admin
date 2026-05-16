'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  onGenerate: (prompt: string) => void;
  initialPrompt?: string;
};

export function PromptInput({ onGenerate, initialPrompt = '' }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const canSubmit = prompt.trim().length >= 5;

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
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{prompt.length} / 500</span>
        <Button
          type="button"
          size="lg"
          className="h-10 gap-1.5 px-5"
          disabled={!canSubmit}
          onClick={() => onGenerate(prompt)}
        >
          <Sparkles className="size-3.5" />
          Generate Theme →
        </Button>
      </div>
    </section>
  );
}
