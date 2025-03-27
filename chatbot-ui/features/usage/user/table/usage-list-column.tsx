import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { formatNumberWithCommas } from '@/lib/format-number';
import DialogUserDetail from '@/features/usage/dialog/user-detail';

export interface UsageListData {
  use_id: number;
  hospital: string;
  username: string;
  call_path: string;
  use_token_cnt: number;
  use_amount: string;
  question: string;
  answer: string;
  satisfaction_rate: string;
  creation_dt: number;
}

export const usageListColumn: ColumnDef<UsageListData>[] = [
  {
    accessorKey: 'use_id',
    size: 30,
    header: () => <div className='whitespace-nowrap'>사용 번호</div>,
    cell: ({ row }) => {
      const useId = row.original.use_id;
      return (
        <DialogUserDetail
          dialogWidth={
            "md:max-w-[676px] md:max-h-[780px] max-h-[600px]' scrollbar-hide"
          }
          useId={useId}
          val={useId}
        />
      );
    },
  },
  {
    accessorKey: 'hospital',
    size: 100,
    header: () => <div className='whitespace-nowrap'>병원명</div>,
    cell: ({ row }) => {
      const useId = row.original.use_id;
      const val = row.original.hospital;
      return (
        <DialogUserDetail
          dialogWidth={'md:max-w-[676px] md:max-h-[780px] max-h-[600px]'}
          useId={useId}
          val={val}
        />
      );
    },
  },
  {
    accessorKey: 'username',
    size: 100,
    header: () => <div className='whitespace-nowrap'>사용자명</div>,
    cell: ({ row }) => {
      const useId = row.original.use_id;
      const val = row.original.username;
      return (
        <DialogUserDetail
          dialogWidth={
            'md:max-w-[676px] md:max-h-[780px] max-h-[600px] scrollbar-hide'
          }
          useId={useId}
          val={val}
        />
      );
    },
  },
  {
    accessorKey: 'call_path',
    size: 100,
    header: () => <div className='whitespace-nowrap'>호출경로(화면/api)</div>,
    cell: ({ row }) => {
      const useId = row.original.use_id;
      const val = row.original.call_path;
      return (
        <DialogUserDetail
          dialogWidth={
            'md:max-w-[676px] md:max-h-[780px] max-h-[600px] scrollbar-hide'
          }
          useId={useId}
          val={val}
        />
      );
    },
  },
  {
    accessorKey: 'use_token_cnt',
    size: 100,
    header: () => <div className='whitespace-nowrap'>사용 토큰 수</div>,
    cell: ({ row }) => {
      const useId = row.original.use_id;
      const val = formatNumberWithCommas(row.getValue('use_token_cnt'));
      return (
        <DialogUserDetail
          dialogWidth={
            'md:max-w-[676px] md:max-h-[780px] max-h-[600px] scrollbar-hide'
          }
          useId={useId}
          val={val}
        />
      );
    },
  },
  {
    accessorKey: 'use_amount',
    size: 200,
    header: () => <div className='whitespace-nowrap'>사용금액($)</div>,

    cell: ({ row }) => {
      const useId = row.original.use_id;
      const val = row.original.use_amount;
      return (
        <DialogUserDetail
          dialogWidth={
            'md:max-w-[676px] md:max-h-[780px] max-h-[600px] scrollbar-hide'
          }
          useId={useId}
          val={val}
        />
      );
    },
  },
  {
    accessorKey: 'question',
    size: 600,
    header: () => <div className='whitespace-nowrap'>질문</div>,
    cell: ({ row }) => {
      const useId = row.original.use_id;
      const val = row.original.question;
      return (
        <DialogUserDetail
          dialogWidth={
            'md:max-w-[676px] md:min-h-[780px] max-h-[600px] scrollbar-hide'
          }
          useId={useId}
          val={val}
        />
      );
    },
  },
  {
    accessorKey: 'answer',
    size: 600,
    header: () => <div className='whitespace-nowrap'>답변</div>,
    cell: ({ row }) => {
      const useId = row.original.use_id;
      const val = row.original.answer;
      return (
        <DialogUserDetail
          dialogWidth={
            'md:max-w-[676px] md:max-h-[780px] max-h-[600px] scrollbar-hide'
          }
          useId={useId}
          val={val}
        />
      );
    },
  },
  {
    accessorKey: 'satisfaction_rate',
    size: 30,
    header: () => <div className='whitespace-nowrap'>만족도</div>,
    cell: ({ row }) => {
      const useId = row.original.use_id;
      const val = row.original.satisfaction_rate;
      return (
        <DialogUserDetail
          dialogWidth={
            'md:max-w-[676px] md:max-h-[780px] max-h-[600px] scrollbar-hide'
          }
          useId={useId}
          val={val}
        />
      );
    },
  },
  {
    accessorKey: 'creation_dt',
    size: 300,
    header: () => <div className='whitespace-nowrap'>작성일</div>,
    cell: ({ row }) => {
      const dateValue: number = row.getValue('creation_dt');
      const useId = row.original.use_id;
      const val = format(new Date(dateValue * 1000), 'yyyy-MM-dd HH:mm:ss');
      return (
        <DialogUserDetail
          dialogWidth={
            'md:max-w-[676px] md:max-h-[780px] max-h-[600px] scrollbar-hide'
          }
          useId={useId}
          val={val}
        />
      );
    },
  },
];
