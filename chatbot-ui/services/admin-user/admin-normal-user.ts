import { buildQueryParams } from '@/lib/query-params';
import { AdminUserParams } from './admin-user.type';
import { BASE_URL, fetchApi } from '../fetchApi';
import {
  CreateNormalUserRequest,
  UpdateNormalUserRequest,
  UserListData,
} from './admin-normal-user.type';

export const getAllNoramlUserList = async (params: AdminUserParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/admin/user/member/?${queryParams}`;

  return fetchApi<UserListData[]>(endpoint, {
    method: 'GET',
    requireAuth: true,
  });
};

export const createNormalUser = async (body: CreateNormalUserRequest) => {
  return fetchApi<null>(`${BASE_URL}/admin/user/member`, {
    method: 'POST',
    body,
    requireAuth: true,
  });
};

export const updateNoramlUser = async (body: UpdateNormalUserRequest) => {
  return fetchApi<null>(`${BASE_URL}/admin/user/member`, {
    method: 'PATCH',
    body,
    requireAuth: true,
  });
};

export const deleteNormalUser = (idList: string) => {
  return fetchApi<null>(`${BASE_URL}/admin/user/member/?id_list=${idList}`, {
    method: 'DELETE',
    requireAuth: true,
  });
};

export const getNormalUserById = (userId: string | number) => {
  return fetchApi<UserListData>(
    `${BASE_URL}/admin/user/member/detail/${userId}`,
    {
      method: 'GET',
      requireAuth: true,
    },
  );
};
