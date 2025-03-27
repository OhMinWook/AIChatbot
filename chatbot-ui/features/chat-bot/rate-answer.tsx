// components/RateAnswer.tsx

import { Button } from '@/components/ui/button';
import StarRating from './star-rating';
import { useState } from 'react';
import { rateChatBotAction } from '@/actions/chat-bot-action';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { ChatData } from '@/services/chatbot/chatbot.type';

interface RateAnswerProps {
  onClose: () => void;
  chatId: number | string;
  dgstfn: string | number | undefined;
  submitRate: (chatid: number, dgstfn: number) => void;
}

export default function RateAnswer({
  onClose,
  chatId,
  dgstfn,
  submitRate,
}: RateAnswerProps) {
  const queryClient = useQueryClient();
  const initialRating = !isNaN(Number(dgstfn)) ? Number(dgstfn) : 0;

  const [rating, setRating] = useState<number>(initialRating);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await rateChatBotAction(chatId, rating);

    if (response.error) {
      return;
    }

    queryClient.setQueryData(
      ['chat-bot-history'],
      (oldData: InfiniteData<ChatData[]>) => ({
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((chat) =>
            chat.id === chatId ? { ...chat, dgstfn: rating } : chat,
          ),
        ),
      }),
    );
    submitRate(Number(chatId), rating);
    onClose();
  };

  return (
    <section className='w-[450px] p-10 h-auto bg-customColor-white flex flex-col space-y-3 justify-center items-center'>
      <h1 className='text-3xl pt-10 font-bold'>
        답변의 만족도를 등록해 주세요
      </h1>
      <article className='flex flex-col justify-center items-center space-y-5 py-10'>
        {/* 초기 별점을 전달 */}
        <StarRating onRatingChange={setRating} initialRating={rating} />
        <p className='text-xl text-customColor-gray1'>선택해주세요</p>
      </article>
      {/* onSubmit을 form의 onSubmit으로 설정 */}
      <form
        onSubmit={handleSubmit}
        className='flex w-full justify-around items-center'
      >
        <Button variant={'enter2'} className='w-60 h-20 px-20'>
          별점 등록
        </Button>
        <Button
          type='button'
          variant={'cancel1'}
          className='h-20 w-60 px-5'
          onClick={() => onClose()}
        >
          닫기
        </Button>
      </form>
    </section>
  );
}
