// hooks/useEmbeddingUsageList.ts
'use client';

import { InfiniteData } from '@tanstack/react-query';
import { useInfiniteList } from './use-infinite-list';
import { QueryOption } from './infinite-scroll.type';
import { Manuals } from '@/services/admin-manual/admin-manual.type';
import { getManualsAction } from '@/actions/admin-manual-list';
import { AnswerListData } from '@/services/admin-answer/admin-answer.type';
import { getAnswerReportAction } from '@/actions/admin-answer';
import { AdminListData } from '@/services/admin-user/admin-user.type';
import { getAdminListUserAction } from '@/actions/admin-list-action';
import { getUserListAction } from '@/actions/user-list-action';
import { UserListData } from '@/services/admin-user/admin-normal-user.type';
import { useManualInfiniteList } from './use-manual-infinite-list';

interface SearchOption {
  [key: string]: any;
}

interface PageParam {
  lastId: number;
  lastUpdateDt: number;
}

interface UseManualListOptions extends QueryOption {
  searchOption?: SearchOption;
}

export const useManualList = ({
  startDate,
  endDate,
  searchOption,
}: UseManualListOptions) => {
  return useManualInfiniteList<Manuals>({
    key: [
      'manual-list',
      startDate!,
      endDate!,
      ...Object.entries(searchOption || {}).flat(),
    ],

    startDate,
    endDate,
    searchOption,
    fetchFn: async (params) => {
      const response = await getManualsAction(params);
      const tableData = response.data;

      if (response.error) {
        throw new Error(response.message);
      }

      return tableData;
    },
    nextPageFn: (lastPage: Manuals[]) => {
      const ids = lastPage.map((item) => item.id);
      const updateDts = lastPage.map((item) => item.update_dt);
      const minId = Math.min(...ids);
      const minUpdateDt = Math.min(...updateDts);

      return {
        lastId: minId,
        lastUpdateDt: minUpdateDt,
      };
    },
  });
};

interface useAnswerListOptions extends QueryOption {
  initialData?: InfiniteData<AnswerListData[], number>;
  searchOption?: SearchOption;
}

export const useAnswerList = ({
  initialData,
  startDate,
  endDate,
  searchOption,
}: useAnswerListOptions) => {
  return useInfiniteList<AnswerListData>({
    key: [
      'answer-list',
      startDate!,
      endDate!,
      ...Object.entries(searchOption || {}).flat(),
    ],
    initialData,
    startDate,
    endDate,
    searchOption,
    fetchFn: async (params) => {
      const response = await getAnswerReportAction(params);

      const tableData = response.data;

      if (response.error) {
        throw new Error(response.message);
      }

      return tableData;
    },
    nextPageFn: (lastPage: AnswerListData[]) => {
      const ids = lastPage.map((item) => item.report_id);
      const minId = Math.min(...ids);

      return minId;
    },
  });
};

interface useManagerListOptions extends QueryOption {}

export const useManagerList = ({}: useManagerListOptions) => {
  return useInfiniteList<AdminListData>({
    key: ['manager-list'],
    fetchFn: async (params) => {
      const response = await getAdminListUserAction(params);
      const tableData = response.data;

      if (response.error) {
        throw new Error(response.message);
      }

      return tableData;
    },
    nextPageFn: (lastPage: AdminListData[]) => {
      const ids = lastPage.map((item) => item.id);
      const maxId = Math.max(...ids);

      return maxId;
    },
  });
};

interface useUserListOptions extends QueryOption {}

export const useUserList = ({}: useUserListOptions) => {
  return useInfiniteList<UserListData>({
    key: ['user-list'],
    fetchFn: async (params) => {
      const response = await getUserListAction(params);
      const tableData = response.data;

      if (response.error) {
        throw new Error(response.message);
      }

      return tableData;
    },
    nextPageFn: (lastPage: UserListData[]) => {
      const ids = lastPage.map((item) => item.id);
      const maxId = Math.max(...ids);

      return maxId;
    },
  });
};
