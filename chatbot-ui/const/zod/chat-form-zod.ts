import { z } from 'zod';

export const chatBotSchema = z.object({
  chat: z
    .string()
    .min(2, {
      message: '질문은 2글자 이상으로 작성되어야 합니다.',
    })
    .max(500, {
      message: '질문은 500글자 이하로 작성되어야 합니다',
    }),
});
