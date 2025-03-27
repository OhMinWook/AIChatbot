import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface TableSelectProps {
  setPageSize: any;
  setPageIndex: any;
  initOption: number;
  options: number[];
}

export default function TableSelectServer({
  setPageSize,
  setPageIndex,
  initOption,
  options,
}: TableSelectProps) {
  return (
    <Select
      defaultValue={String(initOption)}
      onValueChange={(e) => {
        setPageSize(e);
        setPageIndex(1);
      }}
    >
      <SelectTrigger className='w-72 py-5 text-2xl'>
        <SelectValue placeholder='Rows per page' />
      </SelectTrigger>
      <SelectContent>
        {options.map((size) => (
          <SelectItem key={size} className='text-2xl' value={String(size)}>
            {size}개씩보기
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
