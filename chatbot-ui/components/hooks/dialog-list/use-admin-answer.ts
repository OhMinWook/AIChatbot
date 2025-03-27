import { getAnswerReportIdAction } from '@/actions/admin-answer';
import { useQuery } from '@tanstack/react-query';

interface ReportQueryProps {
  reportId: number;
}
export default function useReportQuery({ reportId }: ReportQueryProps) {
  return useQuery({
    queryKey: ['reportData', reportId],
    queryFn: async () => {
      const res = await getAnswerReportIdAction(reportId);
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
