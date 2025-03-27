import DatePicker from '@/components/date-picker/date-picker';
import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { format, endOfDay, parse } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import DateFilterTab from '@/components/date-picker/date-filter-tab';
import AnswerListSearch from '@/features/answer/manage/answer-list-search';
import { ALL_DATE } from '@/const/date-const';
import { SearchOptionType } from './answer-list-container';
import { SearchButton } from '@/components/table/search-button';

interface AnswerListDatePickerProps {
  setSearchOption: Dispatch<SetStateAction<SearchOptionType>>;
  isLoading: boolean;
}

export default function AnswerListDatePicker({
  setSearchOption,
  isLoading,
}: AnswerListDatePickerProps) {
  // date 관리
  const today = new Date();
  const formattedToday = format(today, 'yyyyMMdd');
  const formattedAllDay = format(ALL_DATE, 'yyyyMMdd');
  const [startDate, setStartDate] = useState<Date>(ALL_DATE);
  const [endDate, setEndDate] = useState<Date>(endOfDay(today));
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [searchContent, setSearchContent] = useState('');

  // util
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchClick = () => {
    const startDateParam = format(startDate, 'yyyyMMdd');
    const endDateParam = format(endDate, 'yyyyMMdd');
    let option: SearchOptionType = {};

    if (searchContent !== '') {
      option.report_content = searchContent;
    }

    setSearchOption(option);
    router.push(
      `/admin/answer/manage?startDate=${startDateParam}&endDate=${endDateParam}`,
    );
  };

  const resetHandler = () => {
    let option: SearchOptionType = {};

    setStartDate(ALL_DATE);
    setEndDate(endOfDay(today));
    setActiveFilter('');
    setSearchContent('');
    setSearchOption(option);

    router.push(
      `/admin/answer/manage?startDate=${formattedAllDay}&endDate=${formattedToday}`,
    );
  };

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
  }, [router]);

  return (
    <>
      <article className='p-[16px] border-b flex items-center justify-between md:px-[20px]'>
        <section className='w-full flex items-center justify-between flex-wrap-reverse gap-5'>
          <fieldset className='w-full flex justify-between items-center 2xl:w-auto'>
            <h4 className='min-w-[80px] md:min-w-[100px] 2xl:min-w-[150px] text-[12px] font-semibold md:text-[16px] whitespace-nowrap'>
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
          </fieldset>

          <fieldset className='w-full flex justify-end 2xl:w-auto'>
            <DateFilterTab
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </fieldset>
        </section>
      </article>

      <article className='p-[16px] flex items-center justify-between md:px-[20px]'>
        <section className='w-full flex justify-between items-center 2xl:w-auto'>
          <h4 className='min-w-[80px] md:min-w-[100px] 2xl:min-w-[150px] text-[12px] font-semibold md:text-[16px] '>
            검색
          </h4>
          <AnswerListSearch
            searchContent={searchContent}
            setSearchContent={setSearchContent}
          />
        </section>
      </article>

      <article className='w-full flex justify-center items-center space-x-3 py-[15px]'>
        <SearchButton handleClick={handleSearchClick} isLoading={isLoading} />

        <Button
          variant={'delete1'}
          onClick={resetHandler}
          className='w-[76px] py-[7px] text-[14px] md:w-[127px] md:py-[12px] md:text-[16px] rounded-[2px]'
        >
          초기화
        </Button>
      </article>
    </>
  );
}
