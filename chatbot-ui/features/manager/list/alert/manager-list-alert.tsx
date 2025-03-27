import { Button, IconType, VariantType } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog/_alert-dialog.config';

interface AlertDialogProps {
  // content: React.ReactNode;
  title?: string;
  description?: string;
  cancelButton: {
    variant?: VariantType;
    className?: string;
    text: string;
  };
  continueButton: {
    variant?: VariantType;
    className?: string;
    text: string;
  };
  triggerButton: {
    variant?: VariantType;
    className?: string;
    icon: IconType;
    text: string;
    disabled?: boolean;
  };
  onConfirm: () => void;
}

export default function DeleteUserAlert({
  title,
  description,
  cancelButton,
  continueButton,
  triggerButton,
  onConfirm,
}: AlertDialogProps) {
  return (
    <AlertDialog>
      {/* 트리거 버튼 */}
      <AlertDialogTrigger asChild>
        <Button
          variant={triggerButton.variant}
          icon={triggerButton.icon}
          className={triggerButton.className}
          disabled={triggerButton.disabled}
        >
          {triggerButton?.text}
        </Button>
      </AlertDialogTrigger>

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
          {/* 확인 버튼 */}
          <AlertDialogAction asChild>
            <Button
              variant={continueButton.variant}
              className={continueButton.className}
              onClick={onConfirm}
            >
              {continueButton.text || '확인'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
