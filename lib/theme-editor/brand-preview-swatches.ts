import { isTransparent, isValidHex, toCssHexColor } from '@/lib/theme-editor/theme-editor.utils';

/** Token keys used on theme cards — matches Brand category in token-categories. */
const BRAND_PREVIEW_KEYS = [
  'primary',
  'primaryDark',
  'primaryLight',
  'secondary',
  'secondaryDark',
  'secondaryLight',
  'accent',
  'tertiary',
] as const;

/**
 * Resolved theme token map → distinct CSS hex colours for card preview (max `max`).
 */
export function getBrandPreviewSwatches(
  tokens: Record<string, string> | undefined,
  max = 7
): string[] {
  if (!tokens) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const key of BRAND_PREVIEW_KEYS) {
    const raw = tokens[key];
    if (typeof raw !== 'string') continue;
    const trimmed = raw.trim();
    const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    if (!isValidHex(withHash)) continue;
    const css = toCssHexColor(withHash);
    const norm = css.replace(/\s+/g, '').toLowerCase();
    if (seen.has(norm)) continue;
    seen.add(norm);
    out.push(css);
    if (out.length >= max) break;
  }
  return out;
}
