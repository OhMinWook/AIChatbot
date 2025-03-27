'use client';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

interface SearchButtonProps {
  isLoading: boolean;
  handleClick: () => void;
}

const SearchButton = ({ isLoading, handleClick }: SearchButtonProps) => {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      timer = setTimeout(() => {
        setIsDisabled(true);
      }, 500); // 0.5초 후에 disabled 상태로 설정
    } else {
      setIsDisabled(false);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <Button
      variant={'enter3'}
      onClick={handleClick}
      className='min-w-[76px] py-[7px] text-[14px] md:min-w-[127px] md:py-[12px] md:text-[16px] rounded-[2px]'
      disabled={isDisabled}
    >
      검색
    </Button>
  );
};

export { SearchButton };
