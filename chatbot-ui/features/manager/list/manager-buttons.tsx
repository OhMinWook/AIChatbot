'use client';

import { deleteAdminUserAction } from '@/actions/admin-list-action';
import { extractManualId } from '@/lib/extract-id';
import DialogComponent from '@/components/ui/dialog/dialog';
import DialogAdminRegister from '@/components/dialog/admin/admin-register';
import DeleteUserAlert from './alert/manager-list-alert';
import { Dispatch, SetStateAction, useState } from 'react';

interface ManagerButtonsProps {
  selectedRowID: any;
  refetchFn: () => void;
  setRowSelection: Dispatch<SetStateAction<{}>>;
}

export const ManagerButtons = ({
  selectedRowID,
  refetchFn,
  setRowSelection,
}: ManagerButtonsProps) => {
  const handleDeleteUser = async () => {
    const idString = extractManualId(selectedRowID);
    const response = await deleteAdminUserAction(idString);

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
          className: 'md:max-w-[676px] md:max-h-[780px] max-h-[600px]',
        }}
        title='관리자 등록'
        content={({ onClose }) => (
          <DialogAdminRegister onClose={onClose} refetchFn={refetchFn} />
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
