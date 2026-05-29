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

/** Bedrock + token derivation can exceed the default 15s client timeout. */
const AI_GENERATE_TIMEOUT_MS = 120_000;

export const aiThemeApi = {
  generate: async (data: AiGenerateRequest): Promise<AiGenerateResponse> => {
    const res = await apiClient.post<ApiSuccess<AiGenerateResponse>>(
      '/v1/themes/ai-generate',
      data,
      { timeout: AI_GENERATE_TIMEOUT_MS }
    );
    return normalizeAiGenerateResponse(res.data.data);
  },
};
