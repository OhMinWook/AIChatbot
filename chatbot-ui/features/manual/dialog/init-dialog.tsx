'use client';

import DialogManualUpdateEdit from '@/components/dialog/manual/manual-update-edit';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog/_dialog.config';
import { useSetIdStore } from '@/store/useSetIdStore';
import { useState } from 'react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useEscapeHandlerStore } from '@/store/use-escape-handler-store';

interface InitDialogProps {}

export default function InitDialog({}: InitDialogProps) {
  const { onEscapeKeyDown } = useEscapeHandlerStore();
  const { setId, clearState } = useSetIdStore();
  const [isOpen, setIsOpen] = useState(setId !== null);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        clearState();
        setIsOpen(open);
      }}
    >
      <DialogContent
        className='max-w-[1290px] md:max-h-[800px] max-h-[600px]'
        onEscapeKeyDown={onEscapeKeyDown || handleClose}
      >
        <DialogHeader>
          <DialogTitle>메뉴얼 수정</DialogTitle>
          <DialogDescription className='hidden'>메뉴얼 수정</DialogDescription>
        </DialogHeader>
        <DialogManualUpdateEdit
          typeId={Number(setId)}
          updateType={1}
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
