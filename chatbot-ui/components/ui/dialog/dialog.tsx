'use client';
import { useState } from 'react';
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

interface DialogAdminProps {
  content: (props: { onClose: () => void }) => React.ReactNode;
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
  initOpen?: boolean;
}

export default function DialogComponent({
  content,
  title,
  dialogContent,
  triggerButton,
  initOpen,
}: DialogAdminProps) {
  const [isOpen, setIsOpen] = useState(initOpen);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

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

      <DialogContent className={dialogContent?.className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className='hidden'>{title}</DialogDescription>
        </DialogHeader>

        {content({ onClose: handleClose })}
      </DialogContent>
    </Dialog>
  );
}
