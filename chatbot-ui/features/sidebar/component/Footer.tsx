'use client';

import { Button } from '@/components/ui/button';
import { handleSignOut } from '@/actions/logout';
import { useQueryClient } from '@tanstack/react-query';
import DialogCellCommon from '@/components/dialog/common/dialog-cell-common';
import DialogAdminModifyContent from '@/components/dialog/admin/admin-modify';
import { Session } from 'next-auth';

interface FooterProps {
  userName: string | undefined;
  session: Session | null;
}
export function Footer({ userName, session }: FooterProps) {
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await queryClient.removeQueries();
    await handleSignOut(false);
  };

  const currentUserName = userName + ' 님'
  const userId = session?.user.id

  return (
    <div className='w-full h-[60px] flex items-center justify-between px-5 border-t absolute bottom-0 '>
      {/* <p className='text-[16px]'>{userName} 님</p> */}
      <DialogCellCommon
        keyId={userId!}
        textValue={currentUserName!}
        dialogContent={{
          className: 'md:max-w-[676px] md:max-h-[780px] max-h-[600px]',
        }}
        title='관리자 수정'
        content={({ keyId, closeParentDialog }) => (
          <DialogAdminModifyContent
            adminId={Number(keyId)}
            closeParentDialog={closeParentDialog}
          />
        )}
      />

      <form action={handleLogout}>
        <Button
          type='submit'
          variant='logout'
          icon='logout'
          className='text-[16px]'
        >
          로그아웃
        </Button>
      </form>
    </div>
  );
}
