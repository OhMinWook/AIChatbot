import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import DialogCell from '../cell/dialog-cell';
import { Checkbox } from '@/components/ui/checkbox';
import { formatManualPath } from '@/lib/format-number';
import { Manuals } from '@/services/admin-manual/admin-manual.type';

export const manualListColumn: ColumnDef<Manuals>[] = [
  {
    accessorKey: 'select',
    size: 10,
    header: ({ table }) => (
      <div className={`flex pr-4`}>
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(checked) => {
            table.toggleAllRowsSelected(checked as boolean);
          }}
          aria-label='Select all rows'
          className='w-5 h-5 data-[state=checked]:bg-customColor-primary2 '
        />
      </div>
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked as boolean)}
        aria-label={`Select row ${row.id}`}
        className='w-5 h-5 data-[state=checked]:bg-customColor-primary2'
      />
    ),
  },
  {
    accessorKey: 'id',
    size: 10,
    header: ({ table }) => <div className='whitespace-nowrap'>메뉴얼 번호</div>,
    cell: ({ row }) => {
      const manualId = row.original.id;
      const screen = row.original.id;

      return (
        <DialogCell
          manualId={manualId}
          textId={String(screen)}
          dialogWidth={'max-w-[1290px] md:max-h-[800px] max-h-[600px]'}
          center
        />
      );
    },
  },
  {
    accessorKey: 'screen_id',
    size: 200,
    header: ({ table }) => (
      <div className='whitespace-nowrap'>화면ID(source)</div>
    ),
    cell: ({ row }) => {
      const manualId = row.original.id;
      const screen = row.original.screen_id;

      return (
        <DialogCell
          manualId={manualId}
          textId={screen}
          dialogWidth={
            'max-w-[1290px] max-w-[1290px] md:max-h-[800px] max-h-[600px]'
          }
        />
      );
    },
  },
  {
    accessorKey: 'manual_name',
    size: 300,
    header: ({ table }) => <div className='whitespace-nowrap'>메뉴얼 이름</div>,
    cell: ({ row }) => {
      const manualId = row.original.id;
      const screen = row.original.manual_name;

      return (
        <DialogCell
          manualId={manualId}
          textId={String(screen)}
          dialogWidth={
            'max-w-[1290px] max-w-[1290px] md:max-h-[800px] max-h-[600px]'
          }
        />
      );
    },
  },
  {
    accessorKey: 'content',
    size: 900,
    header: ({ table }) => <div className='whitespace-nowrap'>메뉴얼 내용</div>,
    cell: ({ row }) => {
      const manualId = row.original.id;
      const screen = row.original.content;
      // const formattedPath = formatManualPath(screen, 50);

      return (
        <DialogCell
          manualId={manualId}
          textId={screen}
          dialogWidth={
            'max-w-[1290px] max-w-[1290px] md:max-h-[800px] max-h-[600px] '
          }
        />
      );
    },
  },
  {
    accessorKey: 'creation_dt',
    size: 220,
    header: ({ table }) => (
      <div className='whitespace-nowrap'>메뉴얼 등록일</div>
    ),
    cell: ({ row }) => {
      const manualId = row.original.id;
      const screen = row.original.creation_dt;
      const formattedDate = format(
        new Date(screen * 1000),
        'yyyy-MM-dd HH:mm:ss',
      );
      return (
        <DialogCell
          manualId={manualId}
          textId={String(formattedDate)}
          dialogWidth={
            'max-w-[1290px] max-w-[1290px] md:max-h-[800px] max-h-[600px]'
          }
        />
      );
    },
  },
  {
    accessorKey: 'update_dt',
    size: 220,
    header: ({ table }) => (
      <div className='whitespace-nowrap'>메뉴얼 수정일</div>
    ),
    cell: ({ row }) => {
      const manualId = row.original.id;
      const screen = row.original.update_dt;
      const formattedDate = format(
        new Date(screen * 1000),
        'yyyy-MM-dd HH:mm:ss',
      );
      return (
        <DialogCell
          manualId={manualId}
          textId={String(formattedDate)}
          dialogWidth={'max-w-[1290px] md:max-h-[800px] max-h-[600px]'}
        />
      );
    },
  },
];
