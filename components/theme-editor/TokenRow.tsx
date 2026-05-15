'use client';

import { RotateCcw } from 'lucide-react';
import { isValidHex, isTransparent } from '@/lib/theme-editor/theme-editor.utils';
import { cn } from '@/lib/utils';

function displayHex(value: string): string {
  if (isTransparent(value)) return '';
  const raw = value.replace(/^#/, '').toUpperCase();
  return raw;
}

export interface TokenRowProps {
  tokenKey: string;
  value: string;
  isModified: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onReset: () => void;
}

export function TokenRow({
  tokenKey,
  value,
  isModified,
  isSelected,
  onSelect,
  onReset,
}: TokenRowProps) {
  const transparent = isTransparent(value);

  const swatchBg = transparent
    ? undefined
    : isValidHex(value)
      ? value.slice(0, 9)
      : '#CCCCCC';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        'flex h-[52px] cursor-pointer items-center gap-3 border-b border-border border-l border-l-transparent bg-white px-4 transition-colors',
        'hover:bg-[var(--color-primary-light)]',
        isSelected &&
          'bg-[var(--color-primary-light)] border-l-[var(--color-border-strong)]'
      )}
      aria-selected={isSelected}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={cn(
          'size-8 shrink-0 rounded-full border border-border',
          isSelected && 'outline outline-1 outline-offset-1 outline-[var(--color-border-strong)]'
        )}
        style={
          transparent
            ? {
                backgroundImage:
                  'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                backgroundColor: '#fff',
              }
            : { backgroundColor: swatchBg }
        }
        aria-label={`Colour for ${tokenKey}`}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-mono text-[13px] text-[#374151]">{tokenKey}</span>
        <span
          className={cn(
            'text-[10px] font-medium tracking-wide uppercase',
            isModified ? 'text-muted-foreground' : 'text-[#9CA3AF]'
          )}
        >
          {isModified ? 'Modified' : 'Default'}
        </span>
      </div>

      <div
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex h-8 w-24 shrink-0 items-center justify-center rounded-md border border-border bg-[#F9FAFB] px-1.5 font-mono text-[13px] text-[#374151] select-none',
          transparent && 'text-[#9CA3AF]'
        )}
        title="Edit in the colour panel on the right"
        aria-readonly="true"
      >
        {transparent ? 'transparent' : displayHex(value)}
      </div>

      <button
        type="button"
        disabled={!isModified}
        onClick={(e) => {
          e.stopPropagation();
          if (isModified) onReset();
        }}
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-md',
          isModified ? 'cursor-pointer text-muted-foreground' : 'cursor-default text-gray-300'
        )}
        aria-label={`Reset ${tokenKey}`}
      >
        <RotateCcw className="size-4" />
      </button>
    </div>
  );
}
