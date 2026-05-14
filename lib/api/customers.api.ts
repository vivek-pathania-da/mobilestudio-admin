import { apiClient } from './client';
import type {
  ApiSuccess,
  CreateCustomerRequest,
  Customer,
  CustomerStatus,
  UpdateCustomerRequest,
} from '@/types/api';

export interface ListCustomersParams {
  /** When set, server returns only that status. Omit to return active and churned. */
  status?: CustomerStatus;
}

export const customersApi = {
  /** `GET /v1/customers` — newest first. */
  list: async (params?: ListCustomersParams): Promise<Customer[]> => {
    const res = await apiClient.get<ApiSuccess<Customer[]>>('/v1/customers', {
      params:
        params?.status !== undefined ? { status: params.status } : undefined,
    });
    return res.data.data;
  },

  /** `GET /v1/customers/{customerId}` — `customerId` must be a UUID. */
  get: async (customerId: string): Promise<Customer> => {
    const res = await apiClient.get<ApiSuccess<Customer>>(
      `/v1/customers/${encodeURIComponent(customerId)}`
    );
    return res.data.data;
  },

  /** `POST /v1/customers` — server assigns UUID `customerId` and unique `customerCode`. */
  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const res = await apiClient.post<ApiSuccess<Customer>>(
      '/v1/customers',
      data
    );
    return res.data.data;
  },

  /**
   * `PATCH /v1/customers/{customerId}` — partial update (`UpdateCustomerRequest`, at least one field).
   */
  update: async (
    customerId: string,
    data: UpdateCustomerRequest
  ): Promise<Customer> => {
    const path = `/v1/customers/${encodeURIComponent(customerId)}`;
    const body = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ) as UpdateCustomerRequest;
    const res = await apiClient.patch<ApiSuccess<Customer>>(path, body);
    return res.data.data;
  },

  /**
   * `DELETE /v1/customers/{customerId}` — soft-delete (sets status to `churned`).
   * Repeat delete returns 400.
   */
  churn: async (customerId: string): Promise<Customer> => {
    const res = await apiClient.delete<ApiSuccess<Customer>>(
      `/v1/customers/${encodeURIComponent(customerId)}`
    );
    return res.data.data;
  },
};
