import { BASE_URL, fetchApi } from '../fetchApi';
import {
  AdminListData,
  AdminUser,
  AdminUserParams,
  AllAdminUserResponse,
} from './admin-user.type';
import {
  CreateAdminRequest,
  UpdateAdminRequest,
} from '../swagger-type/data-contracts';
import { buildQueryParams } from '@/lib/query-params';

export const getAllAdminUser = async (params: AdminUserParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/admin/user/?${queryParams}`;

  return fetchApi<AdminListData[]>(endpoint, {
    method: 'GET',
    requireAuth: true,
  });
};

export const createAdminUser = async (adminUser: CreateAdminRequest) => {
  return fetchApi<null>(`${BASE_URL}/admin/user`, {
    method: 'POST',
    body: { ...adminUser },
    requireAuth: true,
  });
};

export const updateAdminUser = async (adminUser: UpdateAdminRequest) => {
  return fetchApi<null>(`${BASE_URL}/admin/user`, {
    method: 'PATCH',
    body: { ...adminUser },
    requireAuth: true,
  });
};

export const deleteAdminUser = (idList: string) => {
  return fetchApi<null>(`${BASE_URL}/admin/user/?id_list=${idList}`, {
    method: 'DELETE',
    requireAuth: true,
  });
};

export const getAdminUserById = (adminId: string | number) => {
  return fetchApi<AdminUser>(`${BASE_URL}/admin/user/detail/${adminId}`, {
    method: 'GET',
    requireAuth: true,
  });
};
