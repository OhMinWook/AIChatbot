import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

import Image from 'next/image';
import report from '@/assets/icons/chat/report.svg';
import star from '@/assets/icons/chat/star.svg';
import send from '@/assets/icons/chat/send.svg';
import plus from '@/assets/icons/admin/plus.svg';
import minus from '@/assets/icons/admin/minus.svg';
import logout from '@/assets/icons/sidebar/logout.svg';
import manualPlus from '@/assets/icons/dialog/manual-plus.svg';

const buttonVariants = cva(
  'text-xl px-[3px] inline-flex items-center justify-center whitespace-nowrap rounded-md  font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input rounded-xl bg-background ',

        // 선택
        select1:
          'bg-customColor-bg1 text-[1.6rem] text-customColor-gray2 font-medium rounded-[8px] hover:bg-[#eacfcf]',
        select2:
          'bg-customColor-gray1 text-[1.4rem] text-customColor-gray2 font-normal rounded-[12px] text-xl py-1 px-3 h-fit hover:bg-[#d4d4d4]',
        select3:
          'bg-customColor-gray1 text-[1.4rem] text-customColor-gray2 font-normal rounded-[12px] hover:hover:bg-[#d4d4d4]',

        // 등록
        enter1:
          'h-[56.89px] bg-customColor-primary2 text-[1.6rem] text-white font-bold rounded-[4px] hover:bg-[#ab1844]',
        enter2:
          'w-full text-[1.6rem] bg-customColor-primary2 text-white font-semibold rounded-[2px] hover:bg-[#ab1844]',
        enter3:
          'text-[1.6rem] bg-customColor-primary1 text-white font-medium rounded-[1px] hover:bg-[#b20a3c]',

        // 취소
        cancel1:
          'w-full text-[1.6rem] bg-white text-customColor-primary2 font-semibold rounded-[2px] border-2 border-customColor-primary2 hover:bg-customColor-bg0',

        // 삭제
        delete1:
          'bg-customColor-bg0 text-[1.6rem] text-customColor-primary2 font-medium border border-customColor-primary2 rounded-[2px] hover:bg-[#f5e8e8]',
        delete2:
          'bg-customColor-bg0 text-[1.6rem] text-customColor-primary2 font-medium border border-customColor-primary2 rounded-[1px] hover:bg-[#f5e8e8]',

        // 날짜 선택
        date1:
          'bg-customColor-bg0 text-[1.6rem] h-[44px] font-semibold border border-customColor-bg2 rounded-[4px] hover:bg-customColor-bg1_1',

        // 리스트
        list1:
          'bg-customColor-primary1 text-[1.6rem] text-white font-semibold rounded-[4px] hover:bg-[#b20a3c]',
        list2:
          'bg-customColor-bg3 text-[1.6rem] text-customColor-gray2 font-semibold border border-customColor-primary1 rounded-[4px] hover:bg-[#d4d4d4]',

        // 사이드 메뉴
        logout: 'font-medium flex justify-end',
        sideMenu: 'flex justify-between px-4',

        // 테이블
        pagination: 'min-w-10 text-customColor-black text-2xl font-medium',

        // 메뉴얼
        ok: 'h-[21px] px-[20.4px] text-[1.4rem] border border-customColor-gray1 rounded-[1px] bg-white hover:bg-customColor-bg0',
        edit: 'h-[21px] px-[20.4px] text-[1.4rem] border border-customColor-gray1 rounded-[1px] bg-white hover:bg-customColor-bg0',
        addData:
          'h-[34px] px-[18px] text-[1.4rem] text-customColor-gray1 border-[1.5px] border-customColor-gray1 rounded-[38px] hover:bg-[#eeeeee]',
        paginationText:
          'flex justify-center items-center space-x-2 border-0 text-2xl relative top-[-1px] px-5',
      },
      icon: {
        plus: '',
        minus: '',
        send: '',
        report: '',
        star: '',
        logout: '',
        manualPlus: '',
      },
    },
    // 기본 설정값
    defaultVariants: {
      variant: 'default',
    },
  },
);

// variant 타입
export type VariantType =
  | 'default'
  | 'select1'
  | 'select2'
  | 'select3'
  | 'enter1'
  | 'enter2'
  | 'enter3'
  | 'cancel1'
  | 'delete1'
  | 'delete2'
  | 'date1'
  | 'list1'
  | 'list2'
  | 'logout'
  | 'sideMenu'
  | 'pagination'
  | null
  | undefined;

// icon 타입
export type IconType =
  | 'plus'
  | 'minus'
  | 'send'
  | 'report'
  | 'star'
  | 'logout'
  | 'manualPlus'
  | null
  | undefined;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: IconType;
}

const iconMapping = {
  plus: { src: plus, className: 'w-[24px] h-[24px] mr-[16px]' },
  minus: { src: minus, className: 'w-[13.82px] h-[24px] mr-[25.27px]' },
  send: { src: send, className: 'w-[53.04px] h-[38.82px]' },
  report: { src: report, className: 'w-[14px] h-[14px] mr-[3.26px]' },
  star: { src: star, className: 'w-[14px] h-[14px] mr-[2.65px]' },
  logout: { src: logout, className: 'w-[24px] h-[24px] mr-[5px]' },
  manualPlus: { src: manualPlus, className: 'w-[11px] h-[11px] mr-[4px]' },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, icon, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    // iconMapping에서 해당 아이콘 정보 가져오기
    const iconData = icon ? iconMapping[icon] : null;

    return (
      <Comp
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {iconData && (
          <Image
            src={iconData.src}
            alt={`${icon}-icon`}
            className={iconData.className}
          />
        )}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
