'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog/_dialog.config';
import { useState } from 'react';

interface DialogCellProps {
  keyId: number | string;
  textValue: string;
  title: string;
  dialogContent?: {
    className?: string;
  };
  content: (props: {
    keyId: number | string;
    closeParentDialog: () => void;
  }) => JSX.Element;
}

export default function DialogCellCommon({
  keyId,
  textValue,
  title,
  dialogContent,
  content,
}: DialogCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeParentDialog = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div>
        <DialogTrigger asChild>
          <p className='cursor-pointer hover:underline text-[13px]'>{textValue}</p>
        </DialogTrigger>
      </div>

      <DialogContent className={dialogContent?.className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className='hidden'>{title}</DialogDescription>
        </DialogHeader>
        {content({ keyId, closeParentDialog })}
      </DialogContent>
    </Dialog>
  );
}
