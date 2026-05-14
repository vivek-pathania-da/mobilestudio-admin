// lib/theme-editor/token-categories.ts

export type Tab = 'core' | 'extended'

export interface TokenSubcategory {
  label: string
  tokens: string[]
}

export interface TokenCategory {
  id: string
  label: string
  tab: Tab
  icon: string           // lucide icon name
  subcategories: TokenSubcategory[]
}

export const TOKEN_CATEGORIES: TokenCategory[] = [

    // ── CORE TAB ──────────────────────────────────────────
  
    {
      id: 'brand',
      label: 'Brand',
      tab: 'core',
      icon: 'Palette',
      subcategories: [
        {
          label: 'Primary',
          tokens: ['primary', 'primaryLight', 'primaryDark'],
        },
        {
          label: 'Secondary',
          tokens: ['secondary', 'secondaryLight', 'secondaryDark'],
        },
        {
          label: 'Accent',
          tokens: ['tertiary', 'accent'],
        },
      ],
    },
  
    {
      id: 'backgrounds',
      label: 'Backgrounds',
      tab: 'core',
      icon: 'Square',
      subcategories: [
        {
          label: 'Page',
          tokens: ['background', 'backgroundSecondary', 'backgroundTertiary'],
        },
        {
          label: 'Surface',
          tokens: ['surface', 'surfaceSecondary', 'surfaceTertiary', 'screenBackground'],
        },
        {
          label: 'Components',
          tokens: ['cardBackground', 'modalBackground', 'bottomSheetBackground', 'dialogBackground'],
        },
        {
          label: 'Overlay',
          tokens: ['overlay', 'scrim'],
        },
      ],
    },
  
    {
      id: 'text',
      label: 'Text',
      tab: 'core',
      icon: 'Type',
      subcategories: [
        {
          label: 'Scale',
          tokens: ['textPrimary', 'textSecondary', 'textTertiary', 'textDisabled', 'textInverse'],
        },
        {
          label: 'Semantic',
          tokens: ['textLink', 'textSuccess', 'textWarning', 'textError', 'textInfo'],
        },
      ],
    },
  
    {
      id: 'icons',
      label: 'Icons',
      tab: 'core',
      icon: 'Star',
      subcategories: [
        {
          label: 'Scale',
          tokens: ['iconPrimary', 'iconSecondary', 'iconTertiary', 'iconDisabled', 'iconInverse'],
        },
        {
          label: 'Semantic',
          tokens: ['iconSuccess', 'iconWarning', 'iconError', 'iconInfo'],
        },
      ],
    },
  
    {
      id: 'borders',
      label: 'Borders',
      tab: 'core',
      icon: 'Frame',
      subcategories: [
        {
          label: 'Default',
          tokens: ['borderPrimary', 'borderSecondary', 'divider', 'outline', 'outlineVariant'],
        },
        {
          label: 'State',
          tokens: ['borderFocused', 'borderDisabled', 'borderError', 'borderSuccess'],
        },
      ],
    },
  
    {
      id: 'status',
      label: 'Status',
      tab: 'core',
      icon: 'CheckCircle',
      subcategories: [
        {
          label: 'Success',
          tokens: ['success', 'successLight', 'successDark', 'successBackground'],
        },
        {
          label: 'Warning',
          tokens: ['warning', 'warningLight', 'warningDark', 'warningBackground'],
        },
        {
          label: 'Error',
          tokens: ['error', 'errorLight', 'errorDark', 'errorBackground'],
        },
        {
          label: 'Info',
          tokens: ['info', 'infoLight', 'infoDark', 'infoBackground'],
        },
      ],
    },
  
    {
      id: 'alerts',
      label: 'Inline Alerts',
      tab: 'core',
      icon: 'AlertTriangle',
      subcategories: [
        {
          label: 'Success',
          tokens: ['alertSuccessBackground', 'alertSuccessBorder', 'alertSuccessText'],
        },
        {
          label: 'Warning',
          tokens: ['alertWarningBackground', 'alertWarningBorder', 'alertWarningText'],
        },
        {
          label: 'Error',
          tokens: ['alertErrorBackground', 'alertErrorBorder', 'alertErrorText'],
        },
        {
          label: 'Info',
          tokens: ['alertInfoBackground', 'alertInfoBorder', 'alertInfoText'],
        },
      ],
    },
  
    {
      id: 'buttons',
      label: 'Buttons',
      tab: 'core',
      icon: 'MousePointer',
      subcategories: [
        {
          label: 'Primary',
          tokens: [
            'buttonPrimaryBackground', 'buttonPrimaryText', 'buttonPrimaryBorder',
            'buttonPrimaryDisabledBackground', 'buttonPrimaryDisabledText', 'buttonPrimaryDisabledBorder',
          ],
        },
        {
          label: 'Secondary',
          tokens: [
            'buttonSecondaryBackground', 'buttonSecondaryText', 'buttonSecondaryBorder',
            'buttonSecondaryDisabledBackground', 'buttonSecondaryDisabledText', 'buttonSecondaryDisabledBorder',
          ],
        },
        {
          label: 'Tertiary',
          tokens: [
            'buttonTertiaryBackground', 'buttonTertiaryText', 'buttonTertiaryBorder',
            'buttonTertiaryDisabledBackground', 'buttonTertiaryDisabledText', 'buttonTertiaryDisabledBorder',
          ],
        },
        {
          label: 'Danger',
          tokens: [
            'buttonDangerBackground', 'buttonDangerText', 'buttonDangerBorder',
            'buttonDangerDisabledBackground', 'buttonDangerDisabledText', 'buttonDangerDisabledBorder',
          ],
        },
      ],
    },
  
    {
      id: 'inputs',
      label: 'Inputs',
      tab: 'core',
      icon: 'TextCursorInput',
      subcategories: [
        {
          label: 'Default',
          tokens: ['inputBackground', 'inputText', 'inputHint', 'inputLabel', 'inputBorder', 'inputCursor', 'inputSelection', 'inputIcon'],
        },
        {
          label: 'Focused',
          tokens: ['inputFocusedBorder', 'inputFocusedLabel'],
        },
        {
          label: 'Disabled',
          tokens: ['inputDisabledBorder', 'inputDisabledBackground', 'inputDisabledText', 'inputDisabledLabel'],
        },
        {
          label: 'Error',
          tokens: ['inputErrorBorder', 'inputErrorLabel', 'inputErrorIcon'],
        },
        {
          label: 'Success',
          tokens: ['inputSuccessBorder', 'inputSuccessLabel', 'inputSuccessIcon'],
        },
      ],
    },
  
    {
      id: 'checkbox',
      label: 'Checkbox',
      tab: 'core',
      icon: 'CheckSquare',
      subcategories: [
        {
          label: 'States',
          tokens: ['checkboxActive', 'checkboxInactive', 'checkboxBorder', 'checkboxCheck'],
        },
      ],
    },
  
    {
      id: 'radio',
      label: 'Radio',
      tab: 'core',
      icon: 'Circle',
      subcategories: [
        {
          label: 'States',
          tokens: ['radioActive', 'radioInactive', 'radioBorder'],
        },
      ],
    },
  
    {
      id: 'navigation',
      label: 'Navigation',
      tab: 'core',
      icon: 'Navigation',
      subcategories: [
        {
          label: 'App Bar',
          tokens: ['appBarBackground', 'appBarText', 'appBarIcon', 'appBarBorder'],
        },
        {
          label: 'Bottom Nav',
          tokens: ['bottomNavBackground', 'bottomNavSelected', 'bottomNavUnselected', 'bottomNavIndicator'],
        },
        {
          label: 'Tab Bar',
          tokens: ['tabBarBackground', 'tabBarSelected', 'tabBarUnselected', 'tabBarIndicator'],
        },
        {
          label: 'Drawer',
          tokens: ['drawerBackground', 'drawerItem', 'drawerSelectedItem', 'drawerSelectedBackground', 'drawerDivider', 'drawerHeader'],
        },
      ],
    },
  
    {
      id: 'typography',
      label: 'Typography',
      tab: 'core',
      icon: 'Type',
      subcategories: [
        // Font tokens are handled separately
        // This category renders the font editor UI
        // not colour swatches
      ],
    },
  
    // ── EXTENDED TAB ───────────────────────────────────────
  
    {
      id: 'states',
      label: 'States',
      tab: 'extended',
      icon: 'Layers',
      subcategories: [
        {
          label: 'Interactive',
          tokens: ['hover', 'pressed', 'focused', 'selected', 'disabled'],
        },
      ],
    },
  
    {
      id: 'loading',
      label: 'Loading',
      tab: 'extended',
      icon: 'Loader',
      subcategories: [
        {
          label: 'Shimmer',
          tokens: ['shimmerBase', 'shimmerHighlight', 'skeleton'],
        },
        {
          label: 'Indicators',
          tokens: ['loader', 'progressIndicator'],
        },
      ],
    },
  
    {
      id: 'snackbar',
      label: 'Snackbar / Toast',
      tab: 'extended',
      icon: 'MessageSquare',
      subcategories: [
        {
          label: 'Snackbar',
          tokens: ['snackbarBackground', 'snackbarText'],
        },
        {
          label: 'Toast',
          tokens: ['toastBackground', 'toastText'],
        },
        {
          label: 'Tooltip',
          tokens: ['tooltipBackground', 'tooltipText'],
        },
      ],
    },
  
    {
      id: 'badges',
      label: 'Badges',
      tab: 'extended',
      icon: 'Bell',
      subcategories: [
        {
          label: 'Badge',
          tokens: ['badgeBackground', 'badgeText', 'notificationDot'],
        },
        {
          label: 'Notification',
          tokens: ['notificationBackground', 'notificationText'],
        },
      ],
    },
  
    {
      id: 'shadows',
      label: 'Shadows',
      tab: 'extended',
      icon: 'Cloud',
      subcategories: [
        {
          label: 'Elevation',
          tokens: ['shadowPrimary', 'shadowSecondary', 'elevationShadow'],
        },
      ],
    },
  
    {
      id: 'gradients',
      label: 'Gradients',
      tab: 'extended',
      icon: 'Sunset',
      subcategories: [
        {
          label: 'Primary',
          tokens: ['primaryGradientStart', 'primaryGradientMiddle', 'primaryGradientEnd'],
        },
        {
          label: 'Secondary',
          tokens: ['secondaryGradientStart', 'secondaryGradientEnd'],
        },
        {
          label: 'Hero',
          tokens: ['heroGradientStart', 'heroGradientEnd'],
        },
      ],
    },
  
    {
      id: 'charts',
      label: 'Charts',
      tab: 'extended',
      icon: 'BarChart2',
      subcategories: [
        {
          label: 'Series',
          tokens: ['chartPrimary', 'chartSecondary', 'chartTertiary', 'chartQuaternary'],
        },
        {
          label: 'Semantic',
          tokens: ['chartPositive', 'chartNegative', 'chartNeutral'],
        },
        {
          label: 'Structure',
          tokens: ['chartGrid', 'chartAxis', 'chartTooltip'],
        },
      ],
    },
  
    {
      id: 'fitness',
      label: 'Fitness',
      tab: 'extended',
      icon: 'Activity',
      subcategories: [
        {
          label: 'Nutrition',
          tokens: ['proteinColor', 'carbsColor', 'fatColor', 'fiberColor'],
        },
        {
          label: 'Health Metrics',
          tokens: ['stepsColor', 'sleepColor', 'waterColor', 'weightColor'],
        },
        {
          label: 'Workout',
          tokens: ['workoutActive', 'workoutCompleted', 'workoutMissed'],
        },
      ],
    },
  
    {
      id: 'premium',
      label: 'Premium',
      tab: 'extended',
      icon: 'Crown',
      subcategories: [
        {
          label: 'Tiers',
          tokens: ['premiumGold', 'premiumSilver', 'premiumPlatinum'],
        },
        {
          label: 'VIP',
          tokens: ['vipBackground', 'vipBorder', 'vipText'],
        },
      ],
    },
  
    {
      id: 'calendar',
      label: 'Calendar',
      tab: 'extended',
      icon: 'Calendar',
      subcategories: [
        {
          label: 'Calendar',
          tokens: ['calendarToday', 'calendarSelected', 'calendarEvent', 'calendarDisabled'],
        },
        {
          label: 'Timeline',
          tokens: ['timelinePast', 'timelineCurrent', 'timelineFuture'],
        },
      ],
    },
  
    {
      id: 'search',
      label: 'Search',
      tab: 'extended',
      icon: 'Search',
      subcategories: [
        {
          label: 'Search Bar',
          tokens: ['searchBackground', 'searchBorder', 'searchFocusedBorder', 'searchIcon', 'searchPlaceholder'],
        },
      ],
    },
  
    {
      id: 'chips',
      label: 'Chips / Tags',
      tab: 'extended',
      icon: 'Tag',
      subcategories: [
        {
          label: 'Chips',
          tokens: ['chipBackground', 'chipSelectedBackground', 'chipText', 'chipSelectedText', 'chipBorder', 'chipDisabledBackground', 'chipDisabledText', 'chipDeleteIcon'],
        },
        {
          label: 'Tags',
          tokens: ['tagBackground', 'tagText'],
        },
      ],
    },
  
    {
      id: 'avatar',
      label: 'Avatar',
      tab: 'extended',
      icon: 'UserCircle',
      subcategories: [
        {
          label: 'Avatar',
          tokens: ['avatarBackground', 'avatarText', 'avatarBorder'],
        },
        {
          label: 'Presence',
          tokens: ['onlineStatus', 'awayStatus', 'busyStatus', 'offlineStatus'],
        },
      ],
    },
  
    {
      id: 'fab',
      label: 'FAB',
      tab: 'extended',
      icon: 'PlusCircle',
      subcategories: [
        {
          label: 'Floating Action Button',
          tokens: ['fabBackground', 'fabForeground', 'fabShadow'],
        },
      ],
    },
  
    {
      id: 'sliders',
      label: 'Sliders / Switches',
      tab: 'extended',
      icon: 'SlidersHorizontal',
      subcategories: [
        {
          label: 'Slider',
          tokens: ['sliderActive', 'sliderInactive', 'sliderThumb'],
        },
        {
          label: 'Switch',
          tokens: ['switchActive', 'switchInactive', 'switchThumb'],
        },
      ],
    },
  
    {
      id: 'progress',
      label: 'Progress',
      tab: 'extended',
      icon: 'Gauge',
      subcategories: [
        {
          label: 'Progress Bar',
          tokens: ['progressBackground', 'progressValue', 'progressSuccess', 'progressWarning', 'progressError'],
        },
      ],
    },
  
    {
      id: 'tables',
      label: 'Tables',
      tab: 'extended',
      icon: 'Table',
      subcategories: [
        {
          label: 'Table',
          tokens: ['tableHeaderBackground', 'tableHeaderText', 'tableRowBackground', 'tableAlternateRowBackground', 'tableBorder', 'tableSelectedRow'],
        },
      ],
    },
  
    {
      id: 'webview',
      label: 'Webview',
      tab: 'extended',
      icon: 'Globe',
      subcategories: [
        {
          label: 'Webview / HTML',
          tokens: ['webViewBackground', 'htmlText', 'htmlLink', 'htmlCodeBlock'],
        },
      ],
    },
  
    {
      id: 'media',
      label: 'Media',
      tab: 'extended',
      icon: 'Video',
      subcategories: [
        {
          label: 'Video',
          tokens: ['videoOverlay', 'videoControls', 'videoProgress'],
        },
      ],
    },
  
    {
      id: 'auth',
      label: 'Authentication',
      tab: 'extended',
      icon: 'Lock',
      subcategories: [
        {
          label: 'Screens',
          tokens: ['loginBackground', 'signupBackground', 'otpBackground', 'authCardBackground'],
        },
      ],
    },
  
    {
      id: 'ecommerce',
      label: 'Ecommerce',
      tab: 'extended',
      icon: 'ShoppingCart',
      subcategories: [
        {
          label: 'Commerce',
          tokens: ['priceColor', 'discountColor', 'outOfStockColor', 'cartBadgeColor', 'wishlistColor'],
        },
      ],
    },
  
    {
      id: 'chat',
      label: 'AI / Chat',
      tab: 'extended',
      icon: 'Bot',
      subcategories: [
        {
          label: 'Chat Bubbles',
          tokens: ['chatUserBubble', 'chatBotBubble', 'chatUserText', 'chatBotText'],
        },
        {
          label: 'AI Elements',
          tokens: ['typingIndicator', 'aiHighlight', 'promptCard'],
        },
      ],
    },
  
    {
      id: 'roles',
      label: 'Role Based',
      tab: 'extended',
      icon: 'Users',
      subcategories: [
        {
          label: 'Roles',
          tokens: ['trainerHighlight', 'coachAccent', 'adminAccent', 'memberAccent'],
        },
      ],
    },
  
    {
      id: 'achievements',
      label: 'Achievements',
      tab: 'extended',
      icon: 'Trophy',
      subcategories: [
        {
          label: 'Tiers',
          tokens: ['achievementGold', 'achievementSilver', 'achievementBronze'],
        },
        {
          label: 'Gamification',
          tokens: ['streakColor', 'xpColor', 'levelUpColor'],
        },
      ],
    },
  
    {
      id: 'accessibility',
      label: 'Accessibility',
      tab: 'extended',
      icon: 'Accessibility',
      subcategories: [
        {
          label: 'High Contrast',
          tokens: ['highContrastBackground', 'highContrastText'],
        },
        {
          label: 'Focus',
          tokens: ['focusRing', 'accessibilityHighlight'],
        },
      ],
    },
  
    {
      id: 'skeleton',
      label: 'Skeleton',
      tab: 'extended',
      icon: 'Minus',
      subcategories: [
        {
          label: 'Variants',
          tokens: ['skeletonDark', 'skeletonLight', 'skeletonAnimated'],
        },
      ],
    },
  
    {
      id: 'gestures',
      label: 'Gestures',
      tab: 'extended',
      icon: 'Hand',
      subcategories: [
        {
          label: 'Drag / Swipe',
          tokens: ['dragHandle', 'dragPreview', 'swipeActionBackground'],
        },
      ],
    },
  
    {
      id: 'maps',
      label: 'Maps',
      tab: 'extended',
      icon: 'Map',
      subcategories: [
        {
          label: 'Map Elements',
          tokens: ['mapMarker', 'mapRoute', 'mapCurrentLocation', 'mapCluster'],
        },
      ],
    },
  
    {
      id: 'experiments',
      label: 'Experiments',
      tab: 'extended',
      icon: 'Flask',
      subcategories: [
        {
          label: 'Feature Flags',
          tokens: ['experimentVariantA', 'experimentVariantB', 'experimentHighlight'],
        },
      ],
    },
  
    {
      id: 'misc',
      label: 'Misc',
      tab: 'extended',
      icon: 'MoreHorizontal',
      subcategories: [
        {
          label: 'Common UI',
          tokens: ['ratingStar', 'favoriteHeart', 'bookmark'],
        },
        {
          label: 'Indicators',
          tokens: ['onlineIndicator', 'offlineIndicator', 'successCheckmark', 'warningIndicator', 'errorIndicator'],
        },
      ],
    },
  ]
  
  // ── Derived helpers ─────────────────────────────────────
  
  // Get all token keys in a flat array — used for validation
  export const ALL_TOKEN_KEYS = TOKEN_CATEGORIES.flatMap(cat =>
    cat.subcategories.flatMap(sub => sub.tokens)
  )
  
  // Find which category and subcategory a token belongs to
  export function findTokenCategory(tokenKey: string) {
    for (const category of TOKEN_CATEGORIES) {
      for (const sub of category.subcategories) {
        if (sub.tokens.includes(tokenKey)) {
          return { category, subcategory: sub }
        }
      }
    }
    return null
  }
  
  // Get categories for a specific tab
  export function getCategoriesByTab(tab: Tab) {
    return TOKEN_CATEGORIES.filter(cat => cat.tab === tab)
  }
  
  // Get total token count for a category
  export function getCategoryTokenCount(categoryId: string) {
    const cat = TOKEN_CATEGORIES.find(c => c.id === categoryId)
    if (!cat) return 0
    return cat.subcategories.reduce((sum, sub) => sum + sub.tokens.length, 0)
  }