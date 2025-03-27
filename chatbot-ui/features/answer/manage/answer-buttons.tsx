import DeleteUserAlert from '@/features/manager/list/alert/manager-list-alert';
import { deleteReportAction } from '@/actions/admin-answer';
import { extractManualId } from '@/lib/extract-id';
import { Dispatch, SetStateAction } from 'react';

interface AnswerButtonsProps {
  selectedRowID: any;
  refetchFn: () => void;
  setRowSelection: Dispatch<SetStateAction<{}>>;
}

export const AnswerButtons = ({
  selectedRowID,
  refetchFn,
  setRowSelection,
}: AnswerButtonsProps) => {
  const handleDeleteReport = async () => {
    const idString = extractManualId(selectedRowID);

    const response = await deleteReportAction(idString);

    if (response.error) {
      console.error('삭제 요청 실패:', response.error);
      return;
    }

    refetchFn();
    setRowSelection({});
  };

  const isDeleteDisabled = selectedRowID.length === 0;

  return (
    <article className='w-full flex justify-end items-center space-x-5 mb-5'>
      <DeleteUserAlert
        title='경고'
        description={`정말 ${selectedRowID.length}개의 ID를 삭제하시겠습니까?`}
        cancelButton={{ text: '취소', className: 'text-xl px-10' }}
        continueButton={{
          text: '확인',
          className:
            'text-xl px-10 bg-customColor-primary1 text-white hover:bg-customColor-primary2 hover:text-white',
        }}
        triggerButton={{
          variant: 'delete1',
          icon: 'minus',
          text: '삭제',
          className:
            'text-2xl flex justify-center items-center p-3 space-x-3 w-44 h-16',
          disabled: isDeleteDisabled,
        }}
        onConfirm={handleDeleteReport}
      />
    </article>
  );
};
