import { ReactNode } from 'react';

interface UserAfterLoginLayoutProps {
  children: ReactNode;
}

export default function UserAfterLoginLayout({
  children,
}: UserAfterLoginLayoutProps) {
  return <section className='w-full h-full'>{children}</section>;
}
