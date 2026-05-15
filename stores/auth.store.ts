import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, LoginResult } from '@/types/api';
import {
  normalizeAccessToken,
  tokenStore,
  userStore,
  setRefreshTokenCookie,
  clearAllTokens,
} from '@/lib/auth';
import { authApi } from '@/lib/api/auth.api';
import { getApiErrorMessage } from '@/lib/api/client';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser) => void;
}

function applyAdminLoginResult(
  set: (partial: Partial<AuthState>) => void,
  result: LoginResult
): void {
  if (result.user.role !== 'admin') {
    set({
      isLoading: false,
      isAuthenticated: false,
      user: null,
      error: 'Access denied. Admin privileges required.',
    });
    return;
  }

  tokenStore.setAccessToken(
    normalizeAccessToken(result.accessToken),
    result.expiresIn
  );
  setRefreshTokenCookie(result.refreshToken);
  userStore.setUserId(result.user.userId);

  set({
    user: result.user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  });
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.login({ email, password });
          applyAdminLoginResult(set, result);
        } catch (error) {
          set({
            isLoading: false,
            isAuthenticated: false,
            error: getApiErrorMessage(error),
          });
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.signup({ email, password, name });
        } catch (error) {
          set({
            isLoading: false,
            error: getApiErrorMessage(error),
          });
          return;
        }
        await get().login(email, password);
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Ignore logout API errors — clear local state regardless
        } finally {
          clearAllTokens();
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user: AuthUser) => set({ user }),
    }),
    {
      name: 'ms-admin-auth',
      // Only persist user object — never tokens
      partialize: (state) => ({ user: state.user }),
      // On rehydrate check if we still have tokens
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          // Check if access token exists in memory
          // If not, the interceptor will try refresh on next API call
          const hasToken = !!tokenStore.getAccessToken();
          const hasUserId = !!userStore.getUserId();
          state.isAuthenticated = hasToken || hasUserId;
        }
      },
    }
  )
);
