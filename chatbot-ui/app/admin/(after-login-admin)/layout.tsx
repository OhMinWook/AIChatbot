import { auth } from '@/auth';
import { Sidebar } from '@/components/layout/sidebar/Sidebar';
import { ReactNode } from 'react';

interface AdminAfterLoginLayoutProps {
  adminHeader: ReactNode;
  children: ReactNode;
}

export default async function AdminAfterLoginLayout({
  adminHeader,
  children,
}: AdminAfterLoginLayoutProps) {
  const session = await auth();

  return (
    <article className='flex h-screen flex-col md:flex-row'>
      {/*<section className='w-full md:h-full min-w-[210px] md:w-2/12'>*/}
      <section className='w-full md:h-full min-w-[310px] md:w-2/12 md:flex-shrink-0'>
        {/*<Sidebar />*/}
        <Sidebar session={session} />
      </section>
      <div className='grow box-border flex-col p-6 md:overflow-y-auto md:p-12 px-5 md:px-16 xl:px-32'>
        {/* adminHeader */}
        <section className='w-full h-auto md:h-1/6 flex items-center md:items-end '>
          <div className='w-full h-1/2'>{adminHeader}</div>
        </section>

        {/* children */}
        <section className='w-full h-3/4'>{children}</section>
      </div>
    </article>
  );
}
