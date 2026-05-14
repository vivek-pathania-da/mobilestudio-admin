/**
 * Canonical default theme — 312 tokens. Never stored in DynamoDB.
 * Merged with customer overrides at response time via resolveTheme().
 */
export const DEFAULT_THEME: Record<string, string> = {
    // BRAND
    primary: '#1D4ED8',
    primaryLight: '#60A5FA',
    primaryDark: '#1E3A8A',
    secondary: '#6B7280',
    secondaryLight: '#9CA3AF',
    secondaryDark: '#374151',
    tertiary: '#0EA5E9',
    accent: '#F59E0B',
  
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
    textLink: '#1D4ED8',
    textSuccess: '#15803D',
    textWarning: '#B45309',
    textError: '#B91C1C',
    textInfo: '#0369A1',
  
    // ICONS
    iconPrimary: '#111827',
    iconSecondary: '#4B5563',
    iconTertiary: '#6B7280',
    iconDisabled: '#9CA3AF',
    iconInverse: '#FFFFFF',
    iconSuccess: '#15803D',
    iconWarning: '#B45309',
    iconError: '#B91C1C',
    iconInfo: '#0369A1',
  
    // BORDERS
    borderPrimary: '#E5E7EB',
    borderSecondary: '#D1D5DB',
    borderFocused: '#1D4ED8',
    borderDisabled: '#E5E7EB',
    borderError: '#B91C1C',
    borderSuccess: '#15803D',
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
    info: '#0284C7',
    infoLight: '#38BDF8',
    infoDark: '#0369A1',
    infoBackground: '#E0F2FE',
  
    // BUTTONS
    buttonPrimaryBackground: '#1D4ED8',
    buttonPrimaryText: '#FFFFFF',
    buttonPrimaryBorder: '#1D4ED8',
    buttonPrimaryDisabledBackground: '#94A3B8',
    buttonPrimaryDisabledText: '#F1F5F9',
    buttonPrimaryDisabledBorder: '#94A3B8',
    buttonSecondaryBackground: '#FFFFFF',
    buttonSecondaryText: '#1D4ED8',
    buttonSecondaryBorder: '#1D4ED8',
    buttonSecondaryDisabledBackground: '#F8FAFC',
    buttonSecondaryDisabledText: '#94A3B8',
    buttonSecondaryDisabledBorder: '#CBD5E1',
    buttonTertiaryBackground: '#00000000',
    buttonTertiaryText: '#1D4ED8',
    buttonTertiaryBorder: '#00000000',
    buttonTertiaryDisabledBackground: '#00000000',
    buttonTertiaryDisabledText: '#94A3B8',
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
    inputFocusedBorder: '#1D4ED8',
    inputDisabledBorder: '#E5E7EB',
    inputDisabledBackground: '#F1F5F9',
    inputDisabledText: '#94A3B8',
    inputDisabledLabel: '#94A3B8',
    inputFocusedLabel: '#1D4ED8',
    inputErrorBorder: '#DC2626',
    inputErrorLabel: '#B91C1C',
    inputErrorIcon: '#B91C1C',
    inputSuccessBorder: '#16A34A',
    inputSuccessLabel: '#15803D',
    inputSuccessIcon: '#15803D',
    inputCursor: '#1D4ED8',
    inputSelection: '#1D4ED833',
    inputIcon: '#4B5563',
  
    // CHECKBOX
    checkboxActive: '#1D4ED8',
    checkboxInactive: '#FFFFFF',
    checkboxBorder: '#D1D5DB',
    checkboxCheck: '#FFFFFF',
  
    // RADIO
    radioActive: '#1D4ED8',
    radioInactive: '#FFFFFF',
    radioBorder: '#D1D5DB',
  
    // INLINE ALERTS
    alertSuccessBackground: '#F0FDF4',
    alertSuccessBorder: '#86EFAC',
    alertSuccessText: '#15803D',
    alertWarningBackground: '#FFFBEB',
    alertWarningBorder: '#FCD34D',
    alertWarningText: '#B45309',
    alertErrorBackground: '#FEF2F2',
    alertErrorBorder: '#FCA5A5',
    alertErrorText: '#B91C1C',
    alertInfoBackground: '#EFF6FF',
    alertInfoBorder: '#93C5FD',
    alertInfoText: '#0369A1',
  
    // NAVIGATION
    appBarBackground: '#FFFFFF',
    appBarText: '#111827',
    appBarIcon: '#111827',
    appBarBorder: '#E5E7EB',
    bottomNavBackground: '#FFFFFF',
    bottomNavSelected: '#1D4ED8',
    bottomNavUnselected: '#6B7280',
    bottomNavIndicator: '#1D4ED8',
    tabBarBackground: '#00000000',
    tabBarSelected: '#1D4ED8',
    tabBarUnselected: '#6B7280',
    tabBarIndicator: '#1D4ED8',
    drawerBackground: '#FFFFFF',
    drawerItem: '#374151',
    drawerSelectedItem: '#1D4ED8',
    drawerSelectedBackground: '#EFF6FF',
    drawerDivider: '#E5E7EB',
    drawerHeader: '#F9FAFB',
  
    // STATES
    hover: '#0000000F',
    pressed: '#00000014',
    focused: '#1D4ED81A',
    selected: '#1D4ED81A',
    disabled: '#D1D5DB',
  
    // SHIMMER / LOADING
    shimmerBase: '#E5E7EB',
    shimmerHighlight: '#F9FAFB',
    skeleton: '#E5E7EB',
    loader: '#1D4ED8',
    progressIndicator: '#1D4ED8',
  
    // SNACKBAR / TOAST / TOOLTIP
    snackbarBackground: '#1F2937',
    snackbarText: '#FFFFFF',
    toastBackground: '#1F2937',
    toastText: '#FFFFFF',
    tooltipBackground: '#1F2937',
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
  
    // GRADIENTS
    primaryGradientStart: '#1D4ED8',
    primaryGradientMiddle: '#3B82F6',
    primaryGradientEnd: '#60A5FA',
    secondaryGradientStart: '#6B7280',
    secondaryGradientEnd: '#9CA3AF',
    heroGradientStart: '#1D4ED8',
    heroGradientEnd: '#0EA5E9',
  
    // CHARTS
    chartPrimary: '#1D4ED8',
    chartSecondary: '#6B7280',
    chartTertiary: '#0EA5E9',
    chartQuaternary: '#F59E0B',
    chartPositive: '#16A34A',
    chartNegative: '#DC2626',
    chartNeutral: '#D97706',
    chartGrid: '#E5E7EB',
    chartAxis: '#6B7280',
    chartTooltip: '#1F2937',
  
    // FITNESS DOMAIN
    proteinColor: '#EF4444',
    carbsColor: '#F59E0B',
    fatColor: '#8B5CF6',
    fiberColor: '#22C55E',
    stepsColor: '#0EA5E9',
    sleepColor: '#6366F1',
    waterColor: '#06B6D4',
    weightColor: '#6B7280',
    workoutActive: '#1D4ED8',
    workoutCompleted: '#16A34A',
    workoutMissed: '#DC2626',
  
    // PREMIUM
    premiumGold: '#FBBF24',
    premiumSilver: '#D1D5DB',
    premiumPlatinum: '#E5E7EB',
    vipBackground: '#FFFBEB',
    vipBorder: '#FBBF24',
    vipText: '#92400E',
  
    // CALENDAR / TIMELINE
    calendarToday: '#1D4ED8',
    calendarSelected: '#6B7280',
    calendarEvent: '#F59E0B',
    calendarDisabled: '#D1D5DB',
    timelinePast: '#D1D5DB',
    timelineCurrent: '#1D4ED8',
    timelineFuture: '#9CA3AF',
  
    // EMPTY / PLACEHOLDER STATES
    emptyStateIcon: '#9CA3AF',
    emptyStateText: '#6B7280',
    emptyStateBackground: '#F9FAFB',
  
    // SEARCH
    searchBackground: '#FFFFFF',
    searchBorder: '#E5E7EB',
    searchFocusedBorder: '#1D4ED8',
    searchIcon: '#4B5563',
    searchPlaceholder: '#6B7280',
  
    // CHIPS / TAGS / PILLS
    chipBackground: '#F3F4F6',
    chipSelectedBackground: '#EFF6FF',
    chipText: '#374151',
    chipSelectedText: '#1D4ED8',
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
    fabBackground: '#1D4ED8',
    fabForeground: '#FFFFFF',
    fabShadow: '#00000014',
  
    // SLIDERS / SWITCHES / TOGGLES
    sliderActive: '#1D4ED8',
    sliderInactive: '#D1D5DB',
    sliderThumb: '#1D4ED8',
    switchActive: '#1D4ED8',
    switchInactive: '#D1D5DB',
    switchThumb: '#FFFFFF',
  
    // PROGRESS
    progressBackground: '#E5E7EB',
    progressValue: '#1D4ED8',
    progressSuccess: '#16A34A',
    progressWarning: '#D97706',
    progressError: '#DC2626',
  
    // TABLES / DATA GRID
    tableHeaderBackground: '#F3F4F6',
    tableHeaderText: '#111827',
    tableRowBackground: '#FFFFFF',
    tableAlternateRowBackground: '#F9FAFB',
    tableBorder: '#E5E7EB',
    tableSelectedRow: '#EFF6FF',
  
    // WEBVIEW / HTML
    webViewBackground: '#F9FAFB',
    htmlText: '#111827',
    htmlLink: '#1D4ED8',
    htmlCodeBlock: '#F3F4F6',
  
    // MEDIA / VIDEO
    videoOverlay: '#00000099',
    videoControls: '#FFFFFF',
    videoProgress: '#1D4ED8',
  
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
    wishlistColor: '#EF4444',
  
    // AI / CHAT UI
    chatUserBubble: '#1D4ED8',
    chatBotBubble: '#F3F4F6',
    chatUserText: '#FFFFFF',
    chatBotText: '#111827',
    typingIndicator: '#6B7280',
    aiHighlight: '#EFF6FF',
    promptCard: '#FFFFFF',
  
    // ROLE BASED
    trainerHighlight: '#7C3AED',
    coachAccent: '#0EA5E9',
    adminAccent: '#DC2626',
    memberAccent: '#1D4ED8',
  
    // ACHIEVEMENT / GAMIFICATION
    achievementGold: '#FBBF24',
    achievementSilver: '#D1D5DB',
    achievementBronze: '#B45309',
    streakColor: '#F97316',
    xpColor: '#7C3AED',
    levelUpColor: '#16A34A',
  
    // ACCESSIBILITY
    highContrastBackground: '#FFFFFF',
    highContrastText: '#000000',
    focusRing: '#1D4ED8',
    accessibilityHighlight: '#FFF3C4',
  
    // SKELETON VARIANTS
    skeletonDark: '#D1D5DB',
    skeletonLight: '#F3F4F6',
    skeletonAnimated: '#F9FAFB',
  
    // GESTURE / DRAG UI
    dragHandle: '#D1D5DB',
    dragPreview: '#EFF6FF',
    swipeActionBackground: '#DC2626',
  
    // MAPS / LOCATION
    mapMarker: '#1D4ED8',
    mapRoute: '#0EA5E9',
    mapCurrentLocation: '#16A34A',
    mapCluster: '#6B7280',
  
    // EXPERIMENTATION / FEATURE FLAGS
    experimentVariantA: '#1D4ED8',
    experimentVariantB: '#7C3AED',
    experimentHighlight: '#F97316',
  
    // MISC
    ratingStar: '#FBBF24',
    favoriteHeart: '#EF4444',
    bookmark: '#1D4ED8',
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
    headlineLarge: 24,
    headlineMedium: 22,
    titleLarge: 16,
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,
    labelLarge: 14,
    labelMedium: 12,
    buttonLarge: 16,
    buttonMedium: 14,
    inputText: 16,
    inputLabel: 14,
    appBarTitle: 18,
  };
  
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
  