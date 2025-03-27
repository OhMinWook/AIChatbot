import * as React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss", { locale: ko });
};

const inputDate = (date: Date) => {
  return format(date, 'yyyy.MM.dd', { locale: ko });
};

interface DateInputProps {
  dateRange: { start: Date | null; end: Date | null };
  onDateChange: (start: Date | null, end: Date | null) => void;
}

export function DateRange({
  dateRange,
  onDateChange,
}: DateInputProps): React.ReactElement {
  const defaultDate = new Date();
  const [date, setDate] = React.useState<
    { from?: Date; to?: Date } | undefined
  >({ from: defaultDate });

  const dateChangeHandler = (value: { from?: Date; to?: Date } | undefined) => {
    const startDate = value?.from || null;
    const endDate = value?.to || null;

    onDateChange(startDate, endDate);
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'date1'}
            className={cn(
              'w-[300px] h-[44px] font-normal px-[12px] 3xl:w-[240px] md:w-full md:min-w-[240px] md:h-[28px] md:text-[12px]',
              !dateRange.start && 'text-muted-foreground',
              'font-semibold',
            )}
          >
            {dateRange.start ? (
              inputDate(dateRange.start)
            ) : (
              <span>{inputDate(defaultDate)}</span>
            )}
            {dateRange.end && ` ~ ${inputDate(dateRange.end)}`}
            <CalendarIcon className='h-[20px] w-[18px] ml-2' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='range'
            selected={{
              from: dateRange.start || undefined,
              to: dateRange.end || undefined,
            }}
            onSelect={dateChangeHandler}
            defaultMonth={
              new Date(new Date().setMonth(new Date().getMonth() - 1))
            }
            locale={ko}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
