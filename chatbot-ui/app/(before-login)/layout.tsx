import { ReactNode } from 'react';

interface UserBeforeLoginLayoutProps {
  children: ReactNode;
}

export default function UserBeforeLoginLayout({
  children,
}: UserBeforeLoginLayoutProps) {
  return <section className='w-full h-full'>{children}</section>;
}
