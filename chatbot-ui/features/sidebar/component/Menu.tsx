'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { menuList, MenuType, SubMenuType } from '@/const/menu-list';
import { Session } from 'next-auth';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ALL_DATE } from '@/const/date-const';
import { usePathname } from 'next/navigation';

interface SideMenuProps {
  setIsToggleOpen: (isOpen: boolean) => void;
  session: Session | null;
}

export function SideMenu({ setIsToggleOpen, session }: SideMenuProps) {
  // date
  const today = new Date();
  const formattedToday = format(today, 'yyyyMMdd');
  const formattedAllDay = format(ALL_DATE, 'yyyyMMdd');

  const authMenuList = session?.user.authMenuList!;

  const filteredMenuList = useMemo(() => {
    return menuList.filter((menu) =>
      authMenuList.includes(menu.authMenuKey || ''),
    );
  }, [authMenuList]);

  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const menuPathname = '/' + pathSegments.slice(0, 3).join('/');

  const defaultOpenKeys = filteredMenuList
    .filter((menu) => menu.key === pathSegments[1])
    .map((menu) => menu.key);

  // state
  const [openKeys, setOpenKeys] = useState<string>(defaultOpenKeys[0]);

  useEffect(() => {
    const newPathSegments = pathname.split('/').filter(Boolean);
    const newDefaultOpenKeys = filteredMenuList
      .filter((menu) => menu.key === newPathSegments[1])
      .map((menu) => menu.key);

    setOpenKeys(newDefaultOpenKeys[0]);
  }, [pathname, filteredMenuList]);

  return (
    <>
      <Accordion type='single' collapsible value={openKeys}>
        {filteredMenuList.map((menu: MenuType, idx: number) => (
          <AccordionItem key={idx} value={menu.key} className='px-5'>
            <AccordionTrigger
              className={cn(
                buttonVariants({
                  variant: 'sideMenu',
                }),
              )}
              onClick={() => setOpenKeys(menu.key)}
            >
              <div className='flex items-center'>
                <Image className='mr-3' src={menu.icon} alt='home icon' />
                <h6
                  className={`text-[16px] md-text-[14px] font-semibold ${menu.key === pathSegments[1] ? 'text-customColor-primary2' : ''}`}
                >
                  {menu.label}
                </h6>
              </div>
            </AccordionTrigger>

            {menu.subMenuList &&
              menu.subMenuList.map((subMenu: SubMenuType, subIdx: number) => {
                const subMenuSegments = subMenu.route
                  .split('/')
                  .filter(Boolean);
                const subMenuPathname =
                  '/' + subMenuSegments.slice(0, 3).join('/');

                return (
                  <Link
                    key={subIdx}
                    href={{
                      pathname: subMenu.route,
                      ...(subMenu.searchParams && {
                        query: {
                          startDate: formattedAllDay,
                          endDate: formattedToday,
                        },
                      }),
                    }}
                  >
                    <AccordionContent>
                      <div
                        onClick={() => setIsToggleOpen(false)}
                        className={cn(
                          'w-full h-full text-2xl leading-none',
                          menuPathname === subMenuPathname
                            ? 'font-bold text-customColor-primary2'
                            : '',
                        )}
                      >
                        - {subMenu.label}
                      </div>
                    </AccordionContent>
                  </Link>
                );
              })}
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
