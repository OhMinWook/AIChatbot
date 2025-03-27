'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import ChatBotDialog from '../chat-bot-dialog';
import RateAnswer from '../rate-answer';
import { ReportAnswerDialog } from '../alert/report-answer-dialog';
import { ReportExistDialog } from '../alert/report-exist-dialog';

interface BotChatButtonsProps extends HTMLAttributes<HTMLDivElement> {
  chatId: number | string;
  dgstfn: string | number | undefined;
  submitRate: (chatid: number, dgstfn: number) => void;
  submitReport: (chatid: number) => void;
  is_report_exist: boolean;
}

export default function BotChatButtons({
  chatId,
  className,
  dgstfn,
  submitRate,
  submitReport,
  is_report_exist,
  ...props
}: BotChatButtonsProps) {
  return (
    <div className={cn('flex space-x-3 relative', className)} {...props}>
      {is_report_exist ? (
        <ReportExistDialog />
      ) : (
        <ReportAnswerDialog chatId={chatId} submitReport={submitReport} />
      )}

      <ChatBotDialog
        title='star rating'
        content={({ onClose }) => (
          <RateAnswer
            onClose={onClose}
            chatId={chatId}
            dgstfn={dgstfn}
            submitRate={submitRate}
          />
        )}
        triggerButton={{
          variant: 'select2',
          icon: 'star',
          text: '별점 선택하기',
        }}
      />
    </div>
  );
}
