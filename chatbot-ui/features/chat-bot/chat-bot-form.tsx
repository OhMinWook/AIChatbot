'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input/input';
import { chatBotSchema } from '@/const/zod/chat-form-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Square } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface ChatBotFormProps {
  addChatMessage: (userMessage: string) => void;
  isPending: boolean;
  session: any;
}

export default function ChatBotForm({
  addChatMessage,
  isPending,
  session,
}: ChatBotFormProps) {
  const form = useForm<z.infer<typeof chatBotSchema>>({
    resolver: zodResolver(chatBotSchema),
    defaultValues: {
      chat: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof chatBotSchema>) => {
    addChatMessage(values.chat);

    // 폼 초기화
    form.reset();
  };

  const handleCancel = async () => {
    try {
      const cookie = session.user.fullCookie;

      const endpoint = '/api/chatbot/cancel';

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cookie }),
      });
    } catch (error) {
      console.error('Error cancelling chat:', error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full h-20 relative border-1 border-customColor-gray1 rounded-full flex justify-between items-center'
      >
        <FormField
          control={form.control}
          name='chat'
          render={({ field }) => (
            <FormItem className='w-full h-full'>
              <FormControl>
                <Input
                  placeholder='질문을 입력해주세요.'
                  className='w-full h-full text-2xl bg-transparent rounded-full border-0 pl-10 pr-48'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isPending ? (
          <button
            type='button'
            className='flex justify-center items-center bg-customColor-primary1 hover:bg-customColor-primary2 px-3 py-3 rounded-full w-24 absolute right-3 stroke-white'
            onClick={handleCancel}
          >
            <Square className='stroke-inherit' />
          </button>
        ) : (
          <Button
            type='submit'
            className='bg-customColor-gray1 px-3 py-3 rounded-full w-24 absolute right-3 stroke-white hover:bg-customColor-primary1'
          >
            <Send className='stroke-inherit' />
          </Button>
        )}
      </form>
    </Form>
  );
}
