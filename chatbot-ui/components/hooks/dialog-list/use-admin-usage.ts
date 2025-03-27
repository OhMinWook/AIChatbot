import { useQuery } from '@tanstack/react-query';
import { getUserUsageDetailAction } from '@/actions/admin-usage';

interface UsageQueryProps {
  useId: number;
}
export default function useUsageQuery({ useId }: UsageQueryProps) {
  return useQuery({
    queryKey: ['usageData', useId],
    queryFn: async () => {
      const res = await getUserUsageDetailAction(useId);
      const data = res.data;

      if (res.error) {
        throw new Error(res.message);
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });
}
