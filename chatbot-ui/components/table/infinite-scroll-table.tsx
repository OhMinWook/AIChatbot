'use client';

import { useState, useEffect } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import CustomTable from '@/components/table/custom-table';
import { useInView } from 'react-intersection-observer';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import ErrorComponent from '../common/error-component';

interface InfiniteScrollTableProps<T> {
  queryResult: UseInfiniteQueryResult<InfiniteData<T[]>, Error>;
  columns: ColumnDef<T>[];
  title?: string;
}

export default function InfiniteScrollTable<T>({
  queryResult,
  columns,
  title,
}: InfiniteScrollTableProps<T>) {
  const [isInit, setIsInit] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const { data, isSuccess, fetchNextPage, isLoading, isError, error } =
    queryResult;

  //table state
  const [flatData, setFlatData] = useState<T[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: flatData,
    columns,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    const setTableData = () => {
      if (isSuccess && data) {
        const newFlatData = data.pages.flat();
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
  }, [data, isSuccess]);

  useEffect(() => {
    if (inView) fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <section className='w-full flex flex-col space-y-5'>
      <div className='flex items-center justify-between'>
        <h6 className='text-[16px] font-semibold md:font-bold whitespace-nowrap'>
          {title}
        </h6>
      </div>
      {isError && <ErrorComponent error={error.message} />}
      {!isError && (
        <CustomTable
          table={table}
          isSuccess={isSuccess}
          forwardRef={ref}
          height='max-h-[80rem]'
          isLoading={isLoading}
        />
      )}
    </section>
  );
}
