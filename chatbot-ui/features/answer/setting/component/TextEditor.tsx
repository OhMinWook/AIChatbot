'use client';

import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { updateAnswerAction } from '@/actions/admin-answer';

const QuillWrapper = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    ['bold'],
    [
      { align: '' },
      { align: 'center' },
      { align: 'right' },
      { align: 'justify' },
    ],
  ],
};

interface Props {
  answerData: string;
}

export default function TextEditor({ answerData }: Props) {
  const [isEdit, setEdit] = useState<boolean>(false);
  const [value, setValue] = useState(answerData);
  const [tempValue, setTempValue] = useState(answerData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const answerSettingAction = async () => {
      const params = {
        answer_content: value,
      };
  
      try {
        const updateAnswer = await updateAnswerAction(params);
        if (updateAnswer.error) return;
  
      } catch(error) {
        console.error('Unexpected error occurred:', error);
      } 
    };
    
    if (value !== answerData) {
      answerSettingAction();
    }
  }, [value, answerData]);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const clickHandler = () => {
    setValue(tempValue);
    setEdit(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <article className='w-full h-[400px]'>
      {value && (
        <section className='w-full mb-4 border border-customColor-bg2 rounded'>
          <div className='px-3 py-3 md:px-5 md:py-4 border-b border-b-customColor-bg2 flex items-center justify-between'>
            <p className='text-[14px] md:text-[16px] font-bold'>답변설정내용</p>
            <div className='md:hidden'>
              <Button
                variant='delete2'
                className='px-7 py-2 text-[14px] font-medium rounded-[2px]'
                onClick={() => setEdit(true)}
              >
                수정
              </Button>
            </div>
          </div>
          <div className='px-3 py-3 md:px-5 md:py-4 overflow-hidden'>
            <p
              className='text-[12px] md:text-[16px]'
              dangerouslySetInnerHTML={{ __html: value }}
            ></p>

            <div className='hidden md:flex md:justify-end'>
              <Button
                variant='delete2'
                className='px-20 py-5 text-[16px] font-bold'
                onClick={() => setEdit(true)}
              >
                수정
              </Button>
            </div>
          </div>
        </section>
      )}

      {(isEdit || !value) && (
        <section className=''>
          <div className='w-full rounded bg-customColor-bg0'>
            <QuillWrapper
              theme='snow'
              modules={modules}
              placeholder='입력해주세요..'
              value={tempValue}
              onChange={setTempValue}
            />
          </div>
          <div className='flex justify-center mt-5'>
            <Button
              variant='enter3'
              className='px-7 py-2 text-[14px] font-medium rounded-[2px] md:px-20 md:py-5 md:text-[1.6rem] md:font-bold'
              onClick={clickHandler}
            >
              등록
            </Button>
          </div>
        </section>
      )}
    </article>
  );
}
