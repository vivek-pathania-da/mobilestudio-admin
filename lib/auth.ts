// In-memory access token store
// Never persisted to localStorage — cleared on page refresh
// This is intentional — page refresh forces re-authentication
// via the refresh token flow

let _accessToken: string | null = null;
let _tokenExpiry: number | null = null; // epoch ms

export const tokenStore = {
  setAccessToken(token: string, expiresInSeconds: number): void {
    _accessToken = token;
    _tokenExpiry = Date.now() + expiresInSeconds * 1000 - 30000;
    // subtract 30s buffer so we refresh before actual expiry
  },

  getAccessToken(): string | null {
    if (!_accessToken || !_tokenExpiry) return null;
    if (Date.now() >= _tokenExpiry) {
      _accessToken = null;
      _tokenExpiry = null;
      return null;
    }
    return _accessToken;
  },

  clearAccessToken(): void {
    _accessToken = null;
    _tokenExpiry = null;
  },

  isExpired(): boolean {
    if (!_tokenExpiry) return true;
    return Date.now() >= _tokenExpiry;
  },
};

// userId in localStorage — not sensitive
export const userStore = {
  setUserId(userId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ms_user_id', userId);
    }
  },

  getUserId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ms_user_id');
    }
    return null;
  },

  clearUserId(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ms_user_id');
    }
  },
};

// Refresh token stored as httpOnly cookie
// Set by the API client after login/refresh
// Name used for the cookie
export const REFRESH_TOKEN_COOKIE = 'ms_refresh_token';

export function setRefreshTokenCookie(token: string): void {
  // Set as a regular cookie — httpOnly cannot be set from JS
  // For a proper httpOnly implementation you need a Next.js
  // API route to set it. For now use js-cookie with secure flag.
  void import('js-cookie').then((Cookies) => {
    Cookies.default.set(REFRESH_TOKEN_COOKIE, token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  });
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  // Dynamic import not available in sync context — use direct cookie read
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${REFRESH_TOKEN_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearRefreshToken(): void {
  void import('js-cookie').then((Cookies) => {
    Cookies.default.remove(REFRESH_TOKEN_COOKIE);
  });
}

export function clearAllTokens(): void {
  tokenStore.clearAccessToken();
  userStore.clearUserId();
  clearRefreshToken();
}
