'use client';
import PlusSvg from '@/components/svg/plus';
import {
  ALLOWED_TABS,
  EmbeddingFilter,
  getTextFromTab,
  Tabs,
} from '@/const/tab-filter';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface UsageTabProps {
  value: Tabs;
  currentTab: Tabs;
  currentFilter: EmbeddingFilter;
  page: string;
}

const UsageTab = ({
  value,
  currentTab,
  currentFilter,
  page,
}: UsageTabProps) => {
  const text = getTextFromTab(value);
  const isSelect = currentTab === value;
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  return (
    <Link
      href={{
        pathname: `/admin/usage/${page}/${value}/${currentFilter}`,
        query: {
          startDate,
          endDate,
        },
      }}
    >
      <div className='relative w-fit md:min-w-52 px-1 py-3'>
        <div className='w-full flex items-center space-x-1'>
          <div
            className={`w-4 h-4 md:w-6 md:h-6 relative ${
              isSelect ? 'fill-customColor-black' : 'fill-customColor-gray1'
            }`}
          >
            <PlusSvg />
          </div>
          <p
            className={`${
              isSelect ? 'text-customColor-black' : 'text-customColor-gray1'
            } text-2xl md:text-3xl`}
          >
            {text}
          </p>
        </div>

        {isSelect && (
          <div className='absolute w-full bottom-0 border-t-4 rounded-t-lg border-customColor-primary1' />
        )}
      </div>
    </Link>
  );
};

interface UsageTabsProps {
  currentTab: Tabs;
  currentFilter: EmbeddingFilter;
  page: string;
}

export default function UsageTabs({
  currentTab,
  currentFilter,
  page,
}: UsageTabsProps) {
  return (
    <div className='w-full flex border-b-1 border-customColor-bg2 space-x-4 overflow-x-auto scrollbar-hide'>
      {ALLOWED_TABS.map((tab) => (
        <UsageTab
          key={'TABS' + tab}
          value={tab}
          currentTab={currentTab}
          currentFilter={currentFilter}
          page={page}
        />
      ))}
    </div>
  );
}
