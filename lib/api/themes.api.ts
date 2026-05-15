import axios from 'axios';
import { ensureAccessToken } from '@/lib/auth/refresh-access-token';
import {
  isAwsApiGatewayAuthHeaderError,
  isLikelyAuthFailure,
} from '@/lib/api/auth-errors';
import { apiClient } from './client';
import {
  cacheThemeResponse,
  getCachedThemeResponse,
  themeTokensLookMissing,
} from './theme-cache';
import type {
  ApiSuccess,
  CreateThemeRequest,
  ThemeListItem,
  ThemeResponse,
  UpdateThemeRequest,
} from '@/types/api';

export const themesApi = {
  /**
   * `GET /v1/themes/{customerId}/all` — admin; summaries only (no full token maps).
   */
  listByCustomer: async (customerId: string): Promise<ThemeListItem[]> => {
    const cid = encodeURIComponent(customerId);
    const res = await apiClient.get<ApiSuccess<ThemeListItem[]>>(
      `/v1/themes/${cid}/all`
    );
    return res.data.data;
  },

  /**
   * `GET /v1/themes/{customerId}` — resolved active theme (public; includes `tokens`).
   */
  getActive: async (customerId: string): Promise<ThemeResponse> => {
    const cid = encodeURIComponent(customerId);
    const res = await apiClient.get<ApiSuccess<ThemeResponse>>(
      `/v1/themes/${cid}`
    );
    const theme = res.data.data;
    cacheThemeResponse(theme);
    return theme;
  },

  /**
   * `GET /v1/themes/{customerId}/{themeId}` — admin; full resolved tokens for one theme.
   */
  getTheme: async (
    customerId: string,
    themeId: string
  ): Promise<ThemeResponse> => {
    const cid = encodeURIComponent(customerId);
    const tid = encodeURIComponent(themeId);
    const res = await apiClient.get<ApiSuccess<ThemeResponse>>(
      `/v1/themes/${cid}/${tid}`
    );
    const theme = res.data.data;
    cacheThemeResponse(theme);
    return theme;
  },

  /**
   * Load full theme via PUT (read path). Used when GET-by-id is not on API Gateway JWT auth.
   * Sends only themeName so overrides are unchanged; backend may still bump version.
   */
  fetchThemeViaPut: async (
    customerId: string,
    themeId: string,
    themeName: string
  ): Promise<ThemeResponse> => {
    await ensureAccessToken();
    return themesApi.update(customerId, themeId, { themeName });
  },

  /**
   * Load theme for editor.
   * Active themes use the public active-theme endpoint.
   * Inactive themes prefer GET-by-id; fall back to PUT read when GET auth fails on API Gateway.
   */
  getById: async (
    customerId: string,
    themeId: string
  ): Promise<ThemeResponse> => {
    const allThemes = await themesApi.listByCustomer(customerId);
    const meta = allThemes.find((t) => t.themeId === themeId);
    if (!meta) {
      throw new Error('Theme not found');
    }

    if (meta.isActive) {
      const active = await themesApi.getActive(customerId);
      if (active.themeId === themeId) {
        return active;
      }
    }

    const useCached = (): ThemeResponse | null => {
      const cached = getCachedThemeResponse(customerId, themeId);
      if (!cached) return null;
      return {
        ...cached,
        themeName: meta.themeName,
        isActive: meta.isActive,
        version: meta.version,
        updatedAt: meta.updatedAt,
        createdAt: meta.createdAt,
      };
    };

    const finishLoad = (theme: ThemeResponse): ThemeResponse => {
      if (!themeTokensLookMissing(theme, meta.overrideCount)) {
        return theme;
      }
      const cached = useCached();
      return cached ?? theme;
    };

    await ensureAccessToken();

    // Inactive themes: GET is not wired to JWT on API Gateway (IAM parse error on Bearer).
    // PUT on the same path works — load with an unchanged themeName payload.
    if (!meta.isActive) {
      const theme = await themesApi.fetchThemeViaPut(
        customerId,
        themeId,
        meta.themeName
      );
      return finishLoad(theme);
    }

    try {
      const theme = await themesApi.getTheme(customerId, themeId);
      return finishLoad(theme);
    } catch (err) {
      if (!axios.isAxiosError(err)) {
        throw err;
      }

      if (
        isAwsApiGatewayAuthHeaderError(err) ||
        isLikelyAuthFailure(err) ||
        err.response?.status === 403
      ) {
        const theme = await themesApi.fetchThemeViaPut(
          customerId,
          themeId,
          meta.themeName
        );
        return finishLoad(theme);
      }

      if (err.response?.status !== 404) {
        throw err;
      }
    }

    const cached = useCached();
    if (cached) {
      return cached;
    }

    return {
      customerId,
      themeId: meta.themeId,
      themeName: meta.themeName,
      isActive: meta.isActive,
      version: meta.version,
      isDefault: meta.themeId === 'default',
      createdAt: meta.createdAt,
      updatedAt: meta.updatedAt,
      tokens: {},
      font_tokens: { families: {}, sizes: {} },
    };
  },

  /** `POST /v1/themes/{customerId}` — admin. */
  create: async (
    customerId: string,
    data: CreateThemeRequest
  ): Promise<ThemeResponse> => {
    const cid = encodeURIComponent(customerId);
    const res = await apiClient.post<ApiSuccess<ThemeResponse>>(
      `/v1/themes/${cid}`,
      data
    );
    const theme = res.data.data;
    cacheThemeResponse(theme);
    return theme;
  },

  /** `PUT /v1/themes/{customerId}/{themeId}` — admin. */
  update: async (
    customerId: string,
    themeId: string,
    data: UpdateThemeRequest
  ): Promise<ThemeResponse> => {
    const cid = encodeURIComponent(customerId);
    const tid = encodeURIComponent(themeId);
    const res = await apiClient.put<ApiSuccess<ThemeResponse>>(
      `/v1/themes/${cid}/${tid}`,
      data
    );
    const theme = res.data.data;
    cacheThemeResponse(theme);
    return theme;
  },

  /** `DELETE /v1/themes/{customerId}/{themeId}` — admin. */
  delete: async (customerId: string, themeId: string): Promise<void> => {
    const cid = encodeURIComponent(customerId);
    const tid = encodeURIComponent(themeId);
    await apiClient.delete(`/v1/themes/${cid}/${tid}`);
  },

  /**
   * `PATCH /v1/themes/{customerId}/{themeId}/activate` — admin.
   */
  activate: async (
    customerId: string,
    themeId: string
  ): Promise<ThemeResponse> => {
    const cid = encodeURIComponent(customerId);
    const tid = encodeURIComponent(themeId);
    const res = await apiClient.patch<ApiSuccess<ThemeResponse>>(
      `/v1/themes/${cid}/${tid}/activate`
    );
    const theme = res.data.data;
    cacheThemeResponse(theme);
    return theme;
  },
};
