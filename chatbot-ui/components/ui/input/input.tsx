'use client';

import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

import Image from 'next/image';
import loginId from '@/assets/icons/login/login-id.svg';
import loginPw from '@/assets/icons/login/login-locked.svg';
import eyeOn1 from '@/assets/icons/login/login-eye-on-1.svg';
import eyeOff1 from '@/assets/icons/login/login-eye-off-1.svg';

const inputVariants = cva(
  'flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
  {
    variants: {
      variant: {
        inputId:
          'h-[30px] text-[1.6rem] pl-[39px] border-0 border-b-[1px] border-[#B0B0B0] outline-none placeholder:text-[#B0B0B0]',
        inputPw:
          'h-[30px] text-[1.6rem] pl-[39px] border-0 border-b-[1px] border-[#B0B0B0] outline-none placeholder:text-[#B0B0B0]',
        manual:
          'min-h-[32px] pl-[16px] bg-transparent text-[1.4rem] focus-visible:outline-none border-none font-light',
      },
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  labelContent?: string;
  labelPosition?: 'top' | 'right' | 'left' | 'bottom';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      labelContent,
      labelPosition,
      required,
      ...props
    },
    ref,
  ) => {
    const [showPw, setShowPw] = React.useState<boolean>(false);

    const toggleShowPw = () => {
      setShowPw((prev) => !prev);
    };

    const renderInputWithIcon = (
      placeholder: string,
      iconSrc: string,
      isPassword: boolean,
    ) => (
      <div className='relative flex items-center w-full'>
        <Image
          src={iconSrc}
          alt={`${placeholder}-icon`}
          className='absolute top-1 w-[24px] h-[24px]'
        />
        <input
          type={isPassword ? (showPw ? 'text' : 'password') : 'text'}
          placeholder={placeholder}
          className={cn(
            inputVariants({
              variant,
            }),
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <div
            className='absolute right-0 mr-3 w-[24px] h-[24px] cursor-pointer'
            onClick={toggleShowPw}
          >
            <Image
              src={showPw ? eyeOn1 : eyeOff1}
              alt={showPw ? 'show-password-icon' : 'hide-password-icon'}
            />
          </div>
        )}
      </div>
    );

    switch (variant) {
      case 'inputId':
        return renderInputWithIcon('아이디', loginId, false);
      case 'inputPw':
        return renderInputWithIcon('비밀번호', loginPw, true);
    }

    return (
      <input
        type={type}
        className={cn(
          inputVariants({
            variant,
          }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
