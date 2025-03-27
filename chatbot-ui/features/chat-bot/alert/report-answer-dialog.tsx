import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog/_dialog.config';
import { Button } from '@/components/ui/button';
import ReportAnswer from '../report-answer';

interface ReportAnswerDialogProps {
  chatId: number | string;
  submitReport: (chatid: number) => void;
}

export const ReportAnswerDialog = ({
  chatId,
  submitReport,
}: ReportAnswerDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='select2' icon='report' onClick={() => setIsOpen(true)}>
          부정확한 답변 신고
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[500px] max-h-[300px] flex justify-center items-center'>
        <ReportAnswer
          onClose={handleClose}
          chatId={chatId}
          submitReport={submitReport}
        />
      </DialogContent>
    </Dialog>
  );
};
