'use server';

import { updateSessionNormal } from '@/lib/session-util';
import {
  cancelChatBot,
  getAllChat,
  getChatImage,
  questionChatBot,
  rateChatBot,
  reportChatBot,
} from '@/services/chatbot/chatbot';
import {
  AllChatParams,
  ChatImageParams,
} from '@/services/chatbot/chatbot.type';

export const getAllChatAction = async (params: AllChatParams) => {
  const response = await getAllChat(params);
  await updateSessionNormal(response.cookie);
  return response.data;
};

export const rateChatBotAction = async (id: string | number, rate: number) => {
  const body: any = {
    id,
    dgstfn: rate,
  };

  const response = await rateChatBot(body);

  return response.data;
};

export const reportChatBotAction = async (
  id: string | number,
  report_content: string,
) => {
  const body: any = {
    id,
    report_content,
  };

  const response = await reportChatBot(body);

  return response.data;
};

export const questionChatBotAction = async (question_content: string) => {
  const body: any = {
    question_content,
    call_path: 'user',
  };

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await questionChatBot(body);

  return response.data;
};

export const cancelChatBotAction = async () => {
  const response = await cancelChatBot();

  return response.data;
};

export const getChatImageAction = async (params: ChatImageParams) => {
  const response = await getChatImage(params);

  return response.data;
};
