import { Dispatch, SetStateAction } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format, isSameDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ALL_DATE } from '@/const/date-const';

interface DatePickerProps {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  afterDisabled?: Date;
  beforeDisabled?: Date;
  setActiveFilter?: Dispatch<SetStateAction<string>>;
}

export default function DatePicker({
  date,
  setDate,
  afterDisabled,
  beforeDisabled,
  setActiveFilter,
}: DatePickerProps) {
  const today = new Date();
  const beforeDisabledDate = beforeDisabled;
  const afterDisabledDate = afterDisabled || today;
  const isALLSelect = isSameDay(date, ALL_DATE);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (setActiveFilter) setActiveFilter('');

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'date1'}
          className={`w-full min-w-44 px-[12px] md:min-w-72 h-[30px] font-semibold flex justify-center items-center space-x-3 text-[12px] md:h-20 md:text-[16px]`}
        >
          {isALLSelect ? <p>전체</p> : <p>{format(date, 'yyyy.MM.dd')}</p>}
          <CalendarIcon className='h-[12px] w-[12px] md:w-8 md:h-8' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-3'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleSelect}
          defaultMonth={isALLSelect ? today : date}
          initialFocus
          disabled={[{ before: beforeDisabledDate, after: afterDisabledDate }]}
        />
      </PopoverContent>
    </Popover>
  );
}
