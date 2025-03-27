'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { usageListColumn } from '@/features/usage/embedding/table/usage-list-column';
import CustomTable from '@/components/table/custom-table';
import TableSelectServer from '@/components/table/table-select-server';
import PaginationServer from '@/components/table/pagination-server';
import { getEmbeddingAction } from '@/actions/admin-usage';
import { convertDateOption } from '@/lib/date-util';
import { ApiResponse } from '@/services/fetchApi.type';
import { AdminUseHistoryResponse } from '@/services/admin-use/admin-use.type';

interface dataProps {
  usageData: ApiResponse<AdminUseHistoryResponse>;
  startDate?: string;
  endDate?: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function UsageListTable({
  usageData,
  startDate,
  endDate,
  setIsLoading,
}: dataProps) {
  // const INIT_PAGE_SIZE = 50;
  // const [isInit, setIsInit] = useState(true);

  // //table state
  // const [data, setData] = useState<any>(usageData.data.response);
  // const [pageSize, setPageSize] = useState<any>(INIT_PAGE_SIZE);
  // const [totalPages, setTotalPages] = useState<any>(usageData.data.total_pages);
  // const [pageIndex, setPageIndex] = useState(usageData.data.current_page_no);
  // const [sorting, setSorting] = useState<SortingState>([]);

  // const table = useReactTable({
  //   data: data,
  //   columns: usageListColumn,

  //   onSortingChange: setSorting,

  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   state: {
  //     sorting,

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

  // useEffect(() => {
  //   const setTableData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const embeddingUsageOption = {
  //         pageIndex,
  //         pageSize,
  //         startDate,
  //         endDate,
  //       };

  //       const embeddingUsageParams = convertDateOption(embeddingUsageOption);

  //       const usageListData = await getEmbeddingAction(embeddingUsageParams);

  //       const tableData = usageListData.data.response;
  //       const totalSize = usageListData.data.total_pages;

  //       setData(tableData);

  //       setTotalPages(totalSize);
  //     } catch (error) {
  //       console.error('데이터 가져오기 에러:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (isInit) {
  //     setIsInit(false);
  //   } else {
  //     setTableData();
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pageSize, pageIndex, startDate, endDate]);

  return (
    <>
      {/* <section className='w-full flex flex-col space-y-5'>
        <div className='flex items-center justify-between'>
          <h6 className='text-[16px] font-semibold md:font-bold whitespace-nowrap'>
            사용량 리스트
          </h6>
          <div className='w-full flex justify-end'>
            <TableSelectServer
              setPageSize={setPageSize}
              setPageIndex={setPageIndex}
              initOption={INIT_PAGE_SIZE}
              options={[1, 10, 30, 50, 100]}
            />
          </div>
        </div>
        <CustomTable table={table} />
        <PaginationServer
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          totalPages={totalPages}
        />
      </section> */}
    </>
  );
}
