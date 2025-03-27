'use client';

import UsageDatePicker from '@/features/usage/embedding/usage-date-picker';
import UsageTable from '@/features/usage/embedding/table/usage-table';
import UsageFilter from '@/features/usage/embedding/usage-filter';
import UsageTabs from '@/features/usage/embedding/usage-tabs';
import { EmbeddingFilter, Tabs } from '@/const/tab-filter';
import { useState } from 'react';
import EmbeddingUsageInfiniteScrollTable from './embedding-usage-infinite-scroll-table';

interface UsageProps {
  currentTab: Tabs;
  currentFilter: EmbeddingFilter;
  startDate?: string;
  endDate?: string;
}

export default function EmbeddingUsageContainer({
  currentTab,
  currentFilter,
  startDate,
  endDate,
}: UsageProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section className='w-full h-full flex flex-col space-y-5'>
      <>
        <UsageDatePicker
          currentTab={currentTab}
          currentFilter={currentFilter}
          isLoading={isLoading}
        />
        <UsageTabs
          currentTab={currentTab}
          currentFilter={currentFilter}
          page={'embedding'}
        />
        <UsageFilter
          currentTab={currentTab}
          currentFilter={currentFilter}
          page={'embedding'}
        />
        <UsageTable
          currentTab={currentTab}
          currentFilter={currentFilter}
          startDate={startDate}
          endDate={endDate}
        />
        <EmbeddingUsageInfiniteScrollTable
          startDate={startDate}
          endDate={endDate}
        />
      </>
    </section>
  );
}
