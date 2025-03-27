import { Button } from '@/components/ui/button';
import { formatDateRange } from '@/lib/date-util';
import { formatNumberWithCommas } from '@/lib/format-number';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export interface UsageListData {
  detail: string;
  total_token_cnt: number;
  total_use_amount: string;
  date: string;
}

export const usageColumns: ColumnDef<UsageListData>[] = [
  {
    accessorKey: 'detail',
    size: 100,
    header: () => <div className='whitespace-nowrap'>구분</div>,
    cell: ({ row }) => {
      return <div className='whitespace-nowrap'>{row.getValue('detail')}</div>;
    },
  },
  {
    accessorKey: 'total_token_cnt',
    size: 100,
    header: ({ column }) => {
      return (
        <Button
          className='bg-transparent text-xl whitespace-nowrap'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          사용 토큰 수
          <ArrowUpDown className='ml-2 h-5 w-5' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedTokenCount = formatNumberWithCommas(
        row.getValue('total_token_cnt'),
      );
      return <p className='whitespace-nowrap'>{formattedTokenCount}</p>;
    },
  },
  {
    accessorKey: 'total_use_amount',
    size: 200,
    header: () => <div className='whitespace-nowrap'>사용금액($)</div>,
    cell: ({ row }) => {
      const val = row.original.total_use_amount;
      return <p className='whitespace-nowrap'>{val}</p>;
    },
  },
  {
    accessorKey: 'date',
    size: 200,
    header: () => <div className='whitespace-nowrap'>기준(전체일자)</div>,
    cell: ({ row }) => {
      const val = row.original.date;
      const formattedDate = formatDateRange(val);

      return <p className='whitespace-nowrap'>{formattedDate}</p>;
    },
  },
];
