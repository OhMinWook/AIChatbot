import { ALL_DATE } from '@/const/date-const';
import AnswerManageContainer from '@/features/answer/manage/answer-list-container';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

interface SearchParams {
  [key: string]: string | undefined;
}

interface AnswerListPageParams {
  searchParams: SearchParams;
}

export default async function AnswerManagePage({
  searchParams,
}: AnswerListPageParams) {
  if (Object.keys(searchParams).length === 0) {
    const today = new Date();
    const formattedToday = format(today, 'yyyyMMdd');
    const formattedAllDay = format(ALL_DATE, 'yyyyMMdd');

    redirect(
      `/admin/answer/manage?startDate=${formattedAllDay}&endDate=${formattedToday}`,
    );
  }

  return (
    <section className='w-full h-auto flex flex-col'>
      <article className='mt-20'>
        <AnswerManageContainer
          startDate={searchParams.startDate}
          endDate={searchParams.endDate}
        />
      </article>
    </section>
  );
}
