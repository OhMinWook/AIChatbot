'use client';

import { useEffect, useState } from 'react';
import TableSelectServer from '@/components/table/table-select-server';
import PaginationServer from '@/components/table/pagination-server';
import { getAdminListUserAction } from '@/actions/admin-list-action';
import { AllAdminUserResponse } from '@/services/admin-user/admin-user.type';
import { ManagerButtons } from './manager-buttons';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { managerListColumn } from './manager-list-column';
import CustomTable from '@/components/table/custom-table';

interface ManagerListBoxProps {
  initData: AllAdminUserResponse;
}

export default function ManagerListBox({ initData }: ManagerListBoxProps) {
  // const, init
  const INIT_PAGE_SIZE = 50;
  const TOTAL_PAGE_SIZE = initData.total_pages;
  const TOTAL_COUNT_SIZE = initData.total_count;
  const initTableData = initData.response;

  // state
  const [data, setData] = useState(initTableData);
  const [pageSize, setPageSize] = useState(INIT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(TOTAL_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);

  //table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // table object
  const table = useReactTable({
    data,
    columns: managerListColumn,

    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    state: {
      sorting,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },

    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  const selectedRowID = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  const setTableData = async () => {
    try {
      // const adminListData = await getAdminListUserAction(pageIndex, pageSize);
      // const tableData = adminListData.data.response;
      // const totalSize = adminListData.data.total_pages;
      // setData(tableData);
      // setTotalPages(totalSize);
      // setRowSelection({});
    } catch (error) {
      console.error('데이터 가져오기 에러:', error);
    }
  };

  useEffect(() => {
    setTableData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex]);

  return (
    <section className='flex flex-col space-y-5'>
      <ManagerButtons
        selectedRowID={selectedRowID}
        refetchFn={setTableData}
        setRowSelection={setRowSelection}
      />
      <div className='w-full flex justify-between items-center'>
        <p className='text-2xl font-semibold'>
          전체 관리자 수 : {TOTAL_COUNT_SIZE}
        </p>
        <TableSelectServer
          setPageSize={setPageSize}
          setPageIndex={setPageIndex}
          initOption={INIT_PAGE_SIZE}
          options={[1, 2, 10, 30, 50, 100]}
        />
      </div>
      <CustomTable table={table} />
      <PaginationServer
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        totalPages={totalPages}
      />
    </section>
  );
}
