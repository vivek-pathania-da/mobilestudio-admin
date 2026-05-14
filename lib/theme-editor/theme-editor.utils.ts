import { DEFAULT_THEME } from './default-theme';
import { TOKEN_CATEGORIES } from './token-categories';

export function hexToRgb(hex: string): { r: number; g: number; b: number; a: number } {
  const raw = hex.trim().replace(/^#/, '');
  if (raw.length !== 6 && raw.length !== 8) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
  let a = 1;
  if (raw.length === 8) {
    const ai = parseInt(raw.slice(6, 8), 16);
    a = Number.isNaN(ai) ? 1 : ai / 255;
  }
  return { r, g, b, a };
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
  if (h === '#00000000' || h === 'transparent') return true;
  if (/^#[0-9a-f]{8}$/i.test(h) && h.endsWith('00')) return true;
  return false;
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
      out[k] = v;
    }
  }
  return out;
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
