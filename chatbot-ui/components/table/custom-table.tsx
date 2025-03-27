'use client';

import { flexRender, Table as TableType } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useEffect, useState } from 'react';

interface CustomTableProps<TData> {
  table: TableType<TData>;
  isSuccess?: boolean;
  forwardRef?: React.Ref<any>;
  height?: string;
  isFetching?: boolean;
  isLoading?: boolean;
}

export default function CustomTable<TData>({
  table,
  isSuccess,
  forwardRef,
  height,
  isFetching,
  isLoading,
}: CustomTableProps<TData>) {
  const rows = table.getRowModel().rows || [];

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className={`overflow-y-auto ${height ? height : ''}`}>
      <Table className=' relative w-full min-w-[1280px]'>
        <TableHeader className='sticky top-0 border-t-0'>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length}>
                {isLoading ? (
                  <section className='flex w-full h-full items-center justify-center'>
                    <div className='animate-spin w-20 h-20 border-2 border-red-400 border-t-transparent rounded-full' />
                  </section>
                ) : (
                  '데이터 없음'
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {isClient && isSuccess && (
          <tfoot className='opacity-100' ref={forwardRef} />
        )}
        {isClient && isFetching && (
          <div className='absolute bottom-0 w-full h-40 flex items-center justify-center bg-gradient-to-t from-white via-white to-transparent'>
            <div className='animate-spin w-20 h-20 border-2 border-red-400 border-t-transparent rounded-full' />
          </div>
        )}
      </Table>
    </section>
  );
}
