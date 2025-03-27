import { Button } from '@/components/ui/button';
import { formatManualPath } from '@/lib/format-number';
import { FileSymlink } from 'lucide-react';
import Link from 'next/link';

interface BotChatManualLinkBoxProps {
  manual: string;
  slicePath: number;
}

const BotChatManualLinkBox = ({
  manual,
  slicePath,
}: BotChatManualLinkBoxProps) => {
  return (
    <section className='w-full max-w-full p-0 md:p-8 space-x-5 flex bg-white rounded-xl'>
      <article className='flex justify-center items-center'>
        <div className='w-20 h-20 cursor-pointer p-4 border-1 border-slate-300 rounded-full transition-colors shadow-md hover:bg-slate-50'>
          <Link href={manual} target='_blank'>
            <FileSymlink className='w-full h-full' />
          </Link>
        </div>
      </article>

      <div className='w-full flex flex-col space-y-2'>
        <p className='font-bold'>메뉴얼 링크</p>
        <Link href={manual} target='_blank' className=''>
          <p className='text-slate-400 cursor-pointer hover:underline'>
            {formatManualPath(manual, slicePath)}
          </p>
        </Link>
      </div>
      <div className='flex justify-center items-center'>
        <Link href={manual} target='_blank' className='w-full h-full'>
          <Button className='w-32 md:w-40 h-full text-2xl md:text-3xl border-1 shadow-md bg-white hover:bg-slate-50'>
            OPEN
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default BotChatManualLinkBox;
