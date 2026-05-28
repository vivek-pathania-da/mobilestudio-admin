import { DEFAULT_THEME, DEFAULT_RADIUS_TOKENS } from '@/lib/theme-editor/default-theme';
import type { TokenMap } from './types';

export function token(
  tokens: TokenMap,
  key: string,
  fallback = '#E5E7EB'
): string {
  return tokens[key] ?? fallback;
}

/** Merges editor overrides with defaults for phone preview slides. */
export function resolvePreviewTokens(
  colourOverrides: Record<string, string>
): TokenMap {
  const tokens: TokenMap = {};
  for (const key of Object.keys(DEFAULT_THEME)) {
    tokens[key] = colourOverrides[key] ?? DEFAULT_THEME[key];
  }
  return tokens;
}

/** Merges radius overrides with defaults for phone preview slides. */
export function resolvePreviewRadius(
  radiusOverrides: Record<string, number>
): Record<string, number> {
  const tokens: Record<string, number> = {};
  for (const key of Object.keys(DEFAULT_RADIUS_TOKENS)) {
    tokens[key] = radiusOverrides[key] ?? DEFAULT_RADIUS_TOKENS[key];
  }
  return tokens;
}
