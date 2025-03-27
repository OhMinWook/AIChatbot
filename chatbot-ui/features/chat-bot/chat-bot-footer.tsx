'use client';
import { Session } from 'next-auth';
import ChatBotForm from './chat-bot-form';

interface ChatBotFooterProps {
  addChatMessage: (userMessage: string) => void;
  isPending: boolean;
  session: any;
}

export default function ChatBotFooter({
  addChatMessage,
  isPending,
  session,
}: ChatBotFooterProps) {
  return (
    <section className='w-full h-40 border-t-1 fixed bottom-0 flex justify-center items-center z-40 bg-customColor-white'>
      <article className='w-full max-w-[1280px] px-5'>
        <ChatBotForm
          addChatMessage={addChatMessage}
          isPending={isPending}
          session={session}
        />
      </article>
    </section>
  );
}
