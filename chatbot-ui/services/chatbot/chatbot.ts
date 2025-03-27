import { buildQueryParams } from '@/lib/query-params';
import { BASE_URL, fetchApi } from '../fetchApi';
import { AllChatParams, ChatData, ChatImageParams } from './chatbot.type';
import {
  QuestionRequest,
  RateRequest,
  ReportRequest,
} from '../swagger-type/data-contracts';

export const getAllChat = (params: AllChatParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/chatbot?${queryParams}`;

  return fetchApi<ChatData[]>(endpoint, {
    method: 'GET',
    requireAuth: true,
    isNormal: true,
  });
};

export const questionChatBot = (body: QuestionRequest) => {
  const endpoint = `${BASE_URL}/chatbot/answer`;

  return fetchApi<ChatData>(endpoint, {
    method: 'POST',
    body,
    requireAuth: true,
    isNormal: true,
  });
};

export const rateChatBot = (body: RateRequest) => {
  const endpoint = `${BASE_URL}/chatbot/rate`;

  return fetchApi<null>(endpoint, {
    method: 'PATCH',
    body,
    requireAuth: true,
    isNormal: true,
  });
};

export const reportChatBot = (body: ReportRequest) => {
  const endpoint = `${BASE_URL}/chatbot/report`;

  return fetchApi<null>(endpoint, {
    method: 'POST',
    body,
    requireAuth: true,
    isNormal: true,
  });
};

export const cancelChatBot = () => {
  const endpoint = `${BASE_URL}/chatbot/cancel`;

  return fetchApi<null>(endpoint, {
    method: 'POST',
    requireAuth: true,
    isNormal: true,
  });
};

export const getChatImage = (params: ChatImageParams) => {
  const queryParams = buildQueryParams(params);
  const endpoint = `${BASE_URL}/chatbot/image?${queryParams}`;

  return fetchApi<string>(endpoint, {
    method: 'GET',
    requireAuth: true,
    isNormal: true,
  });
};
