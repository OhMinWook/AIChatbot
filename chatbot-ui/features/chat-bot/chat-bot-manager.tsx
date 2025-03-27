'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import ChatBotFooter from './chat-bot-footer';
import ChatBotHeader from './chat-bot-header';
import ChattingBox from './chatting-box';
import { questionChatBotAction } from '@/actions/chat-bot-action';
import { useChatBotHistory } from '@/components/hooks/infinite-scroll/use-chat-bot-history';
import MyChatBox from './my-chat-box';
import BotChatBox from './bot-chat-box';
import { useInView } from 'react-intersection-observer';

interface ChatBotHistoryProps {
  newChatData: NewChatData[];
  submitRate: (chatid: number, dgstfn: number) => void;
  submitReport: (chatid: number) => void;
  isUpdate: boolean;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
}

const ChatBotHistory = ({
  newChatData,
  submitRate,
  submitReport,
  isUpdate,
  setIsUpdate,
}: ChatBotHistoryProps) => {
  const { data: chatHistoryData, fetchNextPage } = useChatBotHistory({});

  const [fetchNextRef, inView] = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <section
      ref={scrollContainerRef}
      className='w-full px-5 pt-28 pb-52 h-auto max-h-dvh overflow-y-auto flex flex-col-reverse items-center'
    >
      <ChattingBox
        chatData={newChatData}
        submitRate={submitRate}
        submitReport={submitReport}
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
        handleScroll={handleScroll}
      />
      {chatHistoryData?.pages[0].length === 0 && (
        <section className='w-full flex justify-center items-center'>
          <p className='text-3xl pt-20'>궁금한걸 물어보세요!</p>
        </section>
      )}
      {chatHistoryData?.pages.map((chatPages) =>
        chatPages.map((chat) => (
          <div
            key={chat.id}
            className='w-full max-w-[1280px] my-3 md:my-10 flex flex-col space-y-3 md:space-y-10'
          >
            <MyChatBox chat={chat.question_content} />
            <>
              {chat.answer_content && (
                <BotChatBox
                  variant='text'
                  text={chat.answer_content}
                  imgs={chat.image_path}
                  date={chat.date}
                  chatId={chat.id!}
                  dgstfn={chat.dgstfn}
                  is_report_exist={chat.is_report_exist!}
                  submitRate={submitRate}
                  submitReport={submitReport}
                  hash_id_list={chat.hash_id_list}
                />
              )}
              {/* {isValidManualPath(chat.manual_path) && (
                <BotChatBox
                  variant='array'
                  imgs={chat.image_path}
                  manuals={chat.manual_path}
                  screen={chat.screen_id}
                  date={chat.date}
                />
              )} */}
            </>
          </div>
        )),
      )}
      <div ref={fetchNextRef} className='opacity-0 text-3xl'>
        more
      </div>
    </section>
  );
};

export interface NewChatData {
  question_content: string;
  answer_content?: string;
  key?: number;
  id?: number;
  screen_id?: string;
  image_path?: (string | null)[];
  manual_path?: (string | null)[];
  hash_id_list?: string[];
  dgstfn?: number;
  date?: number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  is_report_exist?: boolean;
}

interface ChatBotManagerProps {
  session: any;
}

export default function ChatBotManager({ session }: ChatBotManagerProps) {
  const [newChatData, setNewChatData] = useState<NewChatData[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const submitMessage = async (userMessage: string) => {
    setIsPending(true);
    setIsUpdate(true);
    const key = Date.now();

    const newChat: NewChatData = {
      key,
      question_content: userMessage,
      isLoading: true,
    };

    setNewChatData((prevChatData) => [...prevChatData, newChat]);
    const response = await questionChatBotAction(userMessage);
    // api error
    if (response.error) {
      setNewChatData((prevChatData) =>
        prevChatData.map((chat) =>
          chat.key === key
            ? {
                ...chat,
                isLoading: false,
                isError: true,
                errorMessage: response.message,
                is_report_exist: false,
              }
            : chat,
        ),
      );
      setIsPending(false);

      return;
    }

    setNewChatData((prevChatData) =>
      prevChatData.map((chat) =>
        chat.key === key
          ? {
              ...chat,
              answer_content: response.data.answer_content,
              manual_path: response.data.manual_path,
              screen_id: response.data.screen_id,
              image_path: response.data.image_path,
              dgstfn: response.data.dgstfn,
              hash_id_list: response.data.hash_id_list,
              isLoading: false,
              isError: false,
              date: response.data.date,
              id: response.data.id,
            }
          : chat,
      ),
    );

    setIsPending(false);
  };

  const submitRate = (chatid: number, dgstfn: number) => {
    setNewChatData((prevChatData) =>
      prevChatData.map((chat) =>
        chat.id === chatid
          ? {
              ...chat,
              dgstfn,
            }
          : chat,
      ),
    );
  };

  const submitReport = (chatid: number) => {
    setNewChatData((prevChatData) =>
      prevChatData.map((chat) =>
        chat.id === chatid
          ? {
              ...chat,
              is_report_exist: true,
            }
          : chat,
      ),
    );
  };

  return (
    <article className='w-full h-full flex flex-col justify-start items-center relative'>
      <ChatBotHeader />
      <ChatBotHistory
        newChatData={newChatData}
        submitRate={submitRate}
        submitReport={submitReport}
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
      />

      <ChatBotFooter
        addChatMessage={submitMessage}
        isPending={isPending}
        session={session}
      />
    </article>
  );
}
