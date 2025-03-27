'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { ko } from 'date-fns/locale';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const today = new Date();
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: cn(
          'w-full h-full flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        ),
        month: cn('w-full space-y-4'),

        // 월
        caption: cn('flex justify-center pt-1 relative items-center'),
        caption_label: cn('text-2xl font-medium flex-grow text-center'),

        //버튼
        nav: cn('space-x-4 flex items-center'),
        nav_button: cn(
          'h-16 w-16 bg-transparent p-0 opacity-50 hover:opacity-100',
          'flex items-center justify-center',
        ),
        nav_button_previous: cn('absolute left-4'),
        nav_button_next: cn('absolute right-4'),
        table: cn('w-full h-full border-collapse space-y-1'),

        // 요일
        head_row: cn(
          'flex space-x-3 w-full h-full justify-center items-center',
        ),
        head_cell: cn(
          'text-muted-foreground rounded-md w-14 h-14 font-normal text-2xl',
          'flex items-center justify-center',
        ),

        // 날짜 row
        row: cn('flex w-full mt-2 space-x-3'),
        cell: cn(
          'w-full h-full text-center text-md md:text-2xl p-0 relative rounded-full',
          '[&:has([aria-selected].day-range-end)]:rounded-full',
          '[&:has([aria-selected].day-outside)]:bg-accent/50',
          '[&:has([aria-selected])]:rounded-full',
          '[&:has([aria-selected])]:bg-accent',
          'first:[&:has([aria-selected])]:rounded-full',
          'last:[&:has([aria-selected])]:rounded-full',
          'focus-within:relative focus-within:z-20',
        ),

        // 날짜 (속성별)
        day: cn(
          'h-14 w-14 p-0 font-normal rounded-full aria-selected:bg-customColor-bg1_1',
          'hover:text-customColor-primary1 hover:bg-customColor-bg1_1',
        ),
        day_range_end: cn('day-range-end'),
        day_selected: cn(
          'bg-customColor-bg1_1 text-customColor-primary1 hover:bg-customColor-bg1_1',
        ),
        day_today: cn('bg-accent rounded-full text-accent-foreground'),
        day_outside: cn(
          'rounded-full text-muted-foreground opacity-50',
          'aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
          'aria-selected:opacity-30',
        ),
        day_disabled: cn(
          'text-muted-foreground opacity-50',
          'cursor-not-allowed',
          'hover:bg-transparent hover',
        ),
        day_range_middle: cn(
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        ),
        day_hidden: cn('invisible'),
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className='h-8 w-8' />,
        IconRight: ({ ...props }) => <ChevronRight className='h-8 w-8' />,
      }}
      locale={ko}
      disabled={[{ after: today }]}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
