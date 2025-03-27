// hooks/useEmbeddingUsageList.ts
'use client';

import { getEmbeddingAction, getUserUsageAction } from '@/actions/admin-usage';
import { InfiniteData } from '@tanstack/react-query';
import { useInfiniteList } from './use-infinite-list';
import {
  AdminUsageHistory,
  UseHistory,
} from '@/services/admin-use/admin-use.type';
import { QueryOption } from './infinite-scroll.type';

interface UseEmbeddingUsageListOptions extends QueryOption {}

export const useEmbeddingUsageList = ({
  startDate,
  endDate,
}: UseEmbeddingUsageListOptions) => {
  return useInfiniteList<AdminUsageHistory>({
    key: ['embedding-usage-list', startDate!, endDate!],

    startDate,
    endDate,
    fetchFn: async (params) => {
      const response = await getEmbeddingAction(params);
      const tableData = response.data;

      if (response.error) {
        throw new Error(response.message);
      }

      return tableData;
    },
    nextPageFn: (lastPage: AdminUsageHistory[]) => {
      const ids = lastPage.map((item) => item.use_id);
      const minId = Math.min(...ids);

      return minId;
    },
  });
};

interface UseUserUsageListOptions extends QueryOption {}

export const useUserUsageList = ({
  startDate,
  endDate,
}: UseUserUsageListOptions) => {
  return useInfiniteList<UseHistory>({
    key: ['user-usage-list', startDate!, endDate!],
    startDate,
    endDate,
    fetchFn: async (params) => {
      const response = await getUserUsageAction(params);
      const tableData = response.data;

      if (response.error) {
        throw new Error(response.message);
      }

      return tableData;
    },
    nextPageFn: (lastPage: UseHistory[]) => {
      const ids = lastPage.map((item) => item.use_id);
      const minId = Math.min(...ids);

      return minId;
    },
  });
};
