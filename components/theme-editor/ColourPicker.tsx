'use client';

import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';

export interface ColourPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

function toHex6ForPicker(value: string): string {
  const v = value.trim();
  if (!v.startsWith('#')) return '#000000';
  const body = v.slice(1);
  if (body.length < 6 || !/^[0-9A-Fa-f]{6}/i.test(body)) return '#000000';
  return `#${body.slice(0, 6)}`.toUpperCase();
}

export function ColourPicker({ value, onChange }: ColourPickerProps) {
  const safe = toHex6ForPicker(value);

  return (
    <div className={cn('theme-colourful w-full')}>
      <HexColorPicker
        color={safe}
        onChange={(hex) => onChange(hex.toUpperCase())}
        style={{ width: '100%', height: '200px' }}
      />
    </div>
  );
}
