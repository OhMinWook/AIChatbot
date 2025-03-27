import { Button } from '@/components/ui/button';
import {
  ALLOWED_FILTERS,
  Filter,
  getTextFromFilter,
  Tabs,
} from '@/const/tab-filter';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface FilterButtonProps {
  value: Filter;
  currentTab: Tabs;
  currentFilter: Filter;
  page: string;
}

const FilterButton = ({
  value,
  currentTab,
  currentFilter,
  page,
}: FilterButtonProps) => {
  const text = getTextFromFilter(value);
  const isSelect = currentFilter === value;
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  return (
    <Link
      href={{
        pathname: `/admin/usage/${page}/${currentTab}/${value}`,
        query: {
          startDate,
          endDate,
        },
      }}
    >
      <Button
        variant={`${isSelect ? 'list1' : 'list2'}`}
        className='px-[1rem] min-h-[2rem] text-[12px] md:min-w-[135px] md:min-h-[26px] md:text-[16px]'
      >
        {text}
      </Button>
    </Link>
  );
};

interface UsageFilterProps {
  currentTab: Tabs;
  currentFilter: Filter;
  page: string;
}

export default function UsageFilter({
  currentTab,
  currentFilter,
  page,
}: UsageFilterProps) {
  return (
    <div className='w-full flex space-x-3'>
      {ALLOWED_FILTERS.map((filter) => (
        <FilterButton
          key={'filter button' + filter}
          value={filter}
          currentFilter={currentFilter}
          currentTab={currentTab}
          page={page}
        />
      ))}
    </div>
  );
}
