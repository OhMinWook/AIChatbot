'use client';

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { InputLabel } from '@/components/ui/input/inputlabel';
import { DialogClose } from '@radix-ui/react-dialog';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { createAdminManualPreprocessingAction } from '@/actions/admin-manual-action';

import ManualAlert from './manual-alert';
import BeatLoader from 'react-spinners/BeatLoader';
import InputText from '@/components/ui/input/input-text';
import { useEscapeHandlerStore } from '@/store/use-escape-handler-store';
import { usePathname, useRouter } from 'next/navigation';

// 유효성 검사 (수정 필요)
const formSchema = z.object({
  file: z.any(),
  exclusion: z.string().optional(),
  pattern1: z.string().optional(),
  pattern2: z.string().optional(),
  pattern1_1: z.string().optional(),
});

interface DialogAdminRegisterProps {
  onSuccess: () => void;
  setPreprocessId: Dispatch<SetStateAction<number | undefined>>;
}

export default function DialogAdminRegister({
  onSuccess,
  setPreprocessId,
}: DialogAdminRegisterProps) {
  // store
  const setOnEscapeKeyDown = useEscapeHandlerStore(
    (state) => state.setOnEscapeKeyDown,
  );
  const clearOnEscapeKeyDown = useEscapeHandlerStore(
    (state) => state.clearOnEscapeKeyDown,
  );

  // util
  const router = useRouter();
  const pathname = usePathname();

  // state
  const [imageFile, setImageFile] = useState<any>('');
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [responseFileName, setResponseFileName] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setIsLoading(false);
      return;
    }

    const selectedFiles = Array.from(e.target.files);

    setImageFile(e.target.files[0]);
    setResponseFileName(e.target.files[0].name);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!imageFile) return;
    setIsLoading(true);

    const dataToSend = {
      pattern1: values.pattern1!,
      pattern1_1: values.pattern1_1 || null,
      pattern2: values.pattern2!,
      exclude: values.exclusion!,
    };

    const formData = new FormData();

    formData.append('manual_file', imageFile, imageFile.name);
    formData.append('pattern', JSON.stringify(dataToSend));

    const createResponse = await createAdminManualPreprocessingAction(formData);

    if (createResponse.error) {
      setIsAlertOpen(true);
      setIsLoading(false);
      setErrorMessage(createResponse.message);
      return;
    }

    setPreprocessId(createResponse.data!);
    setIsLoading(false);
    onSuccess();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      e.preventDefault();
    };

    // 핸들러 설정
    if (isLoading) {
      setOnEscapeKeyDown(handleEscape);
    }

    // 컴포넌트 언마운트 시 핸들러 정리
    return () => {
      clearOnEscapeKeyDown();
    };
  }, [setOnEscapeKeyDown, clearOnEscapeKeyDown, isLoading]);

  useEffect(() => {
    // 페이지 새로고침 감지
    const handleBeforeUnload = async (event: any) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // 정리 함수
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname, router]);

  return (
    <div className='w-full overflow-y-auto'>
      {isLoading ? (
        <div className='absolute top-0 w-full h-full bg-white z-50 bg-opacity-50 flex justify-center items-center'>
          <BeatLoader
            color={'#c92f5c'}
            loading={true}
            size={30}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        </div>
      ) : null}

      <div className='mb-[32px] z-10 w-full h-full'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <article className='md:px-[40px] px-7 flex flex-col space-y-8'>
              <fieldset className='relative mt-[50px]'>
                <FormField
                  control={form.control}
                  name='file'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputLabel
                          variant='file'
                          labelType='file'
                          labelContent='업로드파일'
                          filePlaceholder={
                            responseFileName ||
                            '파일을 선택해주세요 (PDF 파일만 가능합니다)'
                          }
                          {...field}
                          onChange={(e) => handleChange(e)}
                        />
                      </FormControl>
                      <FormMessage className='absolute' />
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative'>
                <FormField
                  control={form.control}
                  name='exclusion' // 제외 페이지
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          labelContent='제외 페이지(표지 및 기타 패턴)'
                          variant='admin'
                          labelFontSize='16'
                          placeholder='해당하는 페이지를 입력해 주세요 ( ex) 1, 2~3 )'
                          disabled={responseFileName === ''}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='absolute' />
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative'>
                <FormField
                  control={form.control}
                  name='pattern1' // 패턴1 페이지
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          labelContent='패턴1 페이지'
                          variant='admin'
                          labelFontSize='16'
                          placeholder='6~11, 25~30'
                          disabled={responseFileName === ''}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='absolute' />
                    </FormItem>
                  )}
                />
              </fieldset>

              <fieldset className='relative'>
                <FormField
                  control={form.control}
                  name='pattern2' // // 패턴3 페이지
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          labelContent='패턴2 페이지'
                          variant='admin'
                          labelFontSize='16'
                          placeholder='31~32'
                          disabled={responseFileName === ''}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='absolute' />
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative mb'>
                <FormField
                  control={form.control}
                  name='pattern1_1' // 패턴1-1 페이지
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          labelContent='패턴1-1 페이지'
                          variant='admin'
                          labelFontSize='16'
                          placeholder='22~24, 33~40'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='absolute' />
                    </FormItem>
                  )}
                />
              </fieldset>
            </article>

            <footer className='relative flex justify-center mt-[31.5px] border-customColor-bg1_1 border-t-[1px]'>
              <section className='flex justify-center md:w-[300px] w-96 md:h-[48px] h-16 gap-[16px] mt-[22px] mb-[32.2px]'>
                <Button
                  type='submit'
                  variant='enter2'
                  className='w-72'
                  disabled={responseFileName === ''}
                >
                  전처리 시작
                </Button>
                <DialogClose asChild>
                  <Button type='button' variant='cancel1' className='w-72'>
                    취소
                  </Button>
                </DialogClose>
              </section>
            </footer>
          </form>
        </Form>
        <ManualAlert
          description={errorMessage}
          cancelButton={{
            variant: 'cancel1',
            text: '닫기',
            className: '',
          }}
          isOpen={isAlertOpen}
          setIsOpen={setIsAlertOpen}
        />
      </div>
    </div>
  );
}
