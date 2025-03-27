'use client';

import UsageDatePicker from '@/features/usage/user/usage-date-picker';
import UsageTable from '@/features/usage/user/table/usage-table';
import UsageFilter from '@/features/usage/user/usage-filter';
import UsageTabs from '@/features/usage/user/usage-tabs';
import { Filter, Tabs } from '@/const/tab-filter';
import { useState } from 'react';
import UserUsageInfiniteScrollTable from './user-usage-infinite-scroll-table';

interface UsageProps {
  currentTab: Tabs;
  currentFilter: Filter;
  startDate?: string;
  endDate?: string;
}

export default function UserUsageContainer({
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
          page={'user'}
        />
        <UsageFilter
          currentTab={currentTab}
          currentFilter={currentFilter}
          page={'user'}
        />
        <UsageTable
          currentTab={currentTab}
          currentFilter={currentFilter}
          startDate={startDate}
          endDate={endDate}
        />
        <UserUsageInfiniteScrollTable startDate={startDate} endDate={endDate} />
      </>
    </section>
  );
}
