import { apiClient } from './client';
import type {
  LoginRequest,
  LoginResult,
  RefreshRequest,
  RefreshResult,
  SignupRequest,
  SignupData,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiSuccess,
} from '@/types/api';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResult> => {
    const res = await apiClient.post<ApiSuccess<LoginResult>>(
      '/v1/auth/login',
      data
    );
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/v1/auth/logout');
  },

  refresh: async (data: RefreshRequest): Promise<RefreshResult> => {
    const res = await apiClient.post<ApiSuccess<RefreshResult>>(
      '/v1/auth/refresh',
      data
    );
    return res.data.data;
  },

  signup: async (data: SignupRequest): Promise<SignupData> => {
    const res = await apiClient.post<ApiSuccess<SignupData>>(
      '/v1/auth/signup',
      data
    );
    return res.data.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post('/v1/auth/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post('/v1/auth/reset-password', data);
  },
};
