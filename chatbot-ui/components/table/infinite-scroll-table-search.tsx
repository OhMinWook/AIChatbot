'use client';

import { useEffect } from 'react';
import { Table } from '@tanstack/react-table';
import CustomTable from '@/components/table/custom-table';
import { useInView } from 'react-intersection-observer';

interface InfiniteScrollTableProps<T> {
  table: Table<T>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  title?: string;
  isSuccess?: boolean;
  isLoading?: boolean;
}

export default function InfiniteScrollTableSearch<T>({
  table,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  title,
  isSuccess,
  isLoading,
}: InfiniteScrollTableProps<T>) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className='w-full flex flex-col space-y-5'>
      <div className='flex items-center justify-between'>
        <h6 className='text-[16px] font-semibold md:font-bold whitespace-nowrap'>
          {title}
        </h6>
      </div>

      <CustomTable
        table={table}
        isSuccess={isSuccess}
        forwardRef={ref}
        height='max-h-[80rem]'
        isFetching={isFetchingNextPage}
        isLoading={isLoading}
      />
    </section>
  );
}
