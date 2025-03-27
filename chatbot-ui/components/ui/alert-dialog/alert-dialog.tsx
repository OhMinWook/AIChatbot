import { Button, VariantType } from '@/components/ui/button';
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
    variant: VariantType;
    text: string;
  };
  continueButton: {
    variant: VariantType;
    text?: string;
  };
  triggerButton: {
    variant: VariantType;
    text?: string;
  };
  onConfirm: () => void;
}

export default function AlertDialogComponent({
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
        <Button variant={triggerButton.variant}>{triggerButton?.text}</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* 취소 버튼 */}
          <AlertDialogCancel variant={cancelButton.variant}>
            {cancelButton.text || '취소'}
          </AlertDialogCancel>
          {/* 확인 버튼 */}
          <AlertDialogAction
            onClick={onConfirm}
            variant={continueButton.variant}
          >
            {continueButton.text || '확인'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
