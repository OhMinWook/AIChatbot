import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Table as TableType } from '@tanstack/react-table';

interface TableSelectProps<TData> {
  table: TableType<TData>;
  options: number[];
  total: number;
}

export default function TableSelect<TData>({
  table,
  options,
  total,
}: TableSelectProps<TData>) {
  return (
    <Select
      defaultValue={String(options[0])}
      onValueChange={(e) => {
        table.setPageSize(Number(e));
      }}
    >
      <SelectTrigger className='w-72 py-5 text-2xl'>
        <SelectValue placeholder='Rows per page' />
      </SelectTrigger>
      <SelectContent>
        {options.map((size) => (
          <SelectItem
            key={size}
            className='text-2xl'
            value={String(size)}
            disabled={size >= total}
          >
            {size} rows
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
