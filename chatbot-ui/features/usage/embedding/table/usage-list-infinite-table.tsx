'use client';

import { useState, useEffect } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { usageListColumn } from '@/features/usage/embedding/table/usage-list-column';
import CustomTable from '@/components/table/custom-table';
import { useInView } from 'react-intersection-observer';
import { useEmbeddingUsageList } from '@/components/hooks/infinite-scroll/use-usage-list';

interface dataProps {
  startDate?: string;
  endDate?: string;
}

export default function UsageListInfiniteTable({
  startDate,
  endDate,
}: dataProps) {
  const [isInit, setIsInit] = useState(true);
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  //table state
  const { data, isSuccess, fetchNextPage } = useEmbeddingUsageList({
    startDate,
    endDate,
  });

  const [flatData, setFlatData] = useState<any>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: flatData,
    columns: usageListColumn,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    const setTableData = () => {
      if (isSuccess && data) {
        const newFlatData = data.pages.flatMap((page) => page);
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
          사용량 리스트
        </h6>
      </div>
      <CustomTable table={table} />
      <div ref={ref} className='opacity-0'>
        more
      </div>
    </section>
  );
}
