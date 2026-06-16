import { apiClient } from './client';
import type { AdminBookingListItem, AdminUserListItem, ApiSuccess } from '@/types/api';

export const adminUsersApi = {
  /** `GET /v1/admin/users` — admin only. */
  listUsers: async (): Promise<AdminUserListItem[]> => {
    const res = await apiClient.get<ApiSuccess<AdminUserListItem[]>>('/v1/admin/users');
    return res.data.data;
  },

  /** `GET /v1/admin/users/{userId}/bookings` — admin only. */
  listBookingsForUser: async (userId: string): Promise<AdminBookingListItem[]> => {
    const uid = encodeURIComponent(userId);
    const res = await apiClient.get<ApiSuccess<AdminBookingListItem[]>>(
      `/v1/admin/users/${uid}/bookings`
    );
    return res.data.data;
  },
};

