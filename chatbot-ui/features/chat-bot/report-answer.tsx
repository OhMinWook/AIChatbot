'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { reportChatBotAction } from '@/actions/chat-bot-action';
import { SquarePen } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ReportExist } from './alert/report-exist';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { ChatData } from '@/services/chatbot/chatbot.type';

interface RateAnswerProps {
  onClose: () => void;
  chatId: number | string;
  submitReport: (chatid: number) => void;
}

export default function ReportAnswer({
  onClose,
  chatId,
  submitReport,
}: RateAnswerProps) {
  const queryClient = useQueryClient();
  const [reportText, setReportText] = useState('');

  const handleSubmit = async () => {
    const response = await reportChatBotAction(chatId, reportText);

    if (response.error) {
      return;
    }

    queryClient.setQueryData(
      ['chat-bot-history'],
      (oldData: InfiniteData<ChatData[]>) => ({
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((chat) =>
            chat.id === chatId ? { ...chat, is_report_exist: true } : chat,
          ),
        ),
      }),
    );

    onClose();
    submitReport(Number(chatId));
  };

  return (
    <>
      <section className=' w-[400px] rounded-xl p-10 h-auto bg-customColor-white flex flex-col space-y-3'>
        <div className='flex w-full space-x-3 justify-start items-center pt-10'>
          <SquarePen className='w-12 h-12 rounded-full bg-customColor-gray1 p-2' />
          <h1 className='text-3xl font-bold'>답변 평가하기</h1>
        </div>

        <article className='w-full py-5'>
          <Textarea
            placeholder='Tell us a little bit about yourself'
            className='resize-none text-xl'
            value={reportText}
            onChange={(e) => setReportText(e.currentTarget.value)}
          />
        </article>

        <form
          action={handleSubmit}
          className='flex space-x-5 justify-center items-center w-full'
        >
          <Button type='submit' variant={'enter2'} className='h-20 w-full px-5'>
            Report
          </Button>
          <Button
            type='button'
            variant={'cancel1'}
            className='h-20 w-full px-5'
            onClick={() => onClose()}
          >
            Cancel
          </Button>
        </form>
      </section>
    </>
  );
}
