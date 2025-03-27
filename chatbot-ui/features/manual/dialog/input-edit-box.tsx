'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input/input';
import { getTypeFromFieldName } from '@/lib/update-manual-type';

interface InputEditBoxProps {
  fieldName: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  handleUpdateClick: any;
  pageId: number;
}

export default function InputEditBox({
  fieldName,
  value,
  onChange,
  handleUpdateClick,
  pageId,
}: InputEditBoxProps) {
  // 필드 이름에서 "source" 부분만 추출
  const extractedFieldName = fieldName.split('.').pop();

  const handleButtonClick = () => {
    const updateType = getTypeFromFieldName(extractedFieldName!);
    handleUpdateClick(pageId, value, updateType);
  };

  return (
    <div className='flex items-center h-fullrelative'>
      <div className='flex px-[13.875px] py-[3px] text-center items-center text-[1.6rem] font-semibold border rounded-[4px] border-customColor-bg3 mr-[9px]'>
        {extractedFieldName}
      </div>

      <Input
        variant='manual'
        placeholder={`${extractedFieldName}를 입력하세요`}
        className='flex-1'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className='absolute right-0'></div>
      <Button type='button' variant={'ok'} onClick={handleButtonClick}>
        업데이트
      </Button>
    </div>
  );
}
