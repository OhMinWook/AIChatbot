'use client';

import { extractManualId } from '@/lib/extract-id';
import DeleteUserAlert from '@/features/manager/list/alert/manager-list-alert';
import ManualListAdd from './manual-list-add';
import { deleteAdminManualAction } from '@/actions/admin-manual-action';
import { Dispatch, SetStateAction } from 'react';

interface ManagerButtonsProps {
  selectedRowID: number[];
  refetchFn: () => void;
  setRowSelection: Dispatch<SetStateAction<{}>>;
}

export const ManualButtons = ({
  selectedRowID,
  refetchFn,
  setRowSelection,
}: ManagerButtonsProps) => {
  const handleDeleteManual = async () => {
    const idString = extractManualId(selectedRowID);

    const response = await deleteAdminManualAction(idString);

    if (response.error) {
      return;
    }

    refetchFn();
    setRowSelection({});
  };

  const isDeleteDisabled = selectedRowID.length === 0;

  return (
    <div className='w-full mt-10 flex justify-end items-center space-x-3'>
      <ManualListAdd refetchFn={refetchFn} />
      <DeleteUserAlert
        title='경고'
        description={`정말 ${selectedRowID.length}개의 메뉴얼을 삭제하시겠습니까?`}
        cancelButton={{
          text: '취소',
          className: 'text-xl px-5 py-3 hover:bg-customColor-gray1',
        }}
        continueButton={{
          text: '확인',
          className:
            'text-xl px-5 py-3 bg-customColor-primary1 text-white hover:bg-customColor-primary2 hover:text-white',
        }}
        triggerButton={{
          variant: 'delete1',
          icon: 'minus',
          text: '삭제',
          className:
            'text-2xl flex justify-center items-center p-3 space-x-3 w-44 h-16',
          disabled: isDeleteDisabled,
        }}
        onConfirm={handleDeleteManual}
      />
    </div>
  );
};
