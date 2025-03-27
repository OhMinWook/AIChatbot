import { Button, VariantType } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog/_alert-dialog.config';

interface AlertDialogProps {
  title?: string;
  description?: string;
  cancelButton: {
    variant?: VariantType;
    className?: string;
    text: string;
  };
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess?: any;
}

export default function ManualAlert({
  title,
  description,
  cancelButton,
  isOpen,
  setIsOpen,
  onSuccess,
}: AlertDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className=''>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className='text-3xl py-10 text-center'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* 취소 버튼 */}
          <AlertDialogCancel
            variant={cancelButton.variant}
            className='text-2xl px-12 py-3 w-40 flex justify-center items-center'
            onClick={onSuccess}
          >
            {cancelButton.text || '취소'}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
