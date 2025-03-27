import {
  ALLOWED_EMBEDDING_FILTERS,
  ALLOWED_TABS,
  EmbeddingFilter,
  Tabs,
} from '@/const/tab-filter';
import { notFound, redirect } from 'next/navigation';
import EmbeddingUsageContainer from '@/features/usage/embedding/usage-container';
import { format } from 'date-fns';
import { ALL_DATE } from '@/const/date-const';

interface SearchParams {
  [key: string]: string | undefined;
}

interface UsagePageParams {
  params: {
    tab: Tabs;
    filter: EmbeddingFilter;
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
    !ALLOWED_EMBEDDING_FILTERS.includes(currentFilter)
  ) {
    notFound();
  }

  if (Object.keys(searchParams).length === 0) {
    const today = new Date();
    const formattedToday = format(today, 'yyyyMMdd');
    const formattedAllDay = format(ALL_DATE, 'yyyyMMdd');

    redirect(
      `/admin/usage/embedding/all/all?startDate=${formattedAllDay}&endDate=${formattedToday}`,
    );
  }

  return (
    <article className='w-full h-auto flex flex-col'>
      <section className='mt-20'>
        <EmbeddingUsageContainer
          currentTab={currentTab}
          currentFilter={currentFilter}
          startDate={searchParams.startDate}
          endDate={searchParams.endDate}
        />
      </section>
    </article>
  );
}
