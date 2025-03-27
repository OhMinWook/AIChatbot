import { useEffect, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { answerListColumn, AnswerListData } from './answer-list-column';
import { AnswerButtons } from '@/features/answer/manage/answer-buttons';
import { SearchOptionType } from './answer-list-container';
import InfiniteScrollTableSearch from '@/components/table/infinite-scroll-table-search';
import { useAnswerList } from '@/components/hooks/infinite-scroll/use-search-list';
import ErrorComponent from '@/components/common/error-component';

interface AnswerListProps {
  searchOption: SearchOptionType;
  startDate?: string;
  endDate?: string;
}

export default function AnswerListInfiniteTable({
  searchOption,
  startDate,
  endDate,
}: AnswerListProps) {
  const [isInit, setIsInit] = useState(true);

  const {
    data: answerListData,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isError,
    error,
  } = useAnswerList({
    startDate,
    endDate,
    searchOption,
  });

  // state;
  const [flatData, setFlatData] = useState<AnswerListData[]>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: flatData,
    columns: answerListColumn,

    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    state: {
      rowSelection,
    },
  });

  const selectedRowID = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.report_id);

  useEffect(() => {
    const setTableData = () => {
      if (isSuccess && answerListData) {
        const newFlatData = answerListData.pages.flat();
        setFlatData(newFlatData);
      }
    };

    if (isInit) {
      setIsInit(false);
    } else {
      setTableData();
    }

    setTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerListData, isSuccess]);

  return (
    <>
      <AnswerButtons
        selectedRowID={selectedRowID}
        refetchFn={refetch}
        setRowSelection={setRowSelection}
      />
      <article className='flex flex-col space-y-5'>
        {isError && <ErrorComponent error={error.message} />}
        {!isError && (
          <InfiniteScrollTableSearch
            table={table}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            title='불만족 답변 리스트'
            isSuccess={isSuccess}
            isLoading={isLoading}
          />
        )}
      </article>
    </>
  );
}
