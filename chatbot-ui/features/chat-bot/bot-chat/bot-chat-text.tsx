'use client';
import { useEffect, useState } from 'react';
import BotChatButtons from './bot-chat-buttons';
import { convertMarkdownToHtml, isHtmlContent } from '@/lib/markdown-util';
import { BotChatArrayImageDialog } from '../bot-chat-array/bot-chat-array-image-dialog';

interface BotChatTextProps {
  text: string;
  chatId: number | string;
  dgstfn: string | number | undefined;
  hash_id_list?: string[];
  submitRate: (chatid: number, dgstfn: number) => void;
  submitReport: (chatid: number) => void;
  is_report_exist: boolean;
  imgs?: any;
}

export default function BotChatText({
  text,
  chatId,
  dgstfn,
  hash_id_list,
  submitRate,
  submitReport,
  is_report_exist,
}: BotChatTextProps) {
  const [processedContent, setProcessedContent] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedHashId, setSelectedHashId] = useState<string | null>(null);

  useEffect(() => {
    const processContent = async () => {
      let content = isHtmlContent(text)
        ? text
        : await convertMarkdownToHtml(text);

      if (hash_id_list) {
        hash_id_list.forEach((hash_id) => {
          if (content.includes(hash_id)) {
            content = content.replace(
              new RegExp(hash_id, 'g'),
              `<span class="dialog-trigger underline cursor-pointer text-[#c92f5c] hover:text-[#5a0820]" data-hash-id="${hash_id}">${hash_id}</span>`,
            );
          }
        });
      }

      setProcessedContent(content);
    };

    processContent();
  }, [text, hash_id_list]);

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains('dialog-trigger')) {
      const hashId = target.getAttribute('data-hash-id');

      if (hashId) {
        setSelectedHashId(hashId);
        setIsDialogOpen(true);
      }
    }
  };

  return (
    <>
      <section className='bg-customColor-white border-1 border-customColor-bg3 rounded-2xl px-3 md:px-5 py-3 md:py-5'>
        <div
          className='prose w-full h-auto min-h-16 max-w-none'
          dangerouslySetInnerHTML={{ __html: processedContent }}
          onClick={handleContentClick}
        />
      </section>
      <BotChatButtons
        className='flex md:hidden pt-3'
        chatId={chatId}
        dgstfn={dgstfn}
        submitRate={submitRate}
        submitReport={submitReport}
        is_report_exist={is_report_exist}
      />

      {selectedHashId && isDialogOpen && (
        <BotChatArrayImageDialog
          hashId={selectedHashId}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedHashId(null);
          }}
        />
      )}
    </>
  );
}
