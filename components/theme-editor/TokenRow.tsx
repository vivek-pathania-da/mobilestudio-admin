'use client';

import { RotateCcw } from 'lucide-react';
import { isValidHex, isTransparent } from '@/lib/theme-editor/theme-editor.utils';
import { cn } from '@/lib/utils';

function displayHex(value: string): string {
  if (isTransparent(value)) return '';
  return value.replace(/^#/, '').toUpperCase();
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
        'flex h-[52px] cursor-pointer items-center gap-3 border-b border-[#E2E8F0] px-4',
        isModified && 'border-l-[3px] border-l-[#2563EB] bg-[#F8FBFF] pl-[13px]',
        !isModified && 'border-l-[3px] border-l-transparent bg-white',
        isSelected && 'shadow-[inset_0_0_0_1px_#2563EB]'
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={cn(
          'size-8 shrink-0 rounded-md border border-[#E2E8F0]',
          isSelected && 'outline outline-2 outline-offset-2 outline-[#2563EB]'
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
            isModified ? 'text-[#2563EB]' : 'text-[#9CA3AF]'
          )}
        >
          {isModified ? 'Modified' : 'Default'}
        </span>
      </div>

      <div
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex h-8 w-24 shrink-0 items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F9FAFB] px-1.5 font-mono text-[13px] text-[#374151] select-none',
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
          isModified ? 'cursor-pointer text-[#2563EB]' : 'cursor-default text-[#E2E8F0]'
        )}
        aria-label={`Reset ${tokenKey}`}
      >
        <RotateCcw className="size-4" />
      </button>
    </div>
  );
}
