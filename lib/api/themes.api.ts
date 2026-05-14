import { apiClient } from './client';
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
    return res.data.data;
  },

  /**
   * Load theme for editor: full tokens when active; otherwise metadata only and empty tokens
   * (editor bases colours on `DEFAULT_THEME`).
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
      return themesApi.getActive(customerId);
    }
    return {
      customerId,
      themeId: meta.themeId,
      themeName: meta.themeName,
      isActive: false,
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
    return res.data.data;
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
    return res.data.data;
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
    return res.data.data;
  },
};
