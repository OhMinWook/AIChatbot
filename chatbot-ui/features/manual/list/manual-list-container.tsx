'use client';

import ManualListDatePicker from '@/features/manual/list/manual-list-date-picker';
import { useState } from 'react';
import ManualListInfiniteTable from './manual-list-infinite-table';

export interface SearchOptionType {
  screen_id?: string;
  manual_name?: string;
  hash_id? : string;
}

interface ManualProps {
  startDate?: string;
  endDate?: string;
}

const ManualListBox = ({ startDate, endDate }: ManualProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // search
  const [searchOption, setSearchOption] = useState<SearchOptionType>({});

  return (
    <article className='w-full h-full flex flex-col justify-start'>
      <section className='w-full h-auto bg-customColor-bg0 rounded border border-customColor-bg2 mb-9 overflow-x-auto'>
        <ManualListDatePicker
          setSearchOption={setSearchOption}
          isLoading={isLoading}
        />
      </section>
      <section>
        <ManualListInfiniteTable
          searchOption={searchOption}
          startDate={startDate}
          endDate={endDate}
        />
      </section>
    </article>
  );
};

interface ManualListContainerProps {
  startDate?: string;
  endDate?: string;
}

const ManualListContainer = ({
  startDate,
  endDate,
}: ManualListContainerProps) => {
  return (
    <>
      <ManualListBox startDate={startDate} endDate={endDate} />
    </>
  );
};

export default ManualListContainer;
