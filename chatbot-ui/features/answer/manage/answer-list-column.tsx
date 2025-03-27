import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import DialogUserReport from '@/features/answer/dialog/user-report';

export interface AnswerListData {
  report_id: number;
  question_content: string;
  answer_content: string;
  report_content: string;
  creation_dt: number;
}

export const answerListColumn: ColumnDef<AnswerListData>[] = [
  {
    accessorKey: 'select',
    size: 10,
    header: ({ table }) => (
      <input
        id='header-checkbox'
        type='checkbox'
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        id={`cell-checkbox-${row.id}`}
        type='checkbox'
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: 'report_id',
    size: 20,
    header: ({ table }) => <div className='whitespace-nowrap'>리포트 번호</div>,
    cell: ({ row }) => {
      const reportId = row.original.report_id;
      return (
        <DialogUserReport
          dialogWidth={
            'md:max-w-[676px] md:max-h-[800px] max-h-[600px] scrollbar-hide'
          }
          reportId={reportId}
          val={reportId}
        />
      );
    },
  },
  {
    accessorKey: 'question_content',
    size: 100,
    header: ({ table }) => <div className='whitespace-nowrap'>질문</div>,
    cell: ({ row }) => {
      const reportId = row.original.report_id;
      const val = row.original.question_content;
      return (
        <DialogUserReport
          dialogWidth={
            'md:max-w-[676px] md:max-h-[800px] max-h-[600px] scrollbar-hide'
          }
          reportId={reportId}
          val={val}
        />
      );
    },
  },
  {
    accessorKey: 'answer_content',
    size: 200,
    header: ({ table }) => <div className='whitespace-nowrap'>답변</div>,
    cell: ({ row }) => {
      const reportId = row.original.report_id;
      const val = row.original.answer_content;
      return (
        <DialogUserReport
          dialogWidth={
            'md:max-w-[676px] md:max-h-[800px] max-h-[600px] scrollbar-hide'
          }
          reportId={reportId}
          val={val}
        />
      );
    },
  },
  {
    accessorKey: 'report_content',
    size: 200,
    header: ({ table }) => <div className='whitespace-nowrap'>불만족 내용</div>,
    cell: ({ row }) => {
      const reportId = row.original.report_id;
      const val = row.original.report_content;
      return (
        <DialogUserReport
          dialogWidth={
            'md:max-w-[676px] md:max-h-[800px] max-h-[600px] scrollbar-hide'
          }
          reportId={reportId}
          val={val}
        />
      );
    },
  },
  {
    accessorKey: 'creation_dt',
    size: 180,
    header: ({ table }) => <div className='whitespace-nowrap'>작성일</div>,
    cell: ({ row }) => {
      const dateValue: number = row.getValue('creation_dt');
      const reportId = row.original.report_id;
      const val = format(new Date(dateValue * 1000), 'yyyy-MM-dd HH:mm:ss');
      return (
        <DialogUserReport
          dialogWidth={
            'md:max-w-[676px] md:max-h-[800px] max-h-[600px] scrollbar-hide'
          }
          reportId={reportId}
          val={val}
        />
      );
    },
  },
];
