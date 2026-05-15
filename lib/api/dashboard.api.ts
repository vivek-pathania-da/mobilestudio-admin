import { apiClient } from './client';
import type { ApiSuccess, DashboardMetrics } from '@/types/api';

export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const res = await apiClient.get<ApiSuccess<DashboardMetrics>>(
      '/v1/dashboard/metrics'
    );
    return res.data.data;
  },
};
