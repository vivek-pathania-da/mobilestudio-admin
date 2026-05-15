import axios from 'axios';
import {
  formatAuthorizationHeader,
  getRefreshToken,
  normalizeAccessToken,
  setRefreshTokenCookie,
  tokenStore,
  userStore,
} from '@/lib/auth';
import type { ApiSuccess, RefreshResult } from '@/types/api';

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? '';
}

/** Refresh access token using the stored refresh token + userId. */
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  const userId = userStore.getUserId();

  if (!refreshToken || !userId) {
    throw new Error('No refresh credentials');
  }

  const response = await axios.post<ApiSuccess<RefreshResult>>(
    `${getBaseUrl()}/v1/auth/refresh`,
    { refreshToken, userId },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const {
    accessToken,
    refreshToken: newRefreshToken,
    expiresIn,
  } = response.data.data;

  const normalizedAccess = normalizeAccessToken(accessToken);
  tokenStore.setAccessToken(normalizedAccess, expiresIn);
  setRefreshTokenCookie(newRefreshToken);
  return normalizedAccess;
}

/** Obtain a valid access token, refreshing first when memory is empty/expired. */
export async function ensureAccessToken(): Promise<string> {
  const current = tokenStore.getAccessToken();
  if (current) {
    return current;
  }
  return refreshAccessToken();
}

export function getAuthorizationHeaderValue(): string | null {
  const token = tokenStore.getAccessToken();
  if (!token) return null;
  return formatAuthorizationHeader(token);
}
