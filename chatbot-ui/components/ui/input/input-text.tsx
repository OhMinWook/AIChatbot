'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  inputLabelVariants,
  inputVariants,
  labelVariants,
} from './inputlabelVariants';
import { VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import Image from 'next/image';
import eyeOn2 from '@/assets/icons/login/login-eye-on-2.svg';
import eyeOff2 from '@/assets/icons/login/login-eye-off-2.svg';

export interface InputTextProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputLabelVariants>,
    VariantProps<typeof labelVariants>,
    VariantProps<typeof inputVariants> {
  labelContent: string;
  labelPosition?: 'top' | 'left' | 'right';
  labelFontSize?: any;
  classNames?: {
    input?: string;
    label?: string;
  };
  required?: boolean;
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  (
    {
      id,
      labelContent,
      labelPosition = 'top',
      variant = 'admin',
      labelFontSize = '14px',
      classNames = {},
      required = false,
      type = 'text', // 기본 input type을 'text'로 수정
      className,
      value, // value prop 추가
      ...rest
    },
    ref,
  ) => {
    const [showPw, setShowPw] = React.useState<boolean>(false);

    const toggleShowPw = () => {
      setShowPw((prev) => !prev);
    };

    switch (variant) {
      case 'adminPw':
        return (
          <div>
            <label
              className={cn(
                labelVariants({
                  variant,
                }),
                classNames.label,
                { 'label-asterisk': required },
              )}
            >
              {labelContent}
            </label>
            <div className='flex relative items-center'>
              <input
                type={showPw ? 'text' : 'password'}
                className={cn(
                  inputVariants({
                    variant,
                  }),
                )}
                ref={ref}
                {...rest}
              />
              <div
                className='absolute right-0 mr-3 w-[24px] h-[24px] cursor-pointer'
                onClick={toggleShowPw}
              >
                <Image
                  src={showPw ? eyeOn2 : eyeOff2}
                  alt={showPw ? 'eye-on-icon' : 'eye-off-icon'}
                />
              </div>
            </div>
          </div>
        );
    }

    return (
      <div
        className={cn(
          inputLabelVariants({
            labelPosition,
            variant,
          }),
          'w-full',
          className,
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            labelVariants({
              variant,
              labelFontSize,
            }),
            { 'label-asterisk': required },
          )}
        >
          {labelContent}
        </label>
        <input
          id={id}
          type={type}
          className={cn(
            'disabled:cursor-not-allowed',
            inputVariants({
              variant,
            }),
          )}
          ref={ref}
          required={required}
          value={value ?? ''} // value가 undefined일 경우 빈 문자열로 설정
          {...rest}
        />
      </div>
    );
  },
);

InputText.displayName = 'InputText'; // 디스플레이 네임 설정

export default InputText;
