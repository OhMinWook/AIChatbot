'use client';

import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { getAllChatAction } from '@/actions/chat-bot-action';
import { ChatData } from '@/services/chatbot/chatbot.type';

interface UseChatBotHistoryOptions {
  initialData?: InfiniteData<ChatData[], number>;
}

export const useChatBotHistory = ({
  initialData,
}: UseChatBotHistoryOptions) => {
  return useInfiniteQuery({
    queryKey: ['chat-bot-history'],
    queryFn: async ({ pageParam = 0 }) => {
      const params = {
        last_id: pageParam,
      };

      const response = await getAllChatAction(params);
      return response.data;
    },

    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;

      const ids = lastPage.map((item) => item.id);
      const minId = Math.min(...ids);

      return minId;
    },
    initialData,
    staleTime: 1000 * 60 * 5,
  });
};
