'use client';

import CustomTable from '@/components/table/custom-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { usageColumns } from './usage-column';
import { useUserSummaryQuery } from '@/components/hooks/summary/use-summary-query';
import ErrorComponent from '@/components/common/error-component';

interface Props {
  currentTab: string;
  currentFilter: string;
  startDate?: string;
  endDate?: string;
}

export default function UsageTable({
  currentTab,
  currentFilter,
  startDate,
  endDate,
}: Props) {
  const {
    data: summaryData,
    isLoading,
    isError,
    error,
  } = useUserSummaryQuery({
    currentTab,
    currentFilter,
    startDate,
    endDate,
  });

  // UsageData table
  const table = useReactTable({
    data: summaryData || [],
    columns: usageColumns,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <section className='flex flex-col space-y-5'>
        {isError && <ErrorComponent error={error.message} />}
        {!isError && (
          <CustomTable
            table={table}
            height='max-h-[30rem]'
            isLoading={isLoading}
          />
        )}
      </section>
    </>
  );
}
