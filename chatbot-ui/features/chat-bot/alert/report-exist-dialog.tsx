import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog/_dialog.config';
import { Button } from '@/components/ui/button';
import { ReportExist } from './report-exist';

export const ReportExistDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='select2' icon='report' onClick={() => setIsOpen(true)}>
          부정확한 답변 신고
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[300px] max-h-[200px] flex justify-center items-center'>
        <ReportExist onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};
