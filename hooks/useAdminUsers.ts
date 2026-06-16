'use client';

import { useQuery } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/admin-users.api';

export const ADMIN_USERS_QUERY_KEY = ['admin', 'users'];

export function useAdminUsers() {
  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: adminUsersApi.listUsers,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function adminUserBookingsQueryKey(userId: string | null) {
  return ['admin', 'users', userId, 'bookings'];
}

export function useAdminUserBookings(userId: string | null) {
  return useQuery({
    queryKey: adminUserBookingsQueryKey(userId),
    queryFn: () => adminUsersApi.listBookingsForUser(userId as string),
    enabled: Boolean(userId),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

