'use client';
import PlusSvg from '@/components/svg/plus';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface UsageTabProps {
  value: string;
  text: string;
}

const UsageTab = ({ value, text }: UsageTabProps) => {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const isSelect = filter === value;

  return (
    <Link
      href={{
        pathname: '/admin/usage/user',
        query: {
          filter: value,
        },
      }}
    >
      <div className='relative w-56 px-1 py-3'>
        <div className='w-full flex items-center space-x-1'>
          <div
            className={`w-5 h-5 md:w-6 md:h-6 relative ${
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

export const UsageTabs = () => {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');

  return (
    <div className='w-full flex border-b-1 border-customColor-bg2 space-x-3'>
      <UsageTab value='all' text='전체' />
      <UsageTab value='year' text='연도별' />
      <UsageTab value='month' text='월별' />
      <UsageTab value='day' text='일별' />
      <p className='text-2xl'>current : {filter}</p>
    </div>
  );
};
