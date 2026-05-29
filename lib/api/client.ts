import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { expireSession } from '@/lib/auth/session-expire';
import { refreshAccessToken } from '@/lib/auth/refresh-access-token';
import { formatAuthorizationHeader, tokenStore } from '@/lib/auth';
import { isLikelyAuthFailure } from '@/lib/api/auth-errors';

/** Inlined at build time; may be empty during local/CI build without .env — do not throw at import (breaks SSG/prerender). */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? '';
}

const BASE_URL = getBaseUrl();

if (process.env.NODE_ENV === 'development' && !BASE_URL) {
  console.warn(
    '[api] NEXT_PUBLIC_API_URL is not set — API calls will fail until it is configured.'
  );
}

export const apiClient = axios.create({
  baseURL: BASE_URL || undefined,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.getAccessToken();
    if (token) {
      config.headers.Authorization = formatAuthorizationHeader(token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

async function retryWithFreshToken(
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }
): Promise<unknown> {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    }).then((token) => {
      originalRequest.headers.Authorization = formatAuthorizationHeader(token);
      return apiClient(originalRequest);
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const accessToken = await refreshAccessToken();
    processQueue(null, accessToken);
    originalRequest.headers.Authorization = formatAuthorizationHeader(accessToken);
    return apiClient(originalRequest);
  } catch (refreshError) {
    processQueue(refreshError, null);
    const refreshMessage = getApiErrorMessage(refreshError);
    expireSession(
      refreshMessage &&
        !refreshMessage.toLowerCase().includes('network error')
        ? refreshMessage
        : 'Your session has expired. Please sign in again.'
    );
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh');

    if (
      isLikelyAuthFailure(error) &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      return retryWithFreshToken(originalRequest);
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? error.message ?? 'Something went wrong';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}

/** Long-running Bedrock calls; prefer API `message` when present. */
export function getAiGenerateErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;

    if (error.code === 'ECONNABORTED') {
      return 'AI generation timed out. Image requests can take up to two minutes — please try again.';
    }

    const status = error.response?.status;
    if (status === 429) {
      return 'AI service is busy. Please try again in a moment.';
    }
    if (status === 503) {
      return 'AI service is temporarily unavailable. Please try again shortly.';
    }
  }
  return getApiErrorMessage(error);
}
