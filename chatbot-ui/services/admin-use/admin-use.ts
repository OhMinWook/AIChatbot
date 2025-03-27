import { buildQueryParams } from '@/lib/query-params';
import { BASE_URL, fetchApi } from '../fetchApi';
import {
  AdminUsageHistory,
  AdminUseHistoryResponse,
  AllSummaryParams,
  AllUsageParams,
  UseHistory,
  UseHistoryResponse,
  UserSummary,
  UserUsage,
  UseSummaryResponse,
} from './admin-use.type';

export const getUserUsageAll = () => {
  return fetchApi<UseHistoryResponse>(`${BASE_URL}/admin/dashboard/use/user`, {
    method: 'GET',
    requireAuth: true,
  });
};

export const getUserUsage = (params: AllUsageParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/admin/dashboard/use/user?${queryParams}`;

  return fetchApi<UseHistory[]>(endpoint, {
    method: 'GET',
    requireAuth: true,
  });
};

export const getUserUsageAllSummary = () => {
  return fetchApi<UseSummaryResponse>(
    `${BASE_URL}/admin/dashboard/use/user/summary`,
    {
      method: 'GET',
      requireAuth: true,
    },
  );
};

export const getUserUsageSummary = (params: AllSummaryParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/admin/dashboard/use/user/summary?${queryParams}`;

  return fetchApi<UserSummary[]>(endpoint, {
    method: 'GET',
    requireAuth: true,
  });
};

export const getUserUsageById = (use_id: string | number) => {
  const endpoint = `${BASE_URL}/admin/dashboard/use/user/${use_id}`;

  return fetchApi<UserUsage>(endpoint, {
    method: 'GET',
    requireAuth: true,
  });
};

export const getAdminUsageAll = () => {
  return fetchApi<AdminUseHistoryResponse>(
    `${BASE_URL}/admin/dashboard/use/admin`,
    {
      method: 'GET',
      requireAuth: true,
    },
  );
};

export const getAdminUsage = (params: AllUsageParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/admin/dashboard/use/admin?${queryParams}`;

  return fetchApi<AdminUsageHistory[]>(endpoint, {
    method: 'GET',
    requireAuth: true,
  });
};

export const getAdminUsageAllSummary = () => {
  return fetchApi<UseSummaryResponse>(
    `${BASE_URL}/admin/dashboard/use/admin/summary`,
    {
      method: 'GET',
      requireAuth: true,
    },
  );
};

export const getAdminUsageSummary = (params: AllSummaryParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/admin/dashboard/use/admin/summary?${queryParams}`;

  return fetchApi<UserSummary[]>(endpoint, {
    method: 'GET',
    requireAuth: true,
  });
};
