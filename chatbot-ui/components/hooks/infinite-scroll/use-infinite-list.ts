// hooks/useInfiniteList.ts
'use client';

import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { convertDateOption } from '@/lib/date-util';

interface SearchOption {
  [key: string]: any;
}

interface UseInfiniteListOptions<T> {
  key: string[];
  initialData?: InfiniteData<T[], number>;
  fetchFn: (params: any) => Promise<T[]>;
  nextPageFn: (lastPage: T[]) => number;
  startDate?: number | string;
  endDate?: number | string;
  searchOption?: SearchOption;
}

export const useInfiniteList = <T>({
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
    queryFn: async ({ pageParam = 0 }) => {
      const queryOptions = {
        lastId: pageParam,
        pageSize: 50,
        startDate,
        endDate,
        searchOption,
      };

      const queryParams = convertDateOption(queryOptions);
      const data = await fetchFn(queryParams);
      return data;
    },

    initialPageParam: 0,
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
