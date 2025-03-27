
import { ReactElement, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';

interface FilterTabProps {
  name: string;
  label: string;
}

interface FilterTabComponentProps {
  onDateChange: (start: string, end: string) => void;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

const filterBtn: FilterTabProps[] = [
  { name: 'today', label: '오늘' },
  { name: 'last7', label: '1주일' },
  { name: 'last30', label: '1개월' },
  { name: 'last60', label: '3개월' },
  { name: 'last90', label: '6개월' },
  { name: 'lastYear', label: '1년' },
  { name: 'total', label: '전체' },
];

export function FilterTab({
  onDateChange,
  selectedTab,
  setSelectedTab,
}: FilterTabComponentProps): ReactElement {
  const tabClickHandler = (val: string): void => {
    setSelectedTab(val);
  };


  useEffect(() => {
    const today = new Date();
    const dateRanges: { [key: string]: number } = {
      today: 0,
      last7: 7,
      last30: 30,
      last60: 60,
      last90: 90,
      lastYear: 365,
    };
    if (selectedTab === 'total') {
      onDateChange('', '');
    } else {
      const daysAgo = dateRanges[selectedTab] || 0;
      const startDate = format(
        subDays(today, daysAgo),
        "yyyy-MM-dd'T'HH:mm:ss",
      );
      const endDate = format(today, "yyyy-MM-dd'T'HH:mm:ss");

      onDateChange(startDate, endDate);
    }
  }, [selectedTab, onDateChange]);

  return (
    <div className='flex w-full items-end gap-1'>
      {filterBtn.map((tab: FilterTabProps) => (
        <Button
          key={tab.name}
          variant='date1'
          className={cn(
            '3xl:w-[60px] md:text-[10px] md:rounded-[45px] md:w-[32px] md:h-[20px]',
            tab.name === selectedTab &&
              'pointer-events-none bg-customColor-bg1_1 md:bg-customColor-primary1 md:text-customColor-white',
          )}
          onClick={() => tabClickHandler(tab.name)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
