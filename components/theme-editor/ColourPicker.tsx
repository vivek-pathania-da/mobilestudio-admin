'use client';

import { HexAlphaColorPicker } from 'react-colorful';
import { normalizeHexColor, toPickerHex } from '@/lib/theme-editor/theme-editor.utils';
import { cn } from '@/lib/utils';

export interface ColourPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export function ColourPicker({ value, onChange }: ColourPickerProps) {
  const pickerValue = toPickerHex(value);

  return (
    <div
      className={cn('theme-colourful theme-colourful-alpha w-full')}
      style={{
        backgroundImage:
          'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
        backgroundSize: '12px 12px',
        backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '4px',
      }}
    >
      <HexAlphaColorPicker
        color={pickerValue}
        onChange={(hex) => onChange(normalizeHexColor(hex))}
        style={{ width: '100%', height: '220px' }}
      />
    </div>
  );
}
