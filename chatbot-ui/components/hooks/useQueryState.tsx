import { useState } from 'react';

interface InitState {
  initStartDate?: string;
  initEndDate?: string;
}

export default function useQueryState({
  initStartDate,
  initEndDate,
}: InitState) {
  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);

  const queryState = {
    startDate,
    endDate,
  };

  const setQueryState = {
    setStartDate,
    setEndDate,
  };

  return { queryState, setQueryState };
}
