import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input/input';

interface Props {
  searchCategory: string;
  searchContent: string;
  setSearchCategory: (value: string) => void;
  setSearchContent: (value: string) => void;
}

interface searchList {
  name: string;
  value: string;
}

const searchFilterList: searchList[] = [
  { name: '화면 ID', value: 'screen_id' },
  { name: '메뉴얼 이름', value: 'manual_name' },
  { name: "해시 ID", value: 'hash_id'},
];

export default function ManualListSearch({
  searchCategory,
  searchContent,
  setSearchCategory,
  setSearchContent,
}: Props) {
  return (
    <article className='flex space-x-7 md:space-x-9'>
      <Select value={searchCategory} onValueChange={setSearchCategory}>
        <SelectTrigger className='w-1/2 h-[30px] text-[12px] ring-customColor-bg2 focus:ring-customColor-bg2 font-semibold outline-none bg-customColor-bg0 border border-customColor-bg2 md:text-[16px] px-[12px] flex justify-between items-center md:w-72 md:h-20'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {searchFilterList.map((item: searchList) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className='text-[12px] py-[5px] md:text-[16px]'
            >
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        className='w-1/2 h-[30px] bg-customColor-bg0 border border-customColor-bg2 text-[16px] px-[12px] rounded-[2px] outline-none md:w-72 md:h-20'
        value={searchContent}
        onChange={(e) => setSearchContent(e.target.value)}
      />
    </article>
  );
}
