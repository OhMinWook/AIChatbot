import { ALL_DATE } from '@/const/date-const';
import InitDialog from '@/features/manual/dialog/init-dialog';
import ManualListContainer from '@/features/manual/list/manual-list-container';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

interface SearchParams {
  [key: string]: string | undefined;
}

interface ManualListPageParams {
  searchParams: SearchParams;
}

export default async function ManualListPage({
  searchParams,
}: ManualListPageParams) {
  if (Object.keys(searchParams).length === 0) {
    const today = new Date();
    const formattedToday = format(today, 'yyyyMMdd');
    const formattedAllDay = format(ALL_DATE, 'yyyyMMdd');

    redirect(
      `/admin/manual/list?startDate=${formattedAllDay}&endDate=${formattedToday}`,
    );
  }

  return (
    <section className='w-full h-auto flex flex-col'>
      <article className='mt-20'>
        <ManualListContainer
          startDate={searchParams.startDate}
          endDate={searchParams.endDate}
        />
        <InitDialog />
      </article>
    </section>
  );
}
