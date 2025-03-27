'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sidenav } from '@/features/sidebar/component/Sidenav';
import { Session } from 'next-auth';
import MenuBtn from '@/assets/icons/sidebar/menu_button.svg';

interface SidebarProps {
  session: Session | null;
}

export function Sidebar({ session }: SidebarProps) {
  const [isToggleOpen, setIsToggleOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsToggleOpen(false);
        setIsMobile(true);
      } else {
        setIsToggleOpen(true);
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleToggleOpen = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  const mobileHandleToggle = (isOpen: boolean) => {
    setIsToggleOpen(isOpen);
  };

  const DesktopSidebarOpen = () => {
    setIsToggleOpen(isToggleOpen);
  };

  const userName = session?.user?.email;

  return (
    <>
      <article className='h-full'>
        {/* 모바일 헤더 */}
        <section
          className={`${
            isToggleOpen ? 'hidden' : 'flex'
          } md:hidden w-full p-6 justify-between border-b`}
        >
          <Image
            src={MenuBtn}
            alt='menu toggle button'
            className='cursor-pointer'
            onClick={handleToggleOpen}
          />
        </section>

        <section
          className={`${
            isToggleOpen ? 'flex' : 'hidden'
          } z-40 fixed md:relative h-full bg-red-500`}
        >
          <div className='w-[320px] h-full md:w-full z-50  flex-none border-r'>
            <Sidenav
              setIsToggleOpen={
                isMobile ? mobileHandleToggle : DesktopSidebarOpen
              }
              userName={userName!}
              session={session}
            />
          </div>
          <div
            className='flex grow w-full h-full fixed md:hidden md:relative bg-customColor-black opacity-30'
            onClick={handleToggleOpen}
          />
        </section>
      </article>
    </>
  );
}
