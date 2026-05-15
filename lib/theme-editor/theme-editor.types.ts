export interface TokenEntry {
  key: string;
  currentValue: string;
  defaultValue: string;
  isModified: boolean;
  categoryId: string;
  subcategoryLabel: string;
}

export interface FontState {
  families: Record<string, string>;
  sizes: Record<string, number>;
}

export interface ThemeEditorState {
  themeId: string;
  themeName: string;
  customerId: string;
  isActive: boolean;
  version: number;
  colourOverrides: Record<string, string>;
  fontFamilyOverrides: Record<string, string>;
  fontSizeOverrides: Record<string, number>;
  selectedCategoryId: string;
  selectedTab: 'core' | 'extended';
  selectedTokenKey: string | null;
  isDirty: boolean;
  isSaving: boolean;
  /** After Reset all — save sends empty override maps to clear server state. */
  clearAllOverrides: boolean;
}

export interface ColourPickerValue {
  hex: string;
  r: number;
  g: number;
  b: number;
  a: number;
}
