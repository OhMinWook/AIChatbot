// hooks/useInfiniteList.ts
'use client';

import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { convertDateOption } from '@/lib/date-util';

interface SearchOption {
  [key: string]: any;
}

interface PageParam {
  lastId: number;
  lastUpdateDt: number | null;
}

interface UseInfiniteListOptions<T> {
  key: string[];
  initialData?: InfiniteData<T[], PageParam>;
  fetchFn: (params: any) => Promise<T[]>;
  nextPageFn: (lastPage: T[]) => {
    lastId: number;
    lastUpdateDt: number;
  };
  startDate?: number | string;
  endDate?: number | string;
  searchOption?: SearchOption;
}

export const useManualInfiniteList = <T>({
  key,
  initialData,
  fetchFn,
  nextPageFn,
  startDate,
  endDate,
  searchOption,
}: UseInfiniteListOptions<T>) => {
  return useInfiniteQuery({
    queryKey: [...key],
    queryFn: async ({ pageParam = { lastId: 0, lastUpdateDt: 0 } }) => {
      const queryOptions = {
        lastId: pageParam.lastId,
        lastUpdateDt: pageParam.lastUpdateDt,
        pageSize: 50,
        startDate,
        endDate,
        searchOption,
      };

      const queryParams = convertDateOption(queryOptions);
      const data = await fetchFn(queryParams);
      return data;
    },

    initialPageParam: {
      lastId: 0,
      lastUpdateDt: null,
    },
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (lastPage.length < 50) return undefined;

      const nextPageParam = nextPageFn(lastPage);
      return nextPageParam;
    },
    initialData,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
