import { apiClient } from './client';
import type {
  ApiSuccess,
  MockFlightCancelledRequest,
  MockFlightDelayedRequest,
  MockGateChangedRequest,
  MockNotificationResult,
} from '@/types/api';

export const notificationsApi = {
  /** `POST /v1/notifications/mock/flight-delayed` — admin. */
  mockFlightDelayed: async (
    data: MockFlightDelayedRequest
  ): Promise<MockNotificationResult> => {
    const res = await apiClient.post<ApiSuccess<MockNotificationResult>>(
      '/v1/notifications/mock/flight-delayed',
      data
    );
    return res.data.data;
  },

  /** `POST /v1/notifications/mock/flight-cancelled` — admin. */
  mockFlightCancelled: async (
    data: MockFlightCancelledRequest
  ): Promise<MockNotificationResult> => {
    const res = await apiClient.post<ApiSuccess<MockNotificationResult>>(
      '/v1/notifications/mock/flight-cancelled',
      data
    );
    return res.data.data;
  },

  /** `POST /v1/notifications/mock/gate-changed` — admin. */
  mockGateChanged: async (
    data: MockGateChangedRequest
  ): Promise<MockNotificationResult> => {
    const res = await apiClient.post<ApiSuccess<MockNotificationResult>>(
      '/v1/notifications/mock/gate-changed',
      data
    );
    return res.data.data;
  },
};
