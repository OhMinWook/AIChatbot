'use client';

import { Dispatch, Fragment, SetStateAction, useEffect, useRef } from 'react';
import MyChatBox from './my-chat-box';
import BotChatBox from './bot-chat-box';
import BotChatLoadingUI from './bot-chat-loading';
import BotChatErrorUI from './bot-chat-error';
import { NewChatData } from './chat-bot-manager';

interface ChattingBoxProps {
  chatData: NewChatData[];
  submitRate: (chatid: number, dgstfn: number) => void;
  submitReport: (chatid: number) => void;
  isUpdate: boolean;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  handleScroll: any;
}

export default function ChattingBox({
  chatData = [],
  submitRate,
  submitReport,
  isUpdate,
  setIsUpdate,
  handleScroll,
}: ChattingBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    handleScroll();
  };

  useEffect(() => {
    if (isUpdate) {
      scrollToBottom();
      setIsUpdate(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData, isUpdate]);

  return (
    <section className='w-full max-w-[1280px] h-auto flex flex-col space-y-3 md:space-y-10'>
      {chatData.map((data) => (
        <Fragment key={data.key}>
          <MyChatBox chat={data.question_content} />
          {data.isLoading ? (
            <BotChatLoadingUI
              date={data.date || Math.floor(Date.now() / 1000)}
            />
          ) : data.isError ? (
            <BotChatErrorUI
              errorMessage={data.errorMessage!}
              date={data.date || Math.floor(Date.now() / 1000)}
            />
          ) : (
            <>
              {data.answer_content && (
                <BotChatBox
                  variant='text'
                  text={data.answer_content}
                  imgs={data.image_path}
                  date={data.date}
                  chatId={data.id!}
                  dgstfn={data.dgstfn}
                  is_report_exist={data.is_report_exist!}
                  submitRate={submitRate}
                  submitReport={submitReport}
                  hash_id_list={data.hash_id_list}
                />
              )}
              {/* {isValidManualPath(data.manual_path) && (
                <BotChatBox
                  variant='array'
                  imgs={data.image_path}
                  manuals={data.manual_path}
                  screen={data.screen_id}
                  date={data.date}
                />
              )} */}
            </>
          )}
        </Fragment>
      ))}
      <div ref={messagesEndRef} />
    </section>
  );
}
