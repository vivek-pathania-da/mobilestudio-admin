import { apiClient } from './client';
import type {
  AiGenerateRequest,
  AiGenerateResponse,
  ApiSuccess,
} from '@/types/api';

export const aiThemeApi = {
  generate: async (data: AiGenerateRequest): Promise<AiGenerateResponse> => {
    const res = await apiClient.post<ApiSuccess<AiGenerateResponse>>(
      '/v1/themes/ai-generate',
      data
    );
    return res.data.data;
  },
};
