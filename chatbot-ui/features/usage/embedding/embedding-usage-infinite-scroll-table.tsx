import { useEmbeddingUsageList } from '@/components/hooks/infinite-scroll/use-usage-list';
import InfiniteScrollTable from '@/components/table/infinite-scroll-table';
import { usageListColumn } from './table/usage-list-column';

interface UsageInfiniteScrollTableProps {
  startDate?: string;
  endDate?: string;
}

export default function EmbeddingUsageInfiniteScrollTable({
  startDate,
  endDate,
}: UsageInfiniteScrollTableProps) {
  const queryResult = useEmbeddingUsageList({
    startDate,
    endDate,
  });

  return (
    <InfiniteScrollTable
      queryResult={queryResult}
      columns={usageListColumn}
      title='사용량 리스트'
    />
  );
}
