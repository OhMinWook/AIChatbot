'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { VariantType, IconType } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
}

export default function ChatBotDialog({
  content,
  title,
  triggerButton,
}: DialogAdminProps) {
  const [isOpen, setIsOpen] = useState(false);

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
      <DialogTitle className='sr-only'>{title}</DialogTitle>

      <DialogContent
        aria-describedby={'dialog-description' + title}
        className='max-w-[500px] max-h-[360px] flex justify-center items-center'
      >
        {content({ onClose: handleClose })}
      </DialogContent>
    </Dialog>
  );
}
