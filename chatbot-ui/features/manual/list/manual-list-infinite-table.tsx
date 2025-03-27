'use client';

import { useState, useEffect } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { manualListColumn } from './manual-list-column';
import { ManualButtons } from './manual-buttons';
import { Manuals } from '@/services/admin-manual/admin-manual.type';
import { SearchOptionType } from './manual-list-container';
import InfiniteScrollTableSearch from '@/components/table/infinite-scroll-table-search';
import { useManualList } from '@/components/hooks/infinite-scroll/use-search-list';
import ErrorComponent from '@/components/common/error-component';

interface ManualListProps {
  searchOption: SearchOptionType;
  startDate?: string;
  endDate?: string;
}

export default function ManualListInfiniteTable({
  searchOption,
  startDate,
  endDate,
}: ManualListProps) {
  const [isInit, setIsInit] = useState(true);

  const {
    data: manualListData,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isError,
    error,
  } = useManualList({
    startDate,
    endDate,
    searchOption,
  });

  // state;
  const [flatData, setFlatData] = useState<Manuals[]>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: flatData,
    columns: manualListColumn,

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
    .rows.map((row) => row.original.id);

  useEffect(() => {
    const setTableData = () => {
      if (isSuccess && manualListData) {
        const newFlatData = manualListData.pages.flat();
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
  }, [manualListData, isSuccess]);

  return (
    <>
      <article className='flex flex-col space-y-5'>
        <div className='w-full flex justify-end'>
          <ManualButtons
            selectedRowID={selectedRowID}
            refetchFn={refetch}
            setRowSelection={setRowSelection}
          />
        </div>
        {isError && <ErrorComponent error={error.message} />}
        {!isError && (
          <InfiniteScrollTableSearch
            table={table}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            title='메뉴얼 리스트'
            isSuccess={isSuccess}
            isLoading={isLoading}
          />
        )}
      </article>
    </>
  );
}
