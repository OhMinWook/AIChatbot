'use server';

import { auth } from '@/auth';
import { reportChatBot } from '@/services/chatbot/chatbot';

export const testAction = async () => {
  return new Promise((resolve) => {
    let count = 0;
    const intervalId = setInterval(() => {
      console.log('콘솔 메시지 출력', count);
      count++;
      if (count >= 10) {
        clearInterval(intervalId);
        resolve(null);
      }
    }, 1000);
  });
};

export const testAction2 = async () => {
  console.log('testAction2');
  return null;
};
