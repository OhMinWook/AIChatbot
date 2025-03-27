'use client';

import AnswerListDatePicker from '@/features/answer/manage/answer-list-date-picker';
import { useState } from 'react';
import AnswerListInfiniteTable from './answer-list-infinite-table';

export interface SearchOptionType {
  report_content?: string;
}

interface AnswerManageBoxProps {
  startDate?: string;
  endDate?: string;
}

const AnswerManageBox = ({ startDate, endDate }: AnswerManageBoxProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // search
  const [searchOption, setSearchOption] = useState<SearchOptionType>({});

  return (
    <>
      <article className='w-full h-full flex flex-col justify-start'>
        <section className='w-full h-auto bg-customColor-bg0 rounded border border-customColor-bg2 mb-9 overflow-x-auto'>
          <AnswerListDatePicker
            setSearchOption={setSearchOption}
            isLoading={isLoading}
          />
        </section>

        <section>
          <AnswerListInfiniteTable
            searchOption={searchOption}
            startDate={startDate}
            endDate={endDate}
          />
        </section>
      </article>
    </>
  );
};

interface AnswerManageContainerProps {
  startDate?: string;
  endDate?: string;
}

const AnswerManageContainer = ({
  startDate,
  endDate,
}: AnswerManageContainerProps) => {
  return (
    <>
      <AnswerManageBox startDate={startDate} endDate={endDate} />
    </>
  );
};

export default AnswerManageContainer;
