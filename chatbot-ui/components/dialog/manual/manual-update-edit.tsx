'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { Form } from '@/components/ui/form';
import { adminManualFormSchema } from '@/const/zod/admin-manual-form-zod';
import {
  addAdminManualCollectionAction,
  createAdminManualCollectionAction,
  getAdminManualByIdAction,
  getAdminManualPreprocessByIdAction,
} from '@/actions/admin-manual-action';
import ManualAlert from './manual-alert';
import BeatLoader from 'react-spinners/BeatLoader';
import UpdateSection from './update-section';
import EditSection from './edit-section';
import { getAddedPages, getUpdatePages } from '@/lib/form-page-util';
import { usageErrorMessage } from '@/const/error-message';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useEscapeHandlerStore } from '@/store/use-escape-handler-store';

type AdminFormData = z.infer<typeof adminManualFormSchema>;

interface DialogManualUpdateEditProps {
  typeId?: number;
  updateType: 0 | 1;
  refetchFn?: () => void;
  onClose?: any;
}

export interface NewImageList {
  file: File;
  dataId: number;
  addIndex?: number;
}

export default function DialogManualUpdateEdit({
  typeId,
  updateType,
  onClose,
  refetchFn,
}: DialogManualUpdateEditProps) {
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

  // serach params
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // scroll
  const formEndRef = useRef<HTMLDivElement>(null);
  const targetSectionRef = useRef<HTMLDivElement>(null);

  // state
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [newImageList, setNewImageList] = useState<NewImageList[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // form
  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminManualFormSchema),
    defaultValues: {
      manual_name: '',
      page: [
        {
          dataId: undefined,
          source: '',
          subject: '',
          content: '',
          image_path: '',
        },
      ],
    },
  });

  const {
    getValues,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setFocus,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'page',
  });

  const handleAppend = () => {
    append({
      dataId: 0,
      source: '',
      subject: '',
      content: '',
      image_path: '',
      addIndex: Date.now(),
    });
  };

  const createManualCollection = async (requestFormData: FormData) => {
    let error = false;
    let errorMessage = '';

    const requestParams =
      updateType === 0 ? { set_id: typeId! } : { manual_id: typeId! };

    let response;

    if (updateType === 0) {
      response = await createAdminManualCollectionAction(
        requestParams,
        requestFormData,
      );
    } else {
      response = await addAdminManualCollectionAction(
        requestParams,
        requestFormData,
      );
    }

    if (response.error) {
      error = true;
      errorMessage = response.message;
    }

    return { error, errorMessage };
  };

  const onSubmit: SubmitHandler<AdminFormData> = async (formData) => {
    setIsPending(true);

    const updatePages = getUpdatePages(formData);
    const addedPages = getAddedPages(formData);

    const requestFormData = new FormData();

    requestFormData.append('updated_pages', JSON.stringify(updatePages));
    requestFormData.append('added_pages', JSON.stringify(addedPages));

    newImageList.forEach((image) => {
      let fileName;
      if (image.addIndex === undefined) {
        fileName = `${image.dataId}_${image.file.name}`;
        requestFormData.append('image_files', image.file, fileName);
        return;
      }

      const matchingPage = addedPages.added_pages.find(
        (page) => page.addIndex === image.addIndex,
      );

      fileName = matchingPage
        ? `added_${matchingPage.id}_${image.file.name}`
        : `added_${image.dataId}_${image.file.name}`;
      requestFormData.append('image_files', image.file, fileName);
    });

    // 확인용
    // requestFormData.forEach((value, key) => {
    //   console.log(key, value);
    // });

    const createManual = await createManualCollection(requestFormData);

    if (createManual.errorMessage === usageErrorMessage) {
      setIsPending(false);
      setIsSuccess(true);
      setAlertMessage(createManual.errorMessage);
      setIsAlertOpen(true);
      return;
    }

    if (createManual.error) {
      setAlertMessage(createManual.errorMessage);
      setIsAlertOpen(true);
      setIsPending(false);
      return;
    }

    setIsPending(false);
    setIsSuccess(true);
    setAlertMessage('성공적으로 저장되었습니다!');
    setIsAlertOpen(true);

    if (refetchFn) {
      refetchFn();
    } else {
      queryClient.refetchQueries({
        queryKey: ['manual-list', startDate, endDate],
      });
    }
  };

  const onError: SubmitErrorHandler<AdminFormData> = (errors) => {
    setAlertMessage('Content는 빈 값이 될 수 없습니다.');
    setIsAlertOpen(true);
  };

  const handleSuccess = () => {
    if (isSuccess) onClose();
  };

  const handleRemoveField = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let response;

      if (updateType === 0) {
        response = await getAdminManualPreprocessByIdAction(typeId!);
      } else {
        response = await getAdminManualByIdAction(typeId!);
      }

      if (response.error) {
        setIsLoading(false);
        setIsDataLoaded(true);
        return;
      }

      reset({
        manual_name: response.data.manual_name,
        page: response.data.page.map((page) => ({
          dataId: page.id,
          source: page.source || '',
          subject: page.subject,
          content: page.content,
          image_path: page.image_path || '',
        })),
      });

      setIsLoading(false);
      setIsDataLoaded(true);
    };

    if (!isPending && !isSuccess) {
      fetchData();
    }
  }, [typeId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      e.preventDefault();
    };

    // 핸들러 설정
    if (isPending) {
      setOnEscapeKeyDown(handleEscape);
    }

    // 컴포넌트 언마운트 시 핸들러 정리
    return () => {
      clearOnEscapeKeyDown();
    };
  }, [setOnEscapeKeyDown, clearOnEscapeKeyDown, isPending]);

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

  useEffect(() => {
    if (isDataLoaded && updateType === 1 && targetSectionRef.current) {
      const formElement = targetSectionRef.current.closest('form');
      if (formElement) {
        const targetTop = targetSectionRef.current.offsetTop - 130;
        formElement.scrollTo({
          top: targetTop,
          behavior: 'instant',
        });
      }
    }
  }, [isDataLoaded]);

  return (
    <>
      <Form {...form}>
        <form
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          onSubmit={handleSubmit(onSubmit, onError)}
          className='w-full pb-32 overflow-y-scroll'
        >
          <header className='w-full flex h-20 bg-customColor-bg0 text-[1.2rem] font-semibold absolute top-32 z-30'>
            <div className='w-24 min-w-20 border-r border-customColor-gray1 flex flex-col justify-center items-center'>
              <p>메뉴얼</p>
              <p>번호</p>
            </div>
            <div className='flex justify-between w-full items-center text-[1.4rem]'>
              <div className='flex-1 text-center'>
                업로드 파일: {getValues('manual_name')}
              </div>
              <div className='md:block hidden flex-1 text-center'>
                해당 이미지
              </div>
            </div>
          </header>

          {(isPending || isLoading) && (
            <div className='absolute top-0 w-full h-full bg-white z-50 bg-opacity-50 flex justify-center items-center'>
              <BeatLoader
                color={'#c92f5c'}
                loading={true}
                size={30}
                aria-label='Loading Spinner'
                data-testid='loader'
              />
            </div>
          )}

          <article
            className={`pt-20 pb-[29px] w-full p-0 overflow-x-auto ${isDataLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            {fields.map((field, index) =>
              field.dataId === 0 ? (
                <EditSection
                  key={field.id}
                  control={control}
                  index={index}
                  setValue={setValue}
                  sectionId={field.dataId}
                  manualName={getValues('manual_name')}
                  setIsAlertOpen={setIsAlertOpen}
                  setAlertMessage={setAlertMessage}
                  errors={errors.page?.[index]}
                  handleRemoveField={handleRemoveField}
                  updateType={updateType}
                  typeId={typeId!}
                  setNewImageList={setNewImageList}
                />
              ) : (
                <UpdateSection
                  key={field.id}
                  control={control}
                  index={index}
                  setValue={setValue}
                  sectionId={field.dataId}
                  setAlertMessage={setAlertMessage}
                  setIsAlertOpen={setIsAlertOpen}
                  manualName={getValues('manual_name')}
                  update_type={updateType}
                  setNewImageList={setNewImageList}
                  ref={field.dataId === typeId ? targetSectionRef : null}
                />
              ),
            )}
            <div ref={formEndRef} />
          </article>

          <footer className='absolute bottom-0 w-full h-44 bg-customColor-bg0 border-customColor-bg1_1 flex flex-col justify-center items-center space-y-5'>
            {/* 페이지 추가 버튼 */}
            <section className='flex justify-center items-center'>
              <Button
                type='button'
                variant='addData'
                icon='manualPlus'
                onClick={handleAppend}
              >
                데이터 추가
              </Button>
            </section>

            <section className='flex justify-center items-center space-x-3 md:w-[300px] w-[240px]'>
              <Button type='submit' variant='enter2' className='h-16'>
                저장
              </Button>

              <DialogClose asChild>
                <Button type='button' variant='cancel1' className='h-16'>
                  취소
                </Button>
              </DialogClose>
            </section>
          </footer>
        </form>
      </Form>
      <ManualAlert
        description={alertMessage}
        cancelButton={{
          variant: 'cancel1',
          text: '닫기',
          className: '',
        }}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
