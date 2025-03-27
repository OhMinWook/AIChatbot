'use client';

import { useState, useEffect } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import InfiniteScrollTableSearch from '@/components/table/infinite-scroll-table-search';
import { useManagerList } from '@/components/hooks/infinite-scroll/use-search-list';
import { AdminListData } from '@/services/admin-user/admin-user.type';
import { managerListColumn } from './manager-list-column';
import { ManagerButtons } from './manager-buttons';
import ErrorComponent from '@/components/common/error-component';

export default function ManagerInfiniteTable() {
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
  } = useManagerList({});

  // state;
  const [flatData, setFlatData] = useState<AdminListData[]>([]);

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: flatData,
    columns: managerListColumn,

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
          <ManagerButtons
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
            title='관리자 리스트'
            isSuccess={isSuccess}
            isLoading={isLoading}
          />
        )}
      </article>
    </>
  );
}
