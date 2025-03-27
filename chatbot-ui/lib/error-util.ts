import { ApiResponse } from '@/services/fetchApi.type';

export const getMessagesFromErrors = (
  ...responses: ApiResponse<any>[]
): string[] => {
  const messages: string[] = [];

  responses.forEach((resp) => {
    if (resp.error) {
      messages.push(resp.message);
    }
  });

  return messages;
};
