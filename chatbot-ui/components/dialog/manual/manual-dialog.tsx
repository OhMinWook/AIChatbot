'use client';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import type { VariantType, IconType } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog/_dialog.config';
import { useEscapeHandlerStore } from '@/store/use-escape-handler-store';

interface DialogAdminProps {
  content: (props: { onClose: () => void }) => ReactNode;
  title: string;
  triggerButton: {
    variant: VariantType;
    icon?: IconType;
    text: string;
    className?: string;
  };
  dialogContent?: {
    className?: string;
  };
  onSuccess?: (open: boolean) => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export default function ManualDialogComponent({
  content,
  title,
  triggerButton,
  onSuccess,
  dialogContent,
  isOpen = false,
  setIsOpen = () => {},
}: DialogAdminProps) {
  const { onEscapeKeyDown } = useEscapeHandlerStore();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div>
        <DialogTrigger asChild>
          <Button
            variant={triggerButton.variant}
            icon={triggerButton.icon}
            className={triggerButton.className}
            onClick={handleOpen}
          >
            {triggerButton.text}
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        className={dialogContent?.className}
        onEscapeKeyDown={onEscapeKeyDown || handleClose}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className='hidden'>{title}</DialogDescription>
        </DialogHeader>
        {content({ onClose: handleClose })}
      </DialogContent>
    </Dialog>
  );
}
