import type { TokenMap } from './types';

export function token(
  tokens: TokenMap,
  key: string,
  fallback = '#E5E7EB'
): string {
  return tokens[key] ?? fallback;
}
