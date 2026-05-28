import { apiClient } from './client';
import type {
  AiGenerateRequest,
  AiGenerateResponse,
  ApiSuccess,
} from '@/types/api';

function normalizeAiGenerateResponse(data: AiGenerateResponse): AiGenerateResponse {
  if (data.radius_tokens) return data;
  if (data.radiusPalette && data.radiusTokens) {
    return {
      ...data,
      radius_tokens: {
        palette: data.radiusPalette,
        tokens: data.radiusTokens,
      },
    };
  }
  return data;
}

export const aiThemeApi = {
  generate: async (data: AiGenerateRequest): Promise<AiGenerateResponse> => {
    const res = await apiClient.post<ApiSuccess<AiGenerateResponse>>(
      '/v1/themes/ai-generate',
      data
    );
    return normalizeAiGenerateResponse(res.data.data);
  },
};
