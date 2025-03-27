import { useQuery } from '@tanstack/react-query';
import {
  getEmbeddingSummaryAction,
  getUserUsageDetailAction,
  getUserUsageSummaryAction,
} from '@/actions/admin-usage';
import { EmbeddingFilter, Tabs } from '@/const/tab-filter';
import { convertDateOption } from '@/lib/date-util';

interface EmbeddingSummaryQueryProps {
  currentTab: string;
  currentFilter: string;
  startDate?: number | string;
  endDate?: number | string;
}

export function useEmbeddingSummaryQuery({
  currentTab,
  currentFilter,
  startDate,
  endDate,
}: EmbeddingSummaryQueryProps) {
  return useQuery({
    queryKey: [
      'embedding-summary',
      currentTab,
      currentFilter,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const options = {
        lastId: 0,
        pageSize: 50,
        dateFilter: currentTab,
        detailFilter: currentFilter,
        startDate: startDate,
        endDate: endDate,
      };

      const queryParams = convertDateOption(options);

      const res = await getEmbeddingSummaryAction(queryParams);

      const data = res.data;

      if (res.error) {
        throw new Error(res.message);
      }

      return data;
    },
    staleTime: 0,
    retry: 0,
  });
}

export function useUserSummaryQuery({
  currentTab,
  currentFilter,
  startDate,
  endDate,
}: EmbeddingSummaryQueryProps) {
  return useQuery({
    queryKey: ['user-summary', currentTab, currentFilter, startDate, endDate],
    queryFn: async () => {
      const options = {
        lastId: 0,
        pageSize: 50,
        dateFilter: currentTab,
        detailFilter: currentFilter,
        startDate: startDate,
        endDate: endDate,
      };

      const queryParams = convertDateOption(options);

      const res = await getUserUsageSummaryAction(queryParams);

      const data = res.data;

      if (res.error) {
        throw new Error(res.message);
      }

      return data;
    },
    staleTime: 0,
    retry: 0,
  });
}
