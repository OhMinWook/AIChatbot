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
}

export default function ModifyUserAlert({
  title,
  description,
  cancelButton,
  isOpen,
  setIsOpen,
}: AlertDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {/* 트리거 버튼 */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-3xl text-customColor-primary2'>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className='text-2xl py-8'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* 취소 버튼 */}
          <AlertDialogCancel asChild>
            <Button
              variant={cancelButton.variant}
              className={cancelButton.className}
            >
              {cancelButton.text || '취소'}
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
