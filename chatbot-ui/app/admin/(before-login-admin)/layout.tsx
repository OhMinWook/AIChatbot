import { ReactNode } from 'react';

interface AdminBeforeLoginLayoutProps {
  children: ReactNode;
}

export default function AdminBeforeLoginLayout({
  children,
}: AdminBeforeLoginLayoutProps) {
  return <section className='w-full h-full'>{children}</section>;
}
