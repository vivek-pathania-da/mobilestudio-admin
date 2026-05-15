import type { ThemeResponse } from '@/types/api';

function cacheKey(customerId: string, themeId: string): string {
  return `ms-theme:${customerId}:${themeId}`;
}

export function cacheThemeResponse(theme: ThemeResponse): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(cacheKey(theme.customerId, theme.themeId), JSON.stringify(theme));
  } catch {
    // sessionStorage full or unavailable
  }
}

export function getCachedThemeResponse(
  customerId: string,
  themeId: string
): ThemeResponse | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(cacheKey(customerId, themeId));
    if (!raw) return null;
    return JSON.parse(raw) as ThemeResponse;
  } catch {
    return null;
  }
}

/** True when the API returned no tokens but the theme summary says overrides exist. */
export function themeTokensLookMissing(
  theme: ThemeResponse,
  overrideCount?: number
): boolean {
  const tokenCount = Object.keys(theme.tokens ?? {}).length;
  if (tokenCount > 0) return false;
  return (overrideCount ?? 0) > 0;
}
