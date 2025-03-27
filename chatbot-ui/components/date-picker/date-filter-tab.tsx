import { Button } from '@/components/ui/button';
import { Dispatch, MouseEvent, SetStateAction } from 'react';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import { ALL_DATE } from '@/const/date-const';

interface FilterTabProps {
  label: string;
  value: number;
}

const filterValue: FilterTabProps[] = [
  { label: '오늘', value: 0 },
  { label: '1주일', value: 7 },
  { label: '1개월', value: 30 },
  { label: '3개월', value: 90 },
  { label: '6개월', value: 180 },
  { label: '1년', value: 365 },
  { label: '전체', value: 9999 },
];

interface DateFilterTabProps {
  setStartDate: Dispatch<SetStateAction<Date>>;
  setEndDate: Dispatch<SetStateAction<Date>>;
  activeFilter: string;
  setActiveFilter: Dispatch<SetStateAction<string>>;
}

export default function DateFilterTab({
  setStartDate,
  setEndDate,
  activeFilter,
  setActiveFilter,
}: DateFilterTabProps) {
  const today = new Date();

  const handleDateFilter = (e: MouseEvent<HTMLButtonElement>) => {
    const value = Number(e.currentTarget.value);
    const name = e.currentTarget.name;

    let startDate: Date;
    let endDate: Date = endOfDay(today);

    if (value === 0) {
      startDate = startOfDay(today);
    } else {
      startDate = startOfDay(addDays(today, -value));
    }

    switch (value) {
      case 0:
        startDate = startOfDay(today);
        break;
      case 9999:
        startDate = startOfDay(ALL_DATE);
        break;

      default:
        startDate = startOfDay(addDays(today, -value));
        break;
    }

    setStartDate(startDate);
    setEndDate(endDate);
    setActiveFilter(name);
  };

  return (
    <fieldset className='flex space-x-2'>
      {filterValue.map((filter) => (
        <Button
          key={'filter button' + filter.label}
          variant={'date1'}
          className={`text-base rounded-[45px] h-fit px-[8px] py-[5px] md:py-[1.5rem] md:text-[1.6rem] md:min-w-[8rem] md:px-[2rem] md:rounded-[4px] ${
            activeFilter === filter.label &&
            'pointer-events-none text-white bg-customColor-primary1 md:bg-customColor-bg1_1 md:text-customColor-black'
          }`}
          onClick={handleDateFilter}
          name={filter.label}
          value={filter.value}
        >
          {filter.label}
        </Button>
      ))}
    </fieldset>
  );
}
