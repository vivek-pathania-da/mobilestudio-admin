import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  tokenStore,
  userStore,
  getRefreshToken,
  setRefreshTokenCookie,
  clearAllTokens,
} from '@/lib/auth';
import type { ApiSuccess, RefreshResult } from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set');
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request interceptor ──────────────────────────────────
// Attach access token to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────
// Handle 401s with automatic token refresh + retry
// Implements the flow from openapi.yml x-internal-notes:
//   1. Make API call with access token
//   2. If 401, call /v1/auth/refresh with refreshToken + userId
//   3. Store new tokens
//   4. Retry original request
//   5. If refresh fails → redirect to login

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  refreshQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only handle 401 on non-refresh and non-login endpoints
    // and only retry once
    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        // Queue concurrent requests while refresh is in progress
        return new Promise<string>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      const userId = userStore.getUserId();

      if (!refreshToken || !userId) {
        // No refresh token — redirect to login
        clearAllTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint directly (not through apiClient
        // to avoid infinite interceptor loop)
        const response = await axios.post<ApiSuccess<RefreshResult>>(
          `${BASE_URL}/v1/auth/refresh`,
          { refreshToken, userId },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const {
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn,
        } = response.data.data;

        // Store new tokens
        tokenStore.setAccessToken(accessToken, expiresIn);
        setRefreshTokenCookie(newRefreshToken);

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed — session expired, redirect to login
        processQueue(refreshError, null);
        clearAllTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper to extract error message from API response
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? error.message ?? 'Something went wrong';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}
