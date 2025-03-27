import { getChatImageAction } from '@/actions/chat-bot-action';
import { Skeleton } from '@/components/skeleton/delayed-skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog/_dialog.config';
import { useEffect, useState } from 'react';

interface BotChatArrayImageDialogProps {
  hashId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const BotChatArrayImageDialog = ({
  hashId,
  isOpen,
  onClose,
}: BotChatArrayImageDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isDialogOpen = isOpen ?? internalOpen;
  const handleClose = onClose ?? (() => setInternalOpen(false));

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const response = await getChatImageAction({ doc_id: hashId });
      setImageUrl(response.data);
      setIsLoading(false);
    };

    init();
  }, [hashId]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='md:max-w-[1200px] max-h-[600px] md:max-h-[800px] pb-10'>
        <DialogHeader>
          <DialogTitle>이미지 보기</DialogTitle>
        </DialogHeader>
        <div className='flex justify-center items-start'>
          {isLoading && (
            <Skeleton className='w-[300px] h-[400px] md:w-[1000px] md:h-[600px]' />
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt='image'
              className='max-w-[300px] max-h-[400px] md:max-w-[600px] md:max-h-[400px] lg:max-w-[900px] lg:max-h-[500px] xl:max-w-[1000px] xl:max-h-[600px] object-contain rounded-md'
            />
          )}
        </div>
        <DialogFooter className='absolute h-24 flex justify-end px-10 md:px-20 bottom-0 left-0 w-full'>
          <DialogClose asChild>
            <Button className='w-28 h-20 text-2xl border-1 hover:bg-slate-200'>
              닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { BotChatArrayImageDialog };
