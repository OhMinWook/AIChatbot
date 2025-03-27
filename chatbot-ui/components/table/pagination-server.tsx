// PaginationServer.tsx
import { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  pageIndex: number;
  setPageIndex: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

export default function PaginationServer({
  pageIndex,
  setPageIndex,
  totalPages,
}: PaginationProps) {
  const pageCount = Math.max(totalPages, 1);
  const maxVisiblePages = 7;

  const getVisiblePages = () => {
    const pages = [];
    const sidePagesCount = 2;

    // 첫번째 페이지
    pages.push(1);

    // 현재 페이지를 중심으로 양 옆 페이지 계산
    let startPage = Math.max(2, pageIndex - sidePagesCount);
    let endPage = Math.min(pageCount - 1, pageIndex + sidePagesCount);

    // 시작과 끝 페이지가 너무 가까운 경우 조정
    if (startPage <= 2) {
      endPage = Math.min(maxVisiblePages - 2, pageCount - 1);
    }
    if (endPage >= pageCount - 1) {
      startPage = Math.max(2, pageCount - (maxVisiblePages - 3));
    }

    // 시작 페이지가 2보다 큰 경우 "..." 추가
    if (startPage > 2) {
      pages.push('...');
    }

    // 페이지 번호 추가
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 끝 페이지가 pageCount - 1보다 작은 경우 "..." 추가
    if (endPage < pageCount - 1) {
      pages.push('...');
    }

    // 마지막 페이지 추가
    if (pageCount > 1) {
      pages.push(pageCount);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <section className='w-full flex justify-center'>
      <div className='flex justify-center items-center space-x-3 md:space-x-5 box-border'>
        {/* Previous button */}
        <Button
          onClick={() => {
            setPageIndex((prev) => prev - 1);
          }}
          disabled={pageIndex === 1}
          variant={'paginationText'}
          className={'flex items-center'}
        >
          <div className='w-10 h-10 relative top-[0.5px]'>
            <ChevronLeft />
          </div>
          <p className='text-[14px] md:text-[16px]'>Previous</p>
        </Button>

        {/* 페이지 번호 */}
        {visiblePages.map((page, i) =>
          page === '...' ? (
            <span key={'dots' + i} className='text-2xl'>
              ...
            </span>
          ) : (
            <Button
              key={'page button' + page}
              variant={'pagination'}
              onClick={() => {
                setPageIndex(Number(page));
              }}
              className={`text-[14px] md:text-[16px] ${
                pageIndex === page ? 'text-customColor-primary1' : ''
              }`}
            >
              {page}
            </Button>
          ),
        )}

        {/* Next button */}
        <Button
          onClick={() => {
            setPageIndex((prev) => prev + 1);
          }}
          disabled={pageIndex === pageCount}
          variant={'paginationText'}
        >
          <p className='text-[14px] md:text-[16px]'>Next</p>
          <div className='w-10 h-10 relative top-[0.5px]'>
            <ChevronRight />
          </div>
        </Button>
      </div>
    </section>
  );
}
