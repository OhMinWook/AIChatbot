import { truncateString } from '@/lib/string-util';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { HTMLAttributes, ReactNode } from 'react';

interface BotChatArrayHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const BotChatArrayHeader = ({
  className,
  children,
  ...props
}: BotChatArrayHeaderProps) => {
  return (
    <header
      className={cn(
        'w-full p-3 md:p-5 border-b flex justify-center items-center',
        className,
      )}
      {...props}
    >
      <h1 className='text-2xl md:text-4xl font-bold flex items-center gap-2 text-[#f8f2f2] drop-shadow-md'>
        {children}
      </h1>
    </header>
  );
};

interface BotChatArrayBoxProps {
  children: ReactNode;
}

const BotChatArrayBox = ({ children }: BotChatArrayBoxProps) => {
  return <div className='w-1/2 h-full flex-col'>{children}</div>;
};

const BotChatArrayContent = ({ children }: BotChatArrayBoxProps) => {
  return (
    <div className='w-full h-full flex flex-col rounded-b-lg'>{children}</div>
  );
};

interface BotChatArrayItemProps extends BotChatArrayBoxProps {
  index: number;
}

const BotChatArrayItem = ({ children, index }: BotChatArrayItemProps) => {
  return (
    <div
      className={cn(
        'group w-full p-3  transition-colors',
        index % 2 === 0
          ? 'bg-white hover:bg-gray-200'
          : 'bg-gray-100 hover:bg-gray-200',
      )}
    >
      {children}
    </div>
  );
};

interface BotChatArrayManualLinkProps {
  link?: string | null;
  fallback?: string;
}

const BotChatArrayManualLink = ({
  link,
  fallback,
}: BotChatArrayManualLinkProps) => {
  if (!link)
    return (
      <span className='cursor-not-allowed text-muted-foreground'>
        {fallback}
      </span>
    );

  return (
    <Link href={link} target='_blank' className='w-full'>
      <BotChatArrayUrlDisplay url={link} />
    </Link>
  );
};

interface BotChatArrayUrlDisplayProps {
  url: string;
}

const BotChatArrayUrlDisplay = ({ url }: BotChatArrayUrlDisplayProps) => {
  return (
    <>
      <span className='hidden md:inline cursor-pointer text-[#c92f5c] hover:underline group-hover:text-[#5a0820]'>
        {truncateString(url, 40)}
      </span>
      <span className='md:hidden cursor-pointer text-[#c92f5c] hover:underline group-hover:text-[#5a0820]'>
        {truncateString(url, 20)}
      </span>
    </>
  );
};

export {
  BotChatArrayHeader,
  BotChatArrayBox,
  BotChatArrayContent,
  BotChatArrayItem,
  BotChatArrayManualLink,
  BotChatArrayUrlDisplay,
};
