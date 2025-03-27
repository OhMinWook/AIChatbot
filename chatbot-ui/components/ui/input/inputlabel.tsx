'use client';

import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

import {
  inputLabelVariants,
  inputVariants,
  labelVariants,
} from './inputlabelVariants';

import Image from 'next/image';
import eyeOn2 from '@/assets/icons/login/login-eye-on-2.svg';
import eyeOff2 from '@/assets/icons/login/login-eye-off-2.svg';
import upload1 from '@/assets/icons/dialog/input-upload-file1.svg';
import upload2 from '@/assets/icons/dialog/input-upload-file2.svg';

export interface InputLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputLabelVariants> {
  labelContent?: string;
  labelFontSize?: '14' | '16';
  filePlaceholder?: string;
  onImagePreview?: any;
  classNames?: {
    input?: string;
    label?: string;
  };
  required?: boolean;
  manualName?: string;
  setIsAlertOpen?: any;
  setAlertMessage?: any;
}

const InputLabel = React.forwardRef<HTMLInputElement, InputLabelProps>(
  (
    {
      className,
      classNames = {},
      labelPosition = 'top',
      variant = 'admin',
      labelType,
      labelFontSize = '14',
      type,
      labelContent,
      onImagePreview,
      filePlaceholder,
      required,
      onChange,
      manualName,
      setIsAlertOpen,
      setAlertMessage,
      ...props
    },
    ref,
  ) => {
    const [showPw, setShowPw] = React.useState<boolean>(false);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    const toggleShowPw = () => {
      setShowPw((prev) => !prev);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      await onChange(e);
    };

    switch (variant) {
      case 'adminPw':
        return (
          <div>
            <label
              htmlFor={props.id}
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
                {...props}
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

      case 'file':
        return (
          <div>
            <div>
              <label
                htmlFor={props.id}
                className={cn(labelVariants({ variant }), classNames.label)}
              >
                {labelContent}
                <Image
                  src={upload1}
                  alt='upload-icon1'
                  className='w-[13px] h-[13px] ml-[4px]'
                />
              </label>

              <label
                htmlFor={props.id}
                className={cn(
                  labelVariants({ variant, labelType }),
                  classNames.label,
                )}
              >
                <div className='flex flex-col items-center'>
                  <Image
                    src={upload2}
                    alt='upload-icon2'
                    className='w-[14px] h-[14px] mb-3'
                  />
                  {selectedFile ? selectedFile.name : filePlaceholder}
                </div>
              </label>
            </div>

            <input
              type='file'
              accept='.pdf'
              id={props.id}
              className={cn(inputVariants({ variant }), classNames.input)}
              ref={ref}
              onChange={handleFileChange}
              {...props}
            />
          </div>
        );

      case 'manualImage':
        return (
          <>
            <label
              htmlFor={props.id}
              className={cn(
                labelVariants({ variant, labelType }),
                classNames.label,
              )}
            >
              {filePlaceholder}
            </label>

            <input
              type='file'
              accept='image/*'
              id={props.id}
              onChange={handleFileChange}
              className={cn(inputVariants({ variant }), className)}
              ref={ref}
            />
          </>
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
          htmlFor={props.id}
          className={cn(
            labelVariants({
              variant,
              labelFontSize,
            }),
            classNames.label,
            { 'label-asterisk': required },
          )}
        >
          {labelContent}
        </label>
        <input
          type={type}
          className={cn(
            inputVariants({
              variant,
            }),
            classNames.input,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
InputLabel.displayName = 'InputLabel';

export { InputLabel };
