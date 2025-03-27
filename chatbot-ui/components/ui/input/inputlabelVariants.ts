import { cva } from 'class-variance-authority';

// 공통 스타일
export const inputLabelVariants = cva(
  'flex items-center gap-1.5 focus-visible:outline-none',
  {
    variants: {
      variant: {
        admin: 'grid h-[76px]',
        adminPw: 'grid h-[76px]',
        file: 'grid',
        manualImage: '',
      },
      labelPosition: {
        top: 'grid',
        right: 'flex-row-reverse',
        bottom: 'flex flex-col-reverse items-start',
        left: 'flex items-center',
      },
      labelType: {
        file: '',
        manualImage: '',
      },
    },
  },
);

// label 태그 스타일
export const labelVariants = cva('', {
  variants: {
    variant: {
      admin: 'h-[20px] text-[1.4rem]',
      adminPw: 'h-[20px] text-[1.4rem]',
      file: 'text-[1.6rem] flex items-center mb-[15px]',
      manualImage: 'text-[1.4rem] flex items-center',
    },
    labelFontSize: {
      '14': 'text-[1.4rem]',
      '16': 'text-[1.6rem]',
    },
    labelType: {
      file: 'flex items-center justify-center h-[75px] rounded-[4px] border border-customColor-primary1 bg-customColor-bg0 cursor-pointer text-[1.2rem] font-regular',
      manualImage:
        'h-[21px] px-[20.4px] text-[1.4rem] font-medium border border-customColor-gray1 rounded-[1px] bg-white cursor-pointer hover:bg-customColor-bg0',
    },
  },
});

// input 태그 스타일
export const inputVariants = cva('', {
  variants: {
    variant: {
      admin:
        'h-[48px] w-full pl-4 text-[1.6rem] bg-customColor-bg3 focus-visible:outline-none',
      adminPw:
        'h-[48px] w-full pl-4 text-[1.6rem] bg-customColor-bg3 focus-visible:outline-none',
      file: 'hidden',
      manualImage: 'hidden',
    },
    labelType: {
      file: '',
      manualImage: '',
    },
  },
});
