import { DEFAULT_THEME } from '@/lib/theme-editor/default-theme';
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
