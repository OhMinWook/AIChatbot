import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { endOfDay, format, parse } from 'date-fns';
import DatePicker from '@/components/date-picker/date-picker';
import DateFilterTab from '@/components/date-picker/date-filter-tab';
import { ALL_DATE } from '@/const/date-const';
import { SearchButton } from '@/components/table/search-button';

interface UsageDatePickerProps {
  currentTab: string;
  currentFilter: string;
  isLoading: boolean;
}

export default function UsageDatePicker({
  currentTab,
  currentFilter,
  isLoading,
}: UsageDatePickerProps) {
  const today = new Date();
  const formattedToday = format(today, 'yyyyMMdd');
  const formattedAllDay = format(ALL_DATE, 'yyyyMMdd');
  const [startDate, setStartDate] = useState<Date>(ALL_DATE);
  const [endDate, setEndDate] = useState<Date>(endOfDay(today));
  const [activeFilter, setActiveFilter] = useState<string>('');

  // util
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const setInitParams = () => {
      const startDateParam = searchParams.get('startDate');
      const endDateParam = searchParams.get('endDate');

      const parsedStartDate = parse(startDateParam!, 'yyyyMMdd', new Date());
      const parsedEndDate = parse(endDateParam!, 'yyyyMMdd', new Date());
      setStartDate(parsedStartDate);
      setEndDate(parsedEndDate);
    };

    setInitParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, currentFilter, router, searchParams]);

  const handleSearchClick = () => {
    const startDateParam = format(startDate, 'yyyyMMdd');
    const endDateParam = format(endDate, 'yyyyMMdd');

    router.push(
      `/admin/usage/user/${currentTab}/${currentFilter}?startDate=${startDateParam}&endDate=${endDateParam}`,
    );
  };

  const resetHandler = () => {
    setStartDate(ALL_DATE);
    setEndDate(today);
    setActiveFilter('');

    router.push(
      `/admin/usage/user/${currentTab}/${currentFilter}?startDate=${formattedAllDay}&endDate=${formattedToday}`,
    );
  };

  return (
    <>
      <article className='p-[16px] border border-customColor-bg2 bg-customColor-bg0 rounded flex flex-col justify-between mb-10 overflow-x-auto'>
        <section className='flex items-center justify-between mb-6'>
          <fieldset className='w-full flex items-center justify-between flex-wrap-reverse gap-5'>
            <div className='w-full flex justify-between items-center gap-5 2xl:w-auto'>
              <h4 className='text-[12px] font-semibold md:text-[16px] whitespace-nowrap'>
                리포트 일자
              </h4>
              <div className='flex items-center gap-2'>
                <DatePicker
                  date={startDate}
                  setDate={setStartDate}
                  afterDisabled={endDate}
                  setActiveFilter={setActiveFilter}
                />
                <p className='text-[16px] font-semibold'> ~ </p>
                <DatePicker
                  date={endDate}
                  setDate={setEndDate}
                  beforeDisabled={startDate}
                  setActiveFilter={setActiveFilter}
                />
              </div>
            </div>

            <div className='w-full flex justify-end 2xl:w-auto'>
              <DateFilterTab
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            </div>
          </fieldset>
        </section>
        <section className='w-full flex justify-center items-center space-x-3'>
          <SearchButton handleClick={handleSearchClick} isLoading={isLoading} />
          <Button
            variant={'delete1'}
            onClick={resetHandler}
            className='min-w-[76px] py-[7px] text-[14px] md:min-w-[127px] md:py-[12px] md:text-[16px] rounded-[2px]'
          >
            초기화
          </Button>
        </section>
      </article>
    </>
  );
}
