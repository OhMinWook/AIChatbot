'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog/_dialog.config';
import { Button } from '@/components/ui/button';
import UserReport from '@/features/answer/dialog/user-report-dialog';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useSetIdStore } from '@/store/useSetIdStore';
import { ALL_DATE } from '@/const/date-const';
import useReportQuery from '@/components/hooks/dialog-list/use-admin-answer';

interface DialogUserReportProps {
  reportId: number;
  val: string | number;
  dialogWidth?: string;
}

interface userReportProps {
  reportId: number;
  dialogWidth?: string;
  setIsOpen: (isOpen: boolean) => void;
}

const UserReportData = ({
  reportId,
  dialogWidth,
  setIsOpen,
}: userReportProps) => {
  const {
    data: reportData,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useReportQuery({ reportId });

  const { updateSetId } = useSetIdStore();

  const router = useRouter();
  const dataConfirmHandler = async (mId: number) => {
    const today = new Date();
    const formattedToday = format(today, 'yyyyMMdd');
    const formattedAllDay = format(ALL_DATE, 'yyyyMMdd');

    await updateSetId(mId);

    router.push(
      `/admin/manual/list?startDate=${formattedAllDay}&endDate=${formattedToday}`,
    );
  };

  return (
    <>
      {!isLoading && isError && (
        <DialogContent className='max-w-[40rem] max-h-[20rem]'>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription className='hidden'>Error</DialogDescription>
          </DialogHeader>

          <p className='text-center text-xl'>{error.message}</p>
        </DialogContent>
      )}

      {!isLoading && isSuccess && (
        <DialogContent className={dialogWidth}>
          <DialogHeader>
            <DialogTitle>사용자 리포트</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>User Report</DialogDescription>
          <UserReport reportData={reportData!} />
          <DialogFooter>
            <div className='flex justify-center'>
              <section className='flex justify-center md:w-[300px] w-96 gap-5 py-[16px]'>
                <Button
                  variant='enter2'
                  className='py-[13px]'
                  onClick={() => dataConfirmHandler(reportData!.manual_id)}
                  disabled={!reportData || reportData!.manual_id === null}
                >
                  해당 데이터 확인
                </Button>
                <Button
                  variant={'cancel1'}
                  className={'py-5'}
                  onClick={() => setIsOpen(false)}
                >
                  닫기
                </Button>
              </section>
            </div>
          </DialogFooter>
        </DialogContent>
      )}
    </>
  );
};

export default function DialogUserReport({
  reportId,
  val,
  dialogWidth,
}: DialogUserReportProps) {
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

      {isOpen && (
        <UserReportData
          reportId={reportId}
          dialogWidth={dialogWidth}
          setIsOpen={setIsOpen}
        />
      )}
    </Dialog>
  );
}
