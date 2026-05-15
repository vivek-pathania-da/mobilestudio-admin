import { formatAuthorizationHeader, tokenStore } from '@/lib/auth';

export const firebaseApi = {
  notifyThemeUpdated: async (customerId: string): Promise<void> => {
    try {
      const accessToken = tokenStore.getAccessToken();

      const response = await fetch('/api/theme-notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken
            ? { Authorization: formatAuthorizationHeader(accessToken) }
            : {}),
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        console.warn(
          '[Firebase] Theme notify API route returned error:',
          data.message
        );
      }
    } catch (error) {
      console.error('[Firebase] Failed to call theme-notify route:', error);
    }
  },
};
