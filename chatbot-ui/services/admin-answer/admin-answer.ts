import { buildQueryParams } from '@/lib/query-params';
import { fetchApi } from '../fetchApi';
import { UpdateAnswerRequest } from '../swagger-type/data-contracts';
import {
  AnswerSearch,
  AnswerParams,
  AnswerResponse,
  AnswerData,
  UpdateAnswerData,
  ReportResponse,
  AnswerListData,
  AnswerReportData,
} from './admin-answer.type';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAnswerSearchType = () => {
  return fetchApi<AnswerSearch>(`${BASE_URL}/admin/common/answer`, {
    method: 'GET',
    requireAuth: true,
  });
};

export const getAllAnswerReport = () => {
  return fetchApi<AnswerResponse>(`${BASE_URL}/admin/answer/`, {
    method: 'GET',
    requireAuth: true,
  });
};

export const getAnswerReport = (params: AnswerParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/admin/answer/?${queryParams}`;

  return fetchApi<AnswerListData[]>(endpoint, {
    method: 'GET',
    requireAuth: true,
  });
};

export const deleteAnswerReport = (report_id: string) => {
  return fetchApi<null>(
    `${BASE_URL}/admin/answer/report?report_id=${report_id}`,
    {
      method: 'DELETE',
      requireAuth: true,
    },
  );
};

export const getAnswerReportId = (report_id: number) => {
  return fetchApi<AnswerReportData>(
    `${BASE_URL}/admin/answer/report/${report_id}`,
    {
      method: 'GET',
      requireAuth: true,
    },
  );
};

// parameter 받는 함수
export const getAdminAnswerId = (answer_id: number) => {
  return fetchApi<null>(`${BASE_URL}/admin/answer/report/${answer_id}`, {
    method: 'GET',
    requireAuth: true,
  });
};

export const getAnswerId = () => {
  return fetchApi<AnswerData>(`${BASE_URL}/admin/answer/1`, {
    method: 'GET',
    requireAuth: true,
  });
};

// parameter 받는 함수
export const updateAdminAnswer = (
  answer_id: number,
  body: UpdateAnswerRequest,
) => {
  return fetchApi<UpdateAnswerData>(`${BASE_URL}/admin/answer/${answer_id}`, {
    method: 'PATCH',
    body,
    requireAuth: true,
  });
};

export const updateAnswer = (body: UpdateAnswerRequest) => {
  return fetchApi<UpdateAnswerData>(`${BASE_URL}/admin/answer/1`, {
    method: 'PATCH',
    body,
    requireAuth: true,
  });
};
