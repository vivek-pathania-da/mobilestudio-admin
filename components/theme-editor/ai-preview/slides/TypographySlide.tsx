'use client';

import { PreviewShell, tk, type SlideProps } from './shared';

export function TypographySlide({ tokens }: SlideProps) {
  return (
    <PreviewShell tokens={tokens} title="Typography" activeTab={3}>
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: tk(tokens, 'textPrimary', '#111827'),
          margin: 0,
          flexShrink: 0,
        }}
      >
        Display heading
      </p>
      <p
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: tk(tokens, 'textPrimary', '#111827'),
          margin: 0,
          flexShrink: 0,
        }}
      >
        Section title
      </p>
      <p
        style={{
          fontSize: 10,
          fontWeight: 400,
          color: tk(tokens, 'textSecondary', '#6B7280'),
          lineHeight: 1.5,
          margin: 0,
          flexShrink: 0,
        }}
      >
        Body text for paragraphs and descriptions across the app.
      </p>
      <p
        style={{
          fontSize: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: tk(tokens, 'textTertiary', '#9CA3AF'),
          margin: 0,
          flexShrink: 0,
        }}
      >
        Overline label
      </p>
      <p
        style={{
          fontSize: 10,
          color: tk(tokens, 'textLink', '#111827'),
          textDecoration: 'underline',
          margin: 0,
          flexShrink: 0,
        }}
      >
        Link text →
      </p>
      <p
        style={{
          fontSize: 10,
          color: tk(tokens, 'textDisabled', '#9CA3AF'),
          margin: 0,
          flexShrink: 0,
        }}
      >
        Disabled text
      </p>
      <hr
        style={{
          height: 1,
          border: 'none',
          background: tk(tokens, 'divider', '#E2E8F0'),
          margin: '2px 0',
          flexShrink: 0,
        }}
      />
      {[
        ['✓', 'textSuccess', 'Success message'],
        ['✕', 'textError', 'Error message'],
        ['⚠', 'textWarning', 'Warning message'],
        ['ℹ', 'textInfo', 'Info message'],
      ].map(([icon, key, text]) => (
        <p
          key={text}
          style={{
            fontSize: 10,
            color: tk(tokens, key, '#111827'),
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0,
          }}
        >
          <span>{icon}</span>
          <span>{text}</span>
        </p>
      ))}
    </PreviewShell>
  );
}
