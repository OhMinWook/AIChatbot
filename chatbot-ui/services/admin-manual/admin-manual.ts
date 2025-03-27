import { buildQueryParams } from '@/lib/query-params';
import { BASE_URL, fetchApi } from '../fetchApi';
import {
  EmbeddingParams,
  ImageUpload,
  ManaulId,
  ManaulParams,
  ManualResponse,
  Manuals,
  ManualUpload,
  UpdateManualBody,
  UploadImageParams,
  UploadManualEndParams,
  UploadManualParams,
} from './admin-manual.type';
import axios from 'axios';
import { auth } from '@/auth';

export const getAllManuals = () => {
  return fetchApi<ManualResponse>(`${BASE_URL}/admin/manual`, {
    method: 'GET',
    requireAuth: true,
  });
};

// 메뉴얼 리스트 map api
export const getManuals = (params: ManaulParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/admin/manual/?${queryParams}`;

  return fetchApi<Manuals[]>(endpoint, {
    method: 'GET',
    requireAuth: true,
  });
};

export const deleteAdminManual = (id_list: string) => {
  return fetchApi<null>(`${BASE_URL}/admin/manual/?id_list=${id_list}`, {
    method: 'DELETE',
    requireAuth: true,
  });
};

// 메뉴얼 상세 정보 팝업 api
export const getAdminManualById = (manual_id: string | number) => {
  return fetchApi<ManaulId>(`${BASE_URL}/admin/manual/embedding/${manual_id}`, {
    method: 'GET',
    requireAuth: true,
  });
};

export const updateAdminManualById = (
  type_id: string | number,
  body: UpdateManualBody,
) => {
  return fetchApi<null>(`${BASE_URL}/admin/manual/${type_id}`, {
    method: 'PATCH',
    body,
    requireAuth: true,
  });
};

export const getAdminManualPreprocessById = (set_id: string | number) => {
  return fetchApi<ManaulId>(`${BASE_URL}/admin/manual/preprocess/${set_id}`, {
    method: 'GET',
    requireAuth: true,
  });
};

export const uploadAdminManualFile = (params: UploadManualParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/admin/manual/file?${queryParams}`;

  return fetchApi<ManualUpload>(endpoint, {
    method: 'POST',
    requireAuth: true,
  });
};

export const uploadAdminManualImage = (params: UploadImageParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/admin/manual/image?${queryParams}`;

  return fetchApi<ImageUpload>(endpoint, {
    method: 'PATCH',
    requireAuth: true,
  });
};

export const createAdminManualPreprocessing = async (formData: FormData) => {
  const session = await auth();
  const cookie = session?.user?.fullCookie;

  return axios.post(`${BASE_URL}/admin/manual/preprocess`, formData, {
    headers: {
      Cookie: cookie,
      charset: 'utf-8',
    },

    timeout: 600000, // 10분
  });
};

export const addAdminManualCollection = (
  params: EmbeddingParams,
  body: FormData,
) => {
  const queryParams = buildQueryParams(params);
  const id = params.manual_id;
  const endpoint = `${BASE_URL}/admin/manual/${id}`;
  return fetchApi<null>(endpoint, {
    method: 'PUT',
    body,
    fileUpload: true,
    requireAuth: true,
  });
};

export const createAdminManualCollection = (
  params: EmbeddingParams,
  body: FormData,
) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/admin/manual/embedding?${queryParams}`;
  return fetchApi<null>(endpoint, {
    method: 'POST',
    body,
    fileUpload: true,
    requireAuth: true,
  });
};

export const uploadAdminManualFileEnd = (params: UploadManualEndParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/admin/manual/file?${queryParams}`;

  return fetchApi<ManualUpload>(endpoint, {
    method: 'GET',
    requireAuth: true,
  });
};
