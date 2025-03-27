'use client';

import DialogManualUpdateEdit from '@/components/dialog/manual/manual-update-edit';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog/_dialog.config';
import { useEscapeHandlerStore } from '@/store/use-escape-handler-store';
import { useState } from 'react';

interface DialogCellProps {
  manualId: number;
  textId: string;
  dialogWidth?: string;
  center?: boolean;
}

export default function DialogCell({
  manualId,
  textId,
  dialogWidth,
  center,
}: DialogCellProps) {
  const { onEscapeKeyDown } = useEscapeHandlerStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div>
        <DialogTrigger asChild>
          <p
            className={`${center && 'text-center'} cursor-pointer whitespace-nowrap md:whitespace-normal hover:underline`}
          >
            {textId}
          </p>
        </DialogTrigger>
      </div>

      <DialogContent
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        className={dialogWidth}
        onEscapeKeyDown={onEscapeKeyDown || handleClose}
      >
        <DialogHeader>
          <DialogTitle>메뉴얼 수정</DialogTitle>
          <DialogDescription className='hidden'>{manualId}</DialogDescription>
        </DialogHeader>

        {/* <DialogManualUpdate preprocess_id={manualId} /> */}

        <DialogManualUpdateEdit
          typeId={manualId}
          updateType={1}
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
