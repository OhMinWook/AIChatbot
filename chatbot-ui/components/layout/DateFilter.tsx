'use client';
import {
  useState,
  useCallback,
  ReactElement,
  Dispatch,
  SetStateAction,
} from 'react';
import { DateRange } from '@/features/datePicker/component/DateRange';
import { FilterTab } from '@/features/datePicker/component/FilterTab';

interface Props {
  label: string;
}

export function DateFilter({ label }: Props): ReactElement {
  const [selectedTab, setSelectedTab] = useState<string>('total');
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  const parseDate = (dateString: string) => {
    return dateString ? new Date(dateString) : null;
  };

  const dateChangeHandler = useCallback(
    (start: Date | null, end: Date | null) => {
      setDateRange({ start, end });
      setSelectedTab('');
    },
    [],
  );

  const filterTabDateChangeHandler = useCallback(
    (start: string, end: string) => {
      setDateRange({ start: parseDate(start), end: parseDate(end) });
    },
    [],
  );

  return (
    <article className='px-[20px] py-[10px] border-b flex items-center md:border-none md:justify-between md:flex-col md:gap-[10px]'>
      <section className='hidden md:w-full md:flex md:justify-end'>
        <FilterTab
          onDateChange={filterTabDateChangeHandler}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </section>
      <section className='w-full flex items-center md:border-none md:justify-between'>
        <h4 className='w-[10%] min-w-fit text-[16px] font-semibold whitespace-nowrap 3xl:w-[15%] md:w-fit md:text-[12px]'>
          {label}
        </h4>
        <div className='w-[90%] flex items-center justify-between 3xl:w-[85%] lg-max:justify-end md:w-fit'>
          <fieldset className='flex items-center'>
            <DateRange dateRange={dateRange} onDateChange={dateChangeHandler} />
          </fieldset>
          <fieldset className='lg-max:hidden'>
            <FilterTab
              onDateChange={filterTabDateChangeHandler}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </fieldset>
        </div>
      </section>
    </article>
  );
}
