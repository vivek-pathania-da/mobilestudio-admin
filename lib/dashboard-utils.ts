const SKIP_WORDS = new Set([
  'ltd',
  'limited',
  'inc',
  'incorporated',
  'llc',
  'plc',
  'corp',
  'corporation',
  'co',
  'company',
]);

export function companyInitials(companyName: string): string {
  const words = companyName
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0 && !SKIP_WORDS.has(w.toLowerCase()));

  if (words.length >= 2) {
    return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
  }

  const single = words[0] ?? companyName.trim();
  return single.slice(0, 2).toUpperCase() || '?';
}

/** Human-readable pagination summary (avoids "Showing 1 to 1 of 1 results"). */
export function formatPaginationSummary(
  total: number,
  from: number,
  to: number,
  singular = 'customer',
  plural = 'customers'
): string {
  if (total === 0) return `No ${plural} found`;
  if (total === 1) return `1 ${singular}`;
  if (from === 1 && to === total) return `${total} ${plural}`;
  if (from === to) return `${from} of ${total} ${plural}`;
  return `${from}–${to} of ${total} ${plural}`;
}
