'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog/_dialog.config';
import UserDetail from '@/features/usage/dialog/user-detail-dialog';
import useUsageQuery from '@/components/hooks/dialog-list/use-admin-usage';

interface DialogUserDetailProps {
  useId: number;
  val: string | number;
  dialogWidth?: string;
}

interface usageProps {
  useId: number;
  dialogWidth?: string;
}

const UsageData = ({ useId, dialogWidth }: usageProps) => {
  const {
    data: detailData,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useUsageQuery({ useId });

  return (
    <>
      {!isLoading && isError && (
        <DialogContent className='max-w-[40rem] max-h-[20rem]'>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>Error</DialogDescription>
          <p className='text-center text-xl'>{error.message}</p>
        </DialogContent>
      )}

      {!isLoading && isSuccess && (
        <DialogContent className={dialogWidth}>
          <DialogHeader>
            <DialogTitle>사용자 상세</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>User Detail</DialogDescription>
          <UserDetail detailData={detailData} />
        </DialogContent>
      )}
    </>
  );
};

export default function DialogUserDetail({
  useId,
  val,
  dialogWidth,
}: DialogUserDetailProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div>
        <DialogTrigger asChild>
          <p className='cursor-pointer whitespace-nowrap md:whitespace-normal hover:underline'>
            {val}
          </p>
        </DialogTrigger>
      </div>

      {isOpen && <UsageData useId={useId} dialogWidth={dialogWidth} />}
    </Dialog>
  );
}
