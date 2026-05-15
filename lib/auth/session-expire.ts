import { clearAllTokens } from '@/lib/auth';

const DEFAULT_MESSAGE =
  'Your session has expired. Please sign in again.';

let isEndingSession = false;

/**
 * Clear auth state and send the user to login with feedback.
 * Used when refresh fails or credentials are missing on a 401.
 */
export function expireSession(message = DEFAULT_MESSAGE): void {
  if (typeof window === 'undefined' || isEndingSession) {
    return;
  }
  isEndingSession = true;

  clearAllTokens();

  void import('@/stores/auth.store').then(({ useAuthStore }) => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: message,
    });
    const persist = useAuthStore.persist;
    if (persist?.clearStorage) {
      persist.clearStorage();
    }
  });

  void import('sonner').then(({ toast }) => {
    toast.error(message, { duration: 5000 });
  });

  window.setTimeout(() => {
    const params = new URLSearchParams({ reason: 'session_expired' });
    window.location.replace(`/login?${params.toString()}`);
  }, 600);
}
