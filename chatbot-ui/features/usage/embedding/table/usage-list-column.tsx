import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { formatNumberWithCommas } from '@/lib/format-number';
import { AdminUsageHistory } from '@/services/admin-use/admin-use.type';

export interface UsageListData {
  use_id: number;
  admin_name: string;
  use_type: string;
  screen_id: string;
  manual_name: string;
  use_token_cnt: number;
  use_amount: string;
  creation_dt: number;
}

export const usageListColumn: ColumnDef<AdminUsageHistory>[] = [
  {
    accessorKey: 'use_id',
    size: 30,
    header: () => <div className='whitespace-nowrap'>사용 번호</div>,
    cell: ({ row }) => {
      const val = row.original.use_id;
      return <p className='whitespace-nowrap md:whitespace-normal'>{val}</p>;
    },
  },
  {
    accessorKey: 'admin_name',
    size: 100,
    header: () => <div className='whitespace-nowrap'>관리자명</div>,
    cell: ({ row }) => {
      const val = row.original.admin_name;
      return <p className='whitespace-nowrap md:whitespace-normal'>{val}</p>;
    },
  },
  {
    accessorKey: 'use_type',
    size: 100,
    header: () => <div className='whitespace-nowrap'>전처리/임베딩</div>,
    cell: ({ row }) => {
      const val = row.original.use_type;
      return <p className='whitespace-nowrap md:whitespace-normal'>{val}</p>;
    },
  },
  {
    accessorKey: 'screen_id',
    size: 150,
    header: () => <div className='whitespace-nowrap'>화면ID(source)</div>,
    cell: ({ row }) => {
      const val = row.original.screen_id;
      return <p className='whitespace-nowrap md:whitespace-normal'>{val}</p>;
    },
  },
  {
    accessorKey: 'manual_name',
    size: 300,
    header: () => <div className='whitespace-nowrap'>해당 메뉴얼</div>,
    cell: ({ row }) => {
      const val = row.original.manual_name;
      return <p className='whitespace-nowrap md:whitespace-normal'>{val}</p>;
    },
  },
  {
    accessorKey: 'use_token_cnt',
    size: 50,
    header: () => <div className='whitespace-nowrap'>사용 토큰 수</div>,
    cell: ({ row }) => {
      const val = formatNumberWithCommas(row.getValue('use_token_cnt'));
      return <p className='whitespace-nowrap'>{val}</p>;
    },
  },
  {
    accessorKey: 'use_amount',
    size: 300,
    header: () => <div className='whitespace-nowrap'>사용금액($)</div>,
    cell: ({ row }) => {
      const val = row.original.use_amount;
      return <p className='whitespace-nowrap md:whitespace-normal'>{val}</p>;
    },
  },
  {
    accessorKey: 'creation_dt',
    size: 180,
    header: () => <div className='whitespace-nowrap'>사용일자</div>,
    cell: ({ row }) => {
      const dateValue: number = row.getValue('creation_dt');
      const val = format(new Date(dateValue * 1000), 'yyyy-MM-dd HH:mm:ss');
      return <p className='whitespace-nowrap md:whitespace-normal'>{val}</p>;
    },
  },
];
