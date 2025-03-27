'use client';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
} from '@/components/ui/alert-dialog/_alert-dialog.config';
import { Button } from '@/components/ui/button';
import { handleSignOut } from '@/actions/logout';

interface LoginExistDialogProps {
  searchParams?: any;
  isNormal?: boolean;
}

export const LoginExistDialog = ({
  searchParams,
  isNormal = false,
}: LoginExistDialogProps) => {
  const isDuplicated = searchParams?.duplicated === 'true';
  const isCookieExpired = searchParams?.cookie === 'false';
  const isSessionExpired = searchParams?.session === 'false';
  const [isOpen, setIsOpen] = useState(
    isDuplicated || isCookieExpired || isSessionExpired,
  );

  const handleClick = async () => {
    await handleSignOut(isNormal);
    setIsOpen(false);
  };

  const getMessage = () => {
    if (isDuplicated) {
      return (
        <>
          <p className=''>다른 환경에서 로그인되어</p>
          <p>현재 사용중인 환경에서 로그아웃 되었습니다.</p>
        </>
      );
    }
    if (isCookieExpired) {
      return (
        <>
          <p className=''>세션 정보가 존재하지 않습니다.</p>
          <p>다시 로그인해 주세요.</p>
        </>
      );
    }
    if (isSessionExpired) {
      return (
        <>
          <p className=''>세션이 만료되었습니다.</p>
          <p>다시 로그인해 주세요.</p>
        </>
      );
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {isOpen && (
        <AlertDialogContent>
          <div className='flex flex-col justify-center items-center'>
            <div className='flex justify-start w-full px-2'>
              <h1 className='text-3xl text-customColor-primary1 font-semibold'>
                로그인
              </h1>
            </div>

            <div className='flex flex-col justify-center items-center text-2xl py-10'>
              {getMessage()}
            </div>

            <form action={handleClick} className='flex justify-end w-full px-8'>
              <Button
                type='submit'
                className='text-2xl border-1 px-5 py-3 bg-slate-50 hover:bg-slate-200'
              >
                확인
              </Button>
            </form>
          </div>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};
