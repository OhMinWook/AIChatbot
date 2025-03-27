import { Button } from '../ui/button';
import { Table as TableType } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps<TData> {
  table: TableType<TData>;
  total: number;
}

export default function Pagination<TData>({
  table,
  total,
}: PaginationProps<TData>) {
  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = Math.ceil(total / pageSize);
  const maxVisiblePages = 7; // 최대 7개의 페이지 표시

  const getVisiblePages = () => {
    const pages = [];
    const sidePagesCount = 2; // 현재 페이지 기준으로 양옆에 보여줄 페이지 수
    const totalVisiblePages = maxVisiblePages - 2; // 첫 페이지와 마지막 페이지를 제외한 개수

    // Always show the first page
    pages.push(0);

    // Calculate the start and end pages around the current page
    let startPage = Math.max(1, pageIndex - sidePagesCount);
    let endPage = Math.min(pageCount - 2, pageIndex + sidePagesCount);

    // Adjust if startPage or endPage are out of bounds
    if (startPage <= 1) {
      endPage = Math.min(totalVisiblePages, pageCount - 2);
    }
    if (endPage >= pageCount - 2) {
      startPage = Math.max(1, pageCount - totalVisiblePages);
    }

    // Add dots before start page if necessary
    if (startPage > 1) {
      pages.push('...');
    }

    // Add the range of pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add dots after the end page if necessary
    if (endPage < pageCount - 2) {
      pages.push('...');
    }

    // Always show the last page
    if (pageCount > 1) {
      pages.push(pageCount - 1);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <section className='w-full flex justify-center'>
      <div className='w-[720px] max-w-[720px] flex justify-center items-center space-x-5'>
        {/* Previous button */}
        <Button
          onClick={() => table.setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
          className='flex justify-center items-center space-x-2'
        >
          <div className='w-10 h-10 relative top-[0.5px]'>
            <ChevronLeft />
          </div>
          <p>Previous</p>
        </Button>

        {/* Page numbers */}
        {visiblePages.map((page, i) =>
          page === '...' ? (
            <span key={'dots' + i} className='text-2xl'>
              ...
            </span>
          ) : (
            <Button
              key={'page button' + page}
              variant={'pagination'}
              onClick={() => table.setPageIndex(page as number)}
              className={`text-3xl ${
                pageIndex === page ? 'text-customColor-primary1' : ''
              }`}
            >
              {Number(page) + 1}
            </Button>
          ),
        )}

        {/* Next button */}
        <Button
          onClick={() => table.setPageIndex(pageIndex + 1)}
          disabled={pageIndex === pageCount - 1}
          className='flex justify-center items-center space-x-2'
        >
          <p>Next</p>
          <div className='w-10 h-10 relative top-[0.5px]'>
            <ChevronRight />
          </div>
        </Button>
      </div>
    </section>
  );
}
