export const colors = {
  // Brand
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primaryForeground: '#F8FAFC',

  // Page
  pageBackground: '#F9FAFB',
  background: '#FFFFFF',
  foreground: '#0F172A',

  // Text scale
  textPrimary: '#0F172A',
  textSecondary: '#374151',
  textTertiary: '#6B7280',
  textDisabled: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  borderFocus: '#2563EB',

  // Surfaces
  card: '#FFFFFF',
  muted: '#F1F5F9',
  mutedForeground: '#64748B',

  // Sidebar (dark)
  sidebar: '#111827',
  sidebarForeground: '#F9FAFB',
  sidebarMuted: '#9CA3AF',
  sidebarAccent: '#2563EB',
  sidebarBorder: '#1F2937',
  sidebarHover: '#1F2937',

  // Status
  success: '#16A34A',
  successLight: '#DCFCE7',
  successForeground: '#15803D',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  warningForeground: '#B45309',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  errorForeground: '#B91C1C',
  info: '#0284C7',
  infoLight: '#E0F2FE',
  infoForeground: '#0369A1',

  // Destructive (shadcn)
  destructive: '#DC2626',
  destructiveForeground: '#F8FAFC',
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Menlo, monospace',
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
} as const;

export const radii = {
  sm: '0.375rem', // 6px  — inputs, small elements
  md: '0.5rem', // 8px  — buttons, badges
  lg: '0.75rem', // 12px — cards, panels
  xl: '1rem', // 16px — modals, large cards
  full: '9999px', // pills, avatars
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
} as const;

export const layout = {
  sidebarWidth: '240px',
  topBarHeight: '56px',
  contentMaxWidth: '1200px',
  contentPadding: '2rem',
} as const;

export const animation = {
  duration: {
    fast: '100ms',
    normal: '150ms',
    slow: '300ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
  },
} as const;

// Status badge config — used across all tables and cards
export const statusConfig = {
  active: {
    label: 'Active',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  trial: {
    label: 'Trial',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  suspended: {
    label: 'Suspended',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  churned: {
    label: 'Churned',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  },
  admin: {
    label: 'Admin',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  user: {
    label: 'User',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  },
} as const;

export type StatusKey = keyof typeof statusConfig;
