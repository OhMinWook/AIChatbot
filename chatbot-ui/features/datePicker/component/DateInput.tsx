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
  onDateChange: (date: string) => void;
}

export function DateInput({
  onDateChange,
}: DateInputProps): React.ReactElement {
  const defaultDate = new Date();
  const [date, setDate] = React.useState<Date | undefined>(defaultDate);
  const dateChangeHandler = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      onDateChange(formatDate(selectedDate));
    }
  };
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'date1'}
            className={cn(
              'w-[154px] h-[44px] justify-between font-normal px-[12px]',
              !date && 'text-muted-foreground',
              'font-semibold',
            )}
          >
            {date ? inputDate(date) : <span>{inputDate(defaultDate)}</span>}
            <CalendarIcon className='h-[20px] w-[18px]' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={dateChangeHandler}
            locale={ko}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
