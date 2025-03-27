'use client';

import { extractManualId } from '@/lib/extract-id';
import DialogComponent from '@/components/ui/dialog/dialog';
import DeleteUserAlert from '@/features/manager/list/alert/manager-list-alert';
import { Dispatch, SetStateAction } from 'react';
import DialogNormalUserModifyContent from '@/components/dialog/normal-user/normal-user-form';
import { normalUserCreateformSchema } from '@/const/zod/normal-user-form.zod';
import { deleteNormalUserAction } from '@/actions/user-list-action';

interface UserButtonsProps {
  selectedRowID: any;
  refetchFn: () => void;
  setRowSelection: Dispatch<SetStateAction<{}>>;
}

export const UserButtons = ({
  selectedRowID,
  refetchFn,
  setRowSelection,
}: UserButtonsProps) => {
  const handleDeleteUser = async () => {
    const idString = extractManualId(selectedRowID);
    const response = await deleteNormalUserAction(idString);

    if (response.error) {
      console.error('삭제 요청 실패:', response.error);
      return;
    }

    refetchFn();
    setRowSelection({});
  };

  const isDeleteDisabled = selectedRowID.length === 0;

  return (
    <div className='w-full mt-10 flex justify-end items-center space-x-5'>
      <DialogComponent
        dialogContent={{
          className: 'md:max-w-[676px] md:max-h-[650px] max-h-[600px]',
        }}
        title='사용자 등록'
        content={({ onClose }) => (
          <DialogNormalUserModifyContent
            userId={0}
            closeParentDialog={onClose}
            formSchema={normalUserCreateformSchema}
            isRegister={true}
          />
        )}
        triggerButton={{
          variant: 'enter3',
          icon: 'plus',
          text: '등록',
          className:
            'text-2xl flex justify-center items-center p-3 space-x-3 min-w-32 md:min-w-44 h-16',
        }}
      />

      <DeleteUserAlert
        title='경고'
        description={`정말 ${selectedRowID.length}개의 ID를 삭제하시겠습니까?`}
        cancelButton={{
          text: '취소',
          className:
            'text-2xl h-10 border-1 border-slate-300 px-10 hover:bg-slate-200',
        }}
        continueButton={{
          text: '확인',
          className:
            'text-2xl px-10 h-10 bg-customColor-primary1 border-1 text-white hover:bg-customColor-primary2 hover:text-white',
        }}
        triggerButton={{
          variant: 'delete1',
          icon: 'minus',
          text: '삭제',
          className:
            'text-2xl flex h-10 justify-center border-1 border-slate-300 items-center p-3 space-x-1 md:space-x-3 min-w-32 md:min-w-44 h-16',
          disabled: isDeleteDisabled,
        }}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};
