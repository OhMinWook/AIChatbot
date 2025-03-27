'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import CustomTable from '@/components/table/custom-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import TableSelectServer from '@/components/table/table-select-server';
import PaginationServer from '@/components/table/pagination-server';
import { manualListColumn } from './manual-list-column';
import { getManualsAction } from '@/actions/admin-manual-list';
import { ManualButtons } from './manual-buttons';
import { convertDateOption, convertToUnixTime } from '@/lib/date-util';
import { format } from 'date-fns';
import { ALL_DATE } from '@/const/date-const';
import { ManualResponse } from '@/services/admin-manual/admin-manual.type';
import { SearchOptionType } from './manual-list-container';

interface ManualListProps {
  tableData: ManualResponse;
  searchOption: SearchOptionType;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  startDate?: string;
  endDate?: string;
}

export default function ManualListTable({
  tableData,
  searchOption,
  startDate,
  endDate,
  setIsLoading,
}: ManualListProps) {
  // const initTableData = tableData?.response || [];

  // const [isInit, setIsInit] = useState(true);

  // // state;
  // const [data, setData] = useState(initTableData);
  // const [pageSize, setPageSize] = useState(tableData.page_size);
  // const [totalPages, setTotalPages] = useState(tableData?.total_pages);
  // const [pageIndex, setPageIndex] = useState(tableData?.current_page_no);
  // const [rowSelection, setRowSelection] = useState({});

  // const table = useReactTable({
  //   data,
  //   columns: manualListColumn,

  //   onRowSelectionChange: setRowSelection,
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   state: {
  //     rowSelection,
  //     pagination: {
  //       pageIndex: 0,
  //       pageSize,
  //     },
  //   },

  //   initialState: {
  //     pagination: {
  //       pageIndex: 0,
  //       pageSize,
  //     },
  //   },
  // });

  // const selectedRowID = table
  //   .getSelectedRowModel()
  //   .rows.map((row) => row.original.id);

  // const setTableData = async () => {
  //   try {
  //     setIsLoading(true);

  //     const manualOption = {
  //       pageIndex,
  //       pageSize,
  //       startDate,
  //       endDate,
  //       searchOption,
  //     };

  //     const manualParams = convertDateOption(manualOption);

  //     const manualListData = await getManualsAction(manualParams);
  //     const tableData = manualListData.data.response;
  //     const totalPageSize = manualListData.data.total_pages;

  //     setData(tableData);
  //     setTotalPages(totalPageSize);
  //     setRowSelection({});
  //   } catch (error) {
  //     console.error('데이터 가져오기 에러:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (isInit) {
  //     setIsInit(false);
  //   } else {
  //     setTableData();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pageSize, pageIndex, startDate, endDate, searchOption]);

  return (
    <>
      {/* <article className='flex flex-col space-y-5'>
        <div className='w-full flex justify-end'>
          <ManualButtons
            selectedRowID={selectedRowID}
            refetchFn={setTableData}
          />
        </div>
        <div className='w-full flex justify-between items-center'>
          <p className='text-2xl font-semibold'>
            전체 리포트 수 : {tableData.total_count}
          </p>
          <TableSelectServer
            setPageSize={setPageSize}
            setPageIndex={setPageIndex}
            initOption={tableData.page_size}
            options={[1, 10, 30, 50, 100]}
          />
        </div>

        <CustomTable table={table} />

        <PaginationServer
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          totalPages={totalPages}
        />
      </article> */}
    </>
  );
}
