import { DEFAULT_THEME } from './default-theme';
import { TOKEN_CATEGORIES } from './token-categories';

/** Parse hex components. Editor uses RGBA (#RRGGBBAA); API uses ARGB (#AARRGGBB). */
function parseHexComponents(
  hex: string,
  alphaPosition: 'rgba' | 'argb'
): { r: number; g: number; b: number; a: number } {
  const raw = hex.trim().replace(/^#/, '');
  if (raw.length !== 6 && raw.length !== 8) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
  let r: number;
  let g: number;
  let b: number;
  let a = 1;
  if (raw.length === 8 && alphaPosition === 'argb') {
    const ai = parseInt(raw.slice(0, 2), 16);
    r = parseInt(raw.slice(2, 4), 16);
    g = parseInt(raw.slice(4, 6), 16);
    b = parseInt(raw.slice(6, 8), 16);
    a = Number.isNaN(ai) ? 1 : ai / 255;
  } else {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);
    if (raw.length === 8) {
      const ai = parseInt(raw.slice(6, 8), 16);
      a = Number.isNaN(ai) ? 1 : ai / 255;
    }
  }
  if ([r, g, b].some((n) => Number.isNaN(n))) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
  return { r, g, b, a };
}

/** Editor / CSS / picker — alpha last (#RRGGBBAA). */
export function hexToRgb(hex: string): { r: number; g: number; b: number; a: number } {
  return parseHexComponents(hex, 'rgba');
}

export function rgbToHex(r: number, g: number, b: number, a?: number): string {
  const clamp = (n: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, Math.round(n)));
  const R = clamp(r, 0, 255);
  const G = clamp(g, 0, 255);
  const B = clamp(b, 0, 255);
  const to2 = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  const base = `#${to2(R)}${to2(G)}${to2(B)}`;
  if (a === undefined || a >= 1) return base;
  const A = clamp(Math.round(a * 255), 0, 255);
  return `${base}${to2(A)}`;
}

export function isValidHex(value: string): boolean {
  return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value.trim());
}

export function isTransparent(hex: string): boolean {
  const h = hex.trim().toLowerCase();
  if (h === 'transparent') return true;
  if (/^#[0-9a-f]{8}$/i.test(h)) {
    return hexToRgb(h).a === 0;
  }
  return false;
}

/** API wire format (#RRGGBB or #AARRGGBB) → editor (#RRGGBB / #RRGGBBAA). */
export function fromApiHexColor(hex: string): string {
  const trimmed = hex.trim();
  if (trimmed.toLowerCase() === 'transparent') {
    return '#00000000';
  }
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  if (!isValidHex(withHash)) return '#000000';
  const raw = withHash.slice(1).toUpperCase();
  if (raw.length === 6) return `#${raw}`;
  const { r, g, b, a } = parseHexComponents(withHash, 'argb');
  return rgbToHex(r, g, b, a);
}

/** Editor format → API (#RRGGBB or #AARRGGBB with alpha first). */
export function toApiHexColor(hex: string): string {
  const normalized = normalizeHexColor(hex);
  const raw = normalized.slice(1).toUpperCase();
  if (raw.length === 6) return `#${raw}`;
  const rgb = raw.slice(0, 6);
  const a = raw.slice(6, 8);
  return `#${a}${rgb}`;
}

/** Hex string for HexAlphaColorPicker (editor RGBA, 8-digit when needed). */
export function toPickerHex(value: string): string {
  const trimmed = value.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  if (!isValidHex(withHash)) return '#000000FF';
  const raw = withHash.slice(1).toUpperCase();
  const rgb = raw.slice(0, 6);
  const alpha = raw.length === 8 ? raw.slice(6, 8) : 'FF';
  return `#${rgb}${alpha}`;
}

/** Normalize picker / user input for storage (#RRGGBB or #RRGGBBAA). */
export function normalizeHexColor(value: string): string {
  const trimmed = value.trim();
  if (trimmed.toLowerCase() === 'transparent') {
    return '#00000000';
  }
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  if (!isValidHex(withHash)) return '#000000';
  const raw = withHash.slice(1).toUpperCase();
  if (raw.length === 8) {
    const a = parseInt(raw.slice(6, 8), 16);
    if (Number.isNaN(a) || a === 0) return `#${raw.slice(0, 6)}00`;
    if (a === 255) return `#${raw.slice(0, 6)}`;
    return `#${raw}`;
  }
  return `#${raw}`;
}

/** Set alpha to 0 while keeping RGB (or fallback RGB when legacy #00000000). */
export function toFullyTransparentHex(
  current: string,
  fallbackRgb: string
): string {
  let { r, g, b } = hexToRgb(current);
  if (r === 0 && g === 0 && b === 0) {
    const fb = hexToRgb(fallbackRgb);
    r = fb.r;
    g = fb.g;
    b = fb.b;
  }
  return rgbToHex(r, g, b, 0);
}

export function getDefaultValue(tokenKey: string): string {
  return DEFAULT_THEME[tokenKey] ?? '#000000';
}

export function isModified(tokenKey: string, currentValue: string): boolean {
  return currentValue !== getDefaultValue(tokenKey);
}

export function countOverrides(overrides: Record<string, string>): number {
  return Object.keys(overrides).filter((k) => overrides[k] !== DEFAULT_THEME[k]).length;
}

export function resolveTokenValue(
  tokenKey: string,
  overrides: Record<string, string>
): string {
  return overrides[tokenKey] ?? DEFAULT_THEME[tokenKey] ?? '#000000';
}

export function buildOverridesPayload(
  overrides: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(overrides)) {
    if (v !== DEFAULT_THEME[k]) {
      out[k] = toApiHexColor(v);
    }
  }
  return out;
}

/** CSS `background-color` from API or editor hex. */
export function toCssHexColor(hex: string): string {
  return fromApiHexColor(hex);
}

export function findTokenCategory(tokenKey: string): {
  categoryId: string;
  subcategoryLabel: string;
} | null {
  for (const cat of TOKEN_CATEGORIES) {
    for (const sub of cat.subcategories) {
      if (sub.tokens.includes(tokenKey)) {
        return { categoryId: cat.id, subcategoryLabel: sub.label };
      }
    }
  }
  return null;
}

export function getCategoryTokenCount(categoryId: string): number {
  if (categoryId === 'typography') {
    return 18;
  }
  const cat = TOKEN_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return 0;
  return cat.subcategories.reduce(
    (sum, s) => sum + s.tokens.length,
    0
  );
}

/** First colour token in a category (for default editor selection). */
export function getFirstTokenKeyForCategory(categoryId: string): string | null {
  if (categoryId === 'typography') return null;
  const cat = TOKEN_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return null;
  return cat.subcategories[0]?.tokens[0] ?? null;
}
