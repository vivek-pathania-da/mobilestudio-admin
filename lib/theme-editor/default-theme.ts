/**
 * Canonical default theme — 312 tokens. Never stored in DynamoDB.
 * Merged with customer overrides at response time via resolveTheme().
 *
 * Palette: black, white, greys; success = standard green; error = standard red.
 */
export const DEFAULT_THEME: Record<string, string> = {
  // BRAND (monochrome)
  primary: '#111827',
  primaryLight: '#F3F4F6',
  primaryDark: '#000000',
  secondary: '#6B7280',
  secondaryLight: '#9CA3AF',
  secondaryDark: '#374151',
  tertiary: '#4B5563',
  accent: '#6B7280',

  // BACKGROUNDS
  background: '#F9FAFB',
  backgroundSecondary: '#F3F4F6',
  backgroundTertiary: '#E5E7EB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F9FAFB',
  surfaceTertiary: '#F3F4F6',
  screenBackground: '#F9FAFB',
  cardBackground: '#FFFFFF',
  cardBorder: '#E5E7EB',
  modalBackground: '#FFFFFF',
  bottomSheetBackground: '#FFFFFF',
  dialogBackground: '#FFFFFF',
  overlay: '#00000080',
  scrim: '#00000066',

  // TEXT
  textPrimary: '#111827',
  textSecondary: '#374151',
  textTertiary: '#6B7280',
  textDisabled: '#9CA3AF',
  textInverse: '#FFFFFF',
  textLink: '#111827',
  textSuccess: '#15803D',
  textWarning: '#92400E',
  textError: '#B91C1C',
  textInfo: '#4B5563',

  // ICONS
  iconPrimary: '#111827',
  iconSecondary: '#4B5563',
  iconTertiary: '#6B7280',
  iconDisabled: '#9CA3AF',
  iconInverse: '#FFFFFF',
  iconSuccess: '#15803D',
  iconWarning: '#B45309',
  iconError: '#B91C1C',
  iconInfo: '#6B7280',

  // BORDERS
  borderPrimary: '#E5E7EB',
  borderSecondary: '#D1D5DB',
  borderFocused: '#111827',
  borderDisabled: '#E5E7EB',
  borderError: '#DC2626',
  borderSuccess: '#16A34A',
  divider: '#E5E7EB',
  outline: '#D1D5DB',
  outlineVariant: '#E5E7EB',

  // STATUS
  success: '#16A34A',
  successLight: '#4ADE80',
  successDark: '#15803D',
  successBackground: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FCD34D',
  warningDark: '#B45309',
  warningBackground: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#F87171',
  errorDark: '#B91C1C',
  errorBackground: '#FEE2E2',
  info: '#6B7280',
  infoLight: '#9CA3AF',
  infoDark: '#374151',
  infoBackground: '#F3F4F6',

  // BUTTONS
  buttonPrimaryBackground: '#111827',
  buttonPrimaryText: '#FFFFFF',
  buttonPrimaryBorder: '#111827',
  buttonPrimaryDisabledBackground: '#D1D5DB',
  buttonPrimaryDisabledText: '#F9FAFB',
  buttonPrimaryDisabledBorder: '#D1D5DB',
  buttonSecondaryBackground: '#FFFFFF',
  buttonSecondaryText: '#111827',
  buttonSecondaryBorder: '#D1D5DB',
  buttonSecondaryDisabledBackground: '#F9FAFB',
  buttonSecondaryDisabledText: '#9CA3AF',
  buttonSecondaryDisabledBorder: '#E5E7EB',
  buttonTertiaryBackground: '#00000000',
  buttonTertiaryText: '#111827',
  buttonTertiaryBorder: '#00000000',
  buttonTertiaryDisabledBackground: '#00000000',
  buttonTertiaryDisabledText: '#9CA3AF',
  buttonTertiaryDisabledBorder: '#00000000',
  buttonDangerBackground: '#DC2626',
  buttonDangerText: '#FFFFFF',
  buttonDangerBorder: '#DC2626',
  buttonDangerDisabledBackground: '#FCA5A5',
  buttonDangerDisabledText: '#FFFFFF',
  buttonDangerDisabledBorder: '#FCA5A5',

  // INPUTS
  inputBackground: '#FFFFFF',
  inputText: '#111827',
  inputHint: '#6B7280',
  inputLabel: '#374151',
  inputBorder: '#E5E7EB',
  inputFocusedBorder: '#111827',
  inputDisabledBorder: '#E5E7EB',
  inputDisabledBackground: '#F3F4F6',
  inputDisabledText: '#9CA3AF',
  inputDisabledLabel: '#9CA3AF',
  inputFocusedLabel: '#111827',
  inputErrorBorder: '#DC2626',
  inputErrorLabel: '#B91C1C',
  inputErrorIcon: '#DC2626',
  inputSuccessBorder: '#16A34A',
  inputSuccessLabel: '#15803D',
  inputSuccessIcon: '#16A34A',
  inputCursor: '#111827',
  inputSelection: '#11182733',
  inputIcon: '#6B7280',

  // CHECKBOX
  checkboxActive: '#111827',
  checkboxInactive: '#FFFFFF',
  checkboxBorder: '#D1D5DB',
  checkboxCheck: '#FFFFFF',

  // RADIO
  radioActive: '#111827',
  radioInactive: '#FFFFFF',
  radioBorder: '#D1D5DB',

  // INLINE ALERTS
  alertSuccessBackground: '#DCFCE7',
  alertSuccessBorder: '#86EFAC',
  alertSuccessText: '#15803D',
  alertWarningBackground: '#FEF3C7',
  alertWarningBorder: '#FCD34D',
  alertWarningText: '#92400E',
  alertErrorBackground: '#FEE2E2',
  alertErrorBorder: '#FCA5A5',
  alertErrorText: '#B91C1C',
  alertInfoBackground: '#F3F4F6',
  alertInfoBorder: '#D1D5DB',
  alertInfoText: '#374151',

  // NAVIGATION
  appBarBackground: '#FFFFFF',
  appBarText: '#111827',
  appBarIcon: '#111827',
  appBarBorder: '#E5E7EB',
  bottomNavBackground: '#FFFFFF',
  bottomNavSelected: '#111827',
  bottomNavUnselected: '#9CA3AF',
  bottomNavIndicator: '#111827',
  tabBarBackground: '#00000000',
  tabBarSelected: '#111827',
  tabBarUnselected: '#9CA3AF',
  tabBarIndicator: '#111827',
  drawerBackground: '#FFFFFF',
  drawerItem: '#374151',
  drawerSelectedItem: '#111827',
  drawerSelectedBackground: '#F3F4F6',
  drawerDivider: '#E5E7EB',
  drawerHeader: '#F9FAFB',

  // STATES
  hover: '#0000000F',
  pressed: '#00000014',
  focused: '#1118271A',
  selected: '#11182714',
  disabled: '#D1D5DB',

  // SHIMMER / LOADING
  shimmerBase: '#E5E7EB',
  shimmerHighlight: '#F9FAFB',
  skeleton: '#E5E7EB',
  loader: '#6B7280',
  progressIndicator: '#111827',

  // SNACKBAR / TOAST / TOOLTIP
  snackbarBackground: '#111827',
  snackbarText: '#FFFFFF',
  toastBackground: '#111827',
  toastText: '#FFFFFF',
  tooltipBackground: '#111827',
  tooltipText: '#FFFFFF',

  // BADGES / NOTIFICATIONS
  badgeBackground: '#DC2626',
  badgeText: '#FFFFFF',
  notificationDot: '#DC2626',
  notificationBackground: '#FFFFFF',
  notificationText: '#111827',

  // SHADOWS
  shadowPrimary: '#00000014',
  shadowSecondary: '#0000000A',
  elevationShadow: '#0000001A',

  // GRADIENTS (greyscale)
  primaryGradientStart: '#111827',
  primaryGradientMiddle: '#374151',
  primaryGradientEnd: '#6B7280',
  secondaryGradientStart: '#6B7280',
  secondaryGradientEnd: '#9CA3AF',
  heroGradientStart: '#111827',
  heroGradientEnd: '#4B5563',

  // CHARTS
  chartPrimary: '#111827',
  chartSecondary: '#6B7280',
  chartTertiary: '#9CA3AF',
  chartQuaternary: '#D1D5DB',
  chartPositive: '#16A34A',
  chartNegative: '#DC2626',
  chartNeutral: '#6B7280',
  chartGrid: '#E5E7EB',
  chartAxis: '#6B7280',
  chartTooltip: '#111827',

  // FITNESS DOMAIN (grey scale + semantic success/error where needed)
  proteinColor: '#374151',
  carbsColor: '#6B7280',
  fatColor: '#9CA3AF',
  fiberColor: '#4B5563',
  stepsColor: '#111827',
  sleepColor: '#4B5563',
  waterColor: '#6B7280',
  weightColor: '#374151',
  workoutActive: '#111827',
  workoutCompleted: '#16A34A',
  workoutMissed: '#DC2626',

  // PREMIUM (neutral metallics)
  premiumGold: '#9CA3AF',
  premiumSilver: '#D1D5DB',
  premiumPlatinum: '#E5E7EB',
  vipBackground: '#F3F4F6',
  vipBorder: '#D1D5DB',
  vipText: '#374151',

  // CALENDAR / TIMELINE
  calendarToday: '#111827',
  calendarSelected: '#374151',
  calendarEvent: '#6B7280',
  calendarDisabled: '#D1D5DB',
  timelinePast: '#D1D5DB',
  timelineCurrent: '#111827',
  timelineFuture: '#9CA3AF',

  // EMPTY / PLACEHOLDER STATES
  emptyStateIcon: '#9CA3AF',
  emptyStateText: '#6B7280',
  emptyStateBackground: '#F9FAFB',

  // SEARCH
  searchBackground: '#FFFFFF',
  searchBorder: '#E5E7EB',
  searchFocusedBorder: '#111827',
  searchIcon: '#6B7280',
  searchPlaceholder: '#9CA3AF',

  // CHIPS / TAGS / PILLS
  chipBackground: '#F3F4F6',
  chipSelectedBackground: '#E5E7EB',
  chipText: '#374151',
  chipSelectedText: '#111827',
  chipBorder: '#E5E7EB',
  tagBackground: '#F3F4F6',
  tagText: '#374151',

  // AVATAR / PROFILE
  avatarBackground: '#E5E7EB',
  avatarText: '#111827',
  avatarBorder: '#E5E7EB',
  onlineStatus: '#16A34A',
  awayStatus: '#D97706',
  busyStatus: '#DC2626',
  offlineStatus: '#9CA3AF',

  // FLOATING ACTION BUTTON
  fabBackground: '#111827',
  fabForeground: '#FFFFFF',
  fabShadow: '#00000014',

  // SLIDERS / SWITCHES / TOGGLES
  sliderActive: '#111827',
  sliderInactive: '#D1D5DB',
  sliderThumb: '#111827',
  switchActive: '#111827',
  switchInactive: '#D1D5DB',
  switchThumb: '#FFFFFF',

  // PROGRESS
  progressBackground: '#E5E7EB',
  progressValue: '#111827',
  progressSuccess: '#16A34A',
  progressWarning: '#D97706',
  progressError: '#DC2626',

  // TABLES / DATA GRID
  tableHeaderBackground: '#F3F4F6',
  tableHeaderText: '#111827',
  tableRowBackground: '#FFFFFF',
  tableAlternateRowBackground: '#F9FAFB',
  tableBorder: '#E5E7EB',
  tableSelectedRow: '#F3F4F6',

  // WEBVIEW / HTML
  webViewBackground: '#F9FAFB',
  htmlText: '#111827',
  htmlLink: '#111827',
  htmlCodeBlock: '#F3F4F6',

  // MEDIA / VIDEO
  videoOverlay: '#00000099',
  videoControls: '#FFFFFF',
  videoProgress: '#111827',

  // AUTHENTICATION
  loginBackground: '#F9FAFB',
  signupBackground: '#F9FAFB',
  otpBackground: '#F9FAFB',
  authCardBackground: '#FFFFFF',

  // ECOMMERCE
  priceColor: '#111827',
  discountColor: '#16A34A',
  outOfStockColor: '#DC2626',
  cartBadgeColor: '#DC2626',
  wishlistColor: '#DC2626',

  // AI / CHAT UI
  chatUserBubble: '#111827',
  chatBotBubble: '#F3F4F6',
  chatUserText: '#FFFFFF',
  chatBotText: '#111827',
  typingIndicator: '#9CA3AF',
  aiHighlight: '#F3F4F6',
  promptCard: '#FFFFFF',

  // ROLE BASED (neutral greys)
  trainerHighlight: '#374151',
  coachAccent: '#6B7280',
  adminAccent: '#111827',
  memberAccent: '#4B5563',

  // ACHIEVEMENT / GAMIFICATION
  achievementGold: '#9CA3AF',
  achievementSilver: '#D1D5DB',
  achievementBronze: '#6B7280',
  streakColor: '#374151',
  xpColor: '#4B5563',
  levelUpColor: '#16A34A',

  // ACCESSIBILITY
  highContrastBackground: '#FFFFFF',
  highContrastText: '#000000',
  focusRing: '#111827',
  accessibilityHighlight: '#F3F4F6',

  // SKELETON VARIANTS
  skeletonDark: '#D1D5DB',
  skeletonLight: '#F3F4F6',
  skeletonAnimated: '#F9FAFB',

  // GESTURE / DRAG UI
  dragHandle: '#D1D5DB',
  dragPreview: '#F3F4F6',
  swipeActionBackground: '#DC2626',

  // MAPS / LOCATION
  mapMarker: '#111827',
  mapRoute: '#6B7280',
  mapCurrentLocation: '#16A34A',
  mapCluster: '#9CA3AF',

  // EXPERIMENTATION / FEATURE FLAGS
  experimentVariantA: '#111827',
  experimentVariantB: '#6B7280',
  experimentHighlight: '#374151',

  // MISC
  ratingStar: '#6B7280',
  favoriteHeart: '#DC2626',
  bookmark: '#111827',
  onlineIndicator: '#16A34A',
  offlineIndicator: '#9CA3AF',
  successCheckmark: '#16A34A',
  warningIndicator: '#D97706',
  errorIndicator: '#DC2626',
};

export const DEFAULT_FONT_FAMILIES: Record<string, string> = {
  primary: 'Inter',
  secondary: 'Roboto',
  mono: 'JetBrainsMono',
};

export const DEFAULT_FONT_SIZES: Record<string, number> = {
  displayLarge: 48,
  displayMedium: 40,
  displaySmall: 32,
  headlineLarge: 24,
  headlineMedium: 22,
  headlineSmall: 20,
  titleLarge: 16,
  titleMedium: 14,
  titleSmall: 12,
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 12,
  labelLarge: 14,
  labelMedium: 12,
  labelSmall: 10,
  buttonLarge: 16,
  buttonMedium: 14,
  buttonSmall: 12,
  inputText: 16,
  inputLabel: 14,
  appBarTitle: 18,
};

// ─────────────────────────────────────────────────────────────
// DEFAULT RADIUS TOKENS
// ─────────────────────────────────────────────────────────────

export const DEFAULT_RADIUS_TOKENS: Record<string, number> = {
  radiusNone: 0,
  radiusXs: 3,
  radiusSm: 6,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 9999,
  radiusButton: 8,
  radiusInput: 8,
  radiusCard: 12,
  radiusModal: 16,
  radiusChip: 8,
  radiusBadge: 9999,
  radiusAvatar: 9999,
  radiusBottomSheet: 24,
  radiusIconButton: 8,
  radiusToast: 8,
  radiusIcon: 8,
};

export const RADIUS_TOKEN_LABELS: Record<string, string> = {
  radiusNone: 'None',
  radiusXs: 'Extra Small',
  radiusSm: 'Small',
  radiusMd: 'Medium',
  radiusLg: 'Large',
  radiusXl: 'Extra Large',
  radiusFull: 'Full / Pill',
  radiusButton: 'Button',
  radiusInput: 'Input Field',
  radiusCard: 'Card',
  radiusModal: 'Modal / Dialog',
  radiusChip: 'Chip',
  radiusBadge: 'Badge',
  radiusAvatar: 'Avatar',
  radiusBottomSheet: 'Bottom Sheet',
  radiusIconButton: 'Icon Button',
  radiusToast: 'Toast / Snackbar',
  radiusIcon: 'Icon Container',
};

export const FIXED_RADIUS_TOKENS = new Set([
  'radiusNone',
  'radiusFull',
  'radiusBadge',
  'radiusAvatar',
]);

export const PILL_RADIUS_TOKENS = new Set([
  'radiusButton',
  'radiusChip',
  'radiusInput',
  'radiusIconButton',
  'radiusToast',
  'radiusIcon',
]);

export const RADIUS_TOKEN_MAX: Record<string, number> = {
  radiusButton: 9999,
  radiusInput: 9999,
  radiusCard: 24,
  radiusModal: 28,
  radiusChip: 9999,
  radiusBottomSheet: 32,
  radiusIconButton: 9999,
  radiusToast: 9999,
  radiusIcon: 9999,
  radiusXs: 8,
  radiusSm: 12,
  radiusMd: 20,
  radiusLg: 28,
  radiusXl: 40,
};

/** User-editable component radius keys (Shape category). */
export const COMPONENT_RADIUS_KEYS = [
  'radiusButton',
  'radiusInput',
  'radiusCard',
  'radiusModal',
  'radiusChip',
  'radiusBottomSheet',
  'radiusIconButton',
] as const;

/** Semantic palette keys persisted via PUT `radiusPalette`. */
export const SEMANTIC_RADIUS_PALETTE_KEYS = [
  'radiusButton',
  'radiusInput',
  'radiusCard',
  'radiusModal',
  'radiusChip',
  'radiusBottomSheet',
] as const;

export const VALID_FONT_FAMILY_KEYS = new Set(Object.keys(DEFAULT_FONT_FAMILIES));
export const VALID_FONT_SIZE_KEYS = new Set(Object.keys(DEFAULT_FONT_SIZES));

export function isValidFontFamily(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 100;
}

export function isValidFontSize(value: unknown): boolean {
  return typeof value === 'number' && value >= 8 && value <= 96 && Number.isFinite(value);
}

export function resolveFontFamilies(overrides: Record<string, string>): Record<string, string> {
  return { ...DEFAULT_FONT_FAMILIES, ...overrides };
}

export function resolveFontSizes(overrides: Record<string, number>): Record<string, number> {
  return { ...DEFAULT_FONT_SIZES, ...overrides };
}

/** Complete list of valid token keys — used for request validation */
export const VALID_TOKEN_KEYS = new Set(Object.keys(DEFAULT_THEME));

/** Hex validation — #RRGGBB or #RRGGBBAA */
export function isValidHex(value: string): boolean {
  return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value);
}

/** Merge customer overrides onto default theme */
export function resolveTheme(overrides: Record<string, string>): Record<string, string> {
  return { ...DEFAULT_THEME, ...overrides };
}
