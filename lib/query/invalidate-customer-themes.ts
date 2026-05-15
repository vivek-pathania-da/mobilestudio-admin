import type { QueryClient } from '@tanstack/react-query';

/** Refetch theme list / active theme on the customer detail page. */
export function invalidateCustomerThemes(
  queryClient: QueryClient,
  customerId: string
): void {
  void queryClient.invalidateQueries({ queryKey: ['themes', customerId] });
  void queryClient.invalidateQueries({ queryKey: ['theme-active', customerId] });
}
