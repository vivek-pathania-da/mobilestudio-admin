'use client';

import { create } from 'zustand';
import { firebaseApi } from '@/lib/api/firebase.api';
import { themesApi } from '@/lib/api/themes.api';
import {
  DEFAULT_THEME,
  DEFAULT_FONT_FAMILIES,
  DEFAULT_FONT_SIZES,
} from '@/lib/theme-editor/default-theme';
import {
  buildOverridesPayload,
} from '@/lib/theme-editor/theme-editor.utils';
import type { ThemeEditorState } from '@/lib/theme-editor/theme-editor.types';
import type { UpdateThemeRequest } from '@/types/api';
import { TOKEN_CATEGORIES } from '@/lib/theme-editor/token-categories';
import { getFirstTokenKeyForCategory } from '@/lib/theme-editor/theme-editor.utils';

type Snapshot = {
  themeName: string;
  colourOverrides: Record<string, string>;
  fontFamilyOverrides: Record<string, string>;
  fontSizeOverrides: Record<string, number>;
};

function cloneSnapshot(s: Snapshot): Snapshot {
  return {
    themeName: s.themeName,
    colourOverrides: { ...s.colourOverrides },
    fontFamilyOverrides: { ...s.fontFamilyOverrides },
    fontSizeOverrides: { ...s.fontSizeOverrides },
  };
}

function buildFontFamilyPayload(
  overrides: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(overrides)) {
    if (DEFAULT_FONT_FAMILIES[k] !== undefined && v !== DEFAULT_FONT_FAMILIES[k]) {
      out[k] = v;
    }
  }
  return out;
}

function buildFontSizePayload(
  overrides: Record<string, number>
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(overrides)) {
    if (DEFAULT_FONT_SIZES[k] !== undefined && v !== DEFAULT_FONT_SIZES[k]) {
      out[k] = v;
    }
  }
  return out;
}

interface ThemeEditorStore extends ThemeEditorState {
  savedSnapshot: Snapshot | null;

  initialise: (
    customerId: string,
    themeId: string,
    themeName: string,
    isActive: boolean,
    version: number,
    tokens: Record<string, string>,
    fontFamilies: Record<string, string>,
    fontSizes: Record<string, number>
  ) => void;

  setThemeName: (name: string) => void;

  setTokenValue: (tokenKey: string, value: string) => void;
  resetToken: (tokenKey: string) => void;
  resetCategory: (categoryId: string) => void;
  resetAll: () => void;

  setFontFamily: (key: string, value: string) => void;
  setFontSize: (key: string, value: number) => void;

  selectCategory: (categoryId: string) => void;
  selectTab: (tab: 'core' | 'extended') => void;
  selectToken: (tokenKey: string | null) => void;

  save: () => Promise<void>;
  activate: () => Promise<void>;
  discard: () => void;

  getTokenValue: (tokenKey: string) => string;
  getOverrideCount: () => number;
  isTokenModified: (tokenKey: string) => boolean;
}

const INITIAL_CATEGORY = 'brand';

export const useThemeEditorStore = create<ThemeEditorStore>((set, get) => ({
  themeId: '',
  themeName: '',
  customerId: '',
  isActive: false,
  version: 1,
  colourOverrides: {},
  fontFamilyOverrides: {},
  fontSizeOverrides: {},
  selectedCategoryId: INITIAL_CATEGORY,
  selectedTab: 'core',
  selectedTokenKey: getFirstTokenKeyForCategory(INITIAL_CATEGORY),
  isDirty: false,
  isSaving: false,
  savedSnapshot: null,

  initialise: (
    customerId,
    themeId,
    themeName,
    isActive,
    version,
    tokens,
    fontFamilies,
    fontSizes
  ) => {
    const colourOverrides: Record<string, string> = {};
    for (const [key, value] of Object.entries(tokens)) {
      if (DEFAULT_THEME[key] !== undefined && value !== DEFAULT_THEME[key]) {
        colourOverrides[key] = value;
      }
    }

    const fontFamilyOverrides: Record<string, string> = {};
    for (const [key, value] of Object.entries(fontFamilies)) {
      if (
        DEFAULT_FONT_FAMILIES[key] !== undefined &&
        value !== DEFAULT_FONT_FAMILIES[key]
      ) {
        fontFamilyOverrides[key] = value;
      }
    }

    const fontSizeOverrides: Record<string, number> = {};
    for (const [key, value] of Object.entries(fontSizes)) {
      if (
        DEFAULT_FONT_SIZES[key] !== undefined &&
        value !== DEFAULT_FONT_SIZES[key]
      ) {
        fontSizeOverrides[key] = value;
      }
    }

    const snap: Snapshot = {
      themeName,
      colourOverrides: { ...colourOverrides },
      fontFamilyOverrides: { ...fontFamilyOverrides },
      fontSizeOverrides: { ...fontSizeOverrides },
    };

    set({
      customerId,
      themeId,
      themeName,
      isActive,
      version,
      colourOverrides,
      fontFamilyOverrides,
      fontSizeOverrides,
      selectedCategoryId: INITIAL_CATEGORY,
      selectedTab: 'core',
      selectedTokenKey: getFirstTokenKeyForCategory(INITIAL_CATEGORY),
      isDirty: false,
      isSaving: false,
      savedSnapshot: cloneSnapshot(snap),
    });
  },

  setThemeName: (name: string) => set({ themeName: name, isDirty: true }),

  setTokenValue: (tokenKey, value) => {
    set((state) => {
      const newOverrides = { ...state.colourOverrides };
      if (value === DEFAULT_THEME[tokenKey]) {
        delete newOverrides[tokenKey];
      } else {
        newOverrides[tokenKey] = value;
      }
      return { colourOverrides: newOverrides, isDirty: true };
    });
  },

  resetToken: (tokenKey) => {
    set((state) => {
      const newOverrides = { ...state.colourOverrides };
      delete newOverrides[tokenKey];
      return { colourOverrides: newOverrides, isDirty: true };
    });
  },

  resetCategory: (categoryId) => {
    if (categoryId === 'typography') {
      set({
        fontFamilyOverrides: {},
        fontSizeOverrides: {},
        isDirty: true,
      });
      return;
    }
    const category = TOKEN_CATEGORIES.find((c) => c.id === categoryId);
    if (!category) return;
    const categoryTokens = category.subcategories.flatMap((s) => s.tokens);
    set((state) => {
      const newOverrides = { ...state.colourOverrides };
      categoryTokens.forEach((key) => {
        delete newOverrides[key];
      });
      return { colourOverrides: newOverrides, isDirty: true };
    });
  },

  resetAll: () => {
    set({
      colourOverrides: {},
      fontFamilyOverrides: {},
      fontSizeOverrides: {},
      isDirty: true,
    });
  },

  setFontFamily: (key, value) => {
    set((state) => {
      const overrides = { ...state.fontFamilyOverrides };
      if (value === DEFAULT_FONT_FAMILIES[key]) {
        delete overrides[key];
      } else {
        overrides[key] = value;
      }
      return { fontFamilyOverrides: overrides, isDirty: true };
    });
  },

  setFontSize: (key, value) => {
    set((state) => {
      const overrides = { ...state.fontSizeOverrides };
      if (value === DEFAULT_FONT_SIZES[key]) {
        delete overrides[key];
      } else {
        overrides[key] = value;
      }
      return { fontSizeOverrides: overrides, isDirty: true };
    });
  },

  selectCategory: (categoryId) =>
    set({
      selectedCategoryId: categoryId,
      selectedTokenKey: getFirstTokenKeyForCategory(categoryId),
    }),

  selectTab: (tab) => {
    const firstCat = TOKEN_CATEGORIES.find((c) => c.tab === tab);
    const categoryId = firstCat?.id ?? INITIAL_CATEGORY;
    set({
      selectedTab: tab,
      selectedCategoryId: categoryId,
      selectedTokenKey: getFirstTokenKeyForCategory(categoryId),
    });
  },

  selectToken: (tokenKey) => set({ selectedTokenKey: tokenKey }),

  save: async () => {
    const {
      customerId,
      themeId,
      themeName,
      colourOverrides,
      fontFamilyOverrides,
      fontSizeOverrides,
    } = get();
    set({ isSaving: true });
    try {
      const tokens = buildOverridesPayload(colourOverrides);
      const fontFamilies = buildFontFamilyPayload(fontFamilyOverrides);
      const fontSizes = buildFontSizePayload(fontSizeOverrides);
      const body: UpdateThemeRequest = { themeName };
      if (Object.keys(tokens).length > 0) body.tokens = tokens;
      if (Object.keys(fontFamilies).length > 0) body.fontFamilies = fontFamilies;
      if (Object.keys(fontSizes).length > 0) body.fontSizes = fontSizes;
      const updated = await themesApi.update(customerId, themeId, body);
      const snap: Snapshot = {
        themeName: updated.themeName,
        colourOverrides: {},
        fontFamilyOverrides: {},
        fontSizeOverrides: {},
      };
      for (const [key, value] of Object.entries(updated.tokens)) {
        if (DEFAULT_THEME[key] !== undefined && value !== DEFAULT_THEME[key]) {
          snap.colourOverrides[key] = value;
        }
      }
      for (const [key, value] of Object.entries(updated.font_tokens.families)) {
        if (
          DEFAULT_FONT_FAMILIES[key] !== undefined &&
          value !== DEFAULT_FONT_FAMILIES[key]
        ) {
          snap.fontFamilyOverrides[key] = value;
        }
      }
      for (const [key, value] of Object.entries(updated.font_tokens.sizes)) {
        if (
          DEFAULT_FONT_SIZES[key] !== undefined &&
          value !== DEFAULT_FONT_SIZES[key]
        ) {
          snap.fontSizeOverrides[key] = value;
        }
      }
      // Only the customer's active theme should ping mobile — trust API, not local state
      if (updated.isActive) {
        void firebaseApi.notifyThemeUpdated(customerId).catch(() => {});
      }
      set({
        themeName: updated.themeName,
        version: updated.version,
        isActive: updated.isActive,
        colourOverrides: { ...snap.colourOverrides },
        fontFamilyOverrides: { ...snap.fontFamilyOverrides },
        fontSizeOverrides: { ...snap.fontSizeOverrides },
        isDirty: false,
        isSaving: false,
        savedSnapshot: cloneSnapshot(snap),
      });
    } catch (err) {
      set({ isSaving: false });
      throw err;
    }
  },

  activate: async () => {
    const { customerId, themeId } = get();
    const activated = await themesApi.activate(customerId, themeId);
    set({ isActive: true });
    void firebaseApi.notifyThemeUpdated(activated.customerId).catch(() => {});
  },

  discard: () => {
    const state = get();
    const snap = state.savedSnapshot;
    if (!snap) return;
    set({
      themeName: snap.themeName,
      colourOverrides: { ...snap.colourOverrides },
      fontFamilyOverrides: { ...snap.fontFamilyOverrides },
      fontSizeOverrides: { ...snap.fontSizeOverrides },
      isDirty: false,
      selectedTokenKey: getFirstTokenKeyForCategory(state.selectedCategoryId),
    });
  },

  getTokenValue: (tokenKey) => {
    const { colourOverrides } = get();
    return colourOverrides[tokenKey] ?? DEFAULT_THEME[tokenKey] ?? '#000000';
  },

  getOverrideCount: () => {
    const { colourOverrides, fontFamilyOverrides, fontSizeOverrides } = get();
    return (
      Object.keys(colourOverrides).length +
      Object.keys(fontFamilyOverrides).length +
      Object.keys(fontSizeOverrides).length
    );
  },

  isTokenModified: (tokenKey) => {
    const { colourOverrides } = get();
    return tokenKey in colourOverrides;
  },
}));
