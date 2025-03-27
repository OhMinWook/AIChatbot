import { BASE_URL, fetchApi } from '../fetchApi';
import { ManualItem } from './admin-common.type';

export const getAdminCommonManual = () => {
  return fetchApi<ManualItem[]>(`${BASE_URL}/admin/common/manual`, {
    method: 'GET',
    requireAuth: true,
  });
};

export const getAdminCommonAnswer = () => {
  return fetchApi<ManualItem[]>(`${BASE_URL}/admin/common/answer`, {
    method: 'GET',
    requireAuth: true,
  });
};
