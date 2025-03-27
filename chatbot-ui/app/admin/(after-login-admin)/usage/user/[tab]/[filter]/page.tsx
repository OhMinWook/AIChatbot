import {
  ALLOWED_FILTERS,
  ALLOWED_TABS,
  Filter,
  Tabs,
} from '@/const/tab-filter';
import { notFound, redirect } from 'next/navigation';
import UserUsageContainer from '@/features/usage/user/usage-container';
import { format } from 'date-fns';
import { ALL_DATE } from '@/const/date-const';

interface SearchParams {
  [key: string]: string | undefined;
}

interface UsagePageParams {
  params: {
    tab: Tabs;
    filter: Filter;
  };
  searchParams: SearchParams;
}

export default async function UsagePage({
  params,
  searchParams,
}: UsagePageParams) {
  const { tab: currentTab, filter: currentFilter } = params;

  if (
    !ALLOWED_TABS.includes(currentTab) ||
    !ALLOWED_FILTERS.includes(currentFilter)
  ) {
    notFound();
  }

  if (Object.keys(searchParams).length === 0) {
    const today = new Date();
    const formattedToday = format(today, 'yyyyMMdd');
    const formattedAllDay = format(ALL_DATE, 'yyyyMMdd');

    redirect(
      `/admin/usage/user/all/all?startDate=${formattedAllDay}&endDate=${formattedToday}`,
    );
  }

  return (
    <section className='w-full h-auto flex flex-col'>
      <article className='mt-20'>
        <UserUsageContainer
          currentTab={currentTab}
          currentFilter={currentFilter}
          startDate={searchParams.startDate}
          endDate={searchParams.endDate}
        />
      </article>
    </section>
  );
}
