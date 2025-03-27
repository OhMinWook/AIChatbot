'use client';

import { ChangeEvent, useState } from 'react';
import {
  Control,
  Controller,
  useFormContext,
  UseFormSetValue,
} from 'react-hook-form';
import { FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input/input';
import { InputLabel } from '@/components/ui/input/inputlabel';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { adminManualFormSchema } from '@/const/zod/admin-manual-form-zod';
import { NewImageList } from './manual-update-edit';

export type sectionFormData = z.infer<typeof adminManualFormSchema>;

interface EditSectionProps {
  control: Control<sectionFormData>;
  index: number;
  setValue: UseFormSetValue<sectionFormData>;
  sectionId?: number;
  manualName?: string;
  setIsAlertOpen?: any;
  setAlertMessage?: any;
  errors?: any;
  handleRemoveField: (index: number) => void;
  updateType: 0 | 1;
  typeId: number;
  setNewImageList: any;
}

const EditSection: React.FC<EditSectionProps> = ({
  control,
  index,
  setValue,
  sectionId,
  manualName,
  setIsAlertOpen,
  setAlertMessage,
  errors,
  handleRemoveField,
  updateType,
  typeId,
  setNewImageList,
}) => {
  const { getValues } = useFormContext<sectionFormData>();

  const [isEditing, setIsEditing] = useState({
    source: false,
    subject: false,
    content: false,
  });

  const [originalValues, setOriginalValues] = useState({
    source: '',
    subject: '',
    content: '',
  });

  const [tempValues, setTempValues] = useState({
    source: '',
    subject: '',
    content: '',
  });

  const handleEdit = (
    fieldName: keyof typeof isEditing,
    currentValue: string,
  ) => {
    setTempValues((prev) => ({ ...prev, [fieldName]: currentValue }));
    setIsEditing((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleConfirm = (fieldName: keyof typeof isEditing) => {
    setIsEditing((prev) => ({ ...prev, [fieldName]: false }));
    setValue(`page.${index}.${fieldName}`, tempValues[fieldName]);
  };

  const handleCancel = (fieldName: keyof typeof isEditing) => {
    setIsEditing((prev) => ({ ...prev, [fieldName]: false }));
    setTempValues((prev) => ({
      ...prev,
      [fieldName]: originalValues[fieldName],
    }));
  };

  const handleImagePreview = (url: string) => {
    setValue(`page.${index}.image_path`, url);
  };

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    field: any,
  ) => {
    const files = e.target.files;

    if (!files) {
      console.log('이미지 파일 업로드 실패');
      return;
    }

    const file = files[0];

    const fileURL = URL.createObjectURL(file);
    handleImagePreview(fileURL);

    setNewImageList((prev: NewImageList[]) => {
      if (sectionId !== 0) {
        return prev;
      }

      const existingIndex = prev.findIndex((item) => item.addIndex === index);

      if (existingIndex === -1) {
        return [
          ...prev,
          {
            file,
            dataId: sectionId,
            addIndex: getValues(`page.${index}.addIndex`),
          },
        ];
      }

      const updatedList = [...prev];
      updatedList[existingIndex] = {
        file,
        dataId: sectionId,
        addIndex: getValues(`page.${index}.addIndex`),
      };
      return updatedList;
    });
  };

  const handleRemoveAddData = async () => {
    setNewImageList((prev: NewImageList[]) =>
      prev.filter(
        (item) => item.addIndex !== getValues(`page.${index}.addIndex`),
      ),
    );
    handleRemoveField(index);
  };

  return (
    <section className='w-full flex border-b-1 border-customColor-gray1'>
      <div className='flex flex-col w-24 min-w-20 text-[12px] border-r-1 border-customColor-gray1 font-semibold justify-center items-center'>
        <p>{sectionId}</p>
      </div>
      <article className='w-full flex flex-col'>
        <div className='grid md:grid-cols-2 grid-rows-1 gap-1 w-full'>
          {/* 왼쪽 컬럼: Source, Subject, Content */}
          <div className=' w-full h-full flex flex-col justify-between p-10'>
            {/* source 필드 */}
            <fieldset className='w-full flex flex-col'>
              <Controller
                control={control}
                name={`page.${index}.source`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex items-start md:flex-row flex-col'>
                        <div className='flex md:px-[13.875px] px-1 py-[3px] text-center items-center text-[1.6rem] font-semibold md:border border-0 rounded-[4px] border-customColor-bg3 mr-[9px]'>
                          source
                        </div>

                        {isEditing.source ? (
                          <div className='flex items-center w-full border border-customColor-gray1 rounded-[4px] bg-white'>
                            <Input
                              value={tempValues.source}
                              onChange={(e) =>
                                setTempValues((prev) => ({
                                  ...prev,
                                  source: e.target.value,
                                }))
                              }
                              variant='manual'
                              className='flex-1'
                              placeholder='Source를 입력하세요'
                            />
                            <button
                              type='button'
                              className='mr-[7.8px] h-[21px] px-[20.4px] text-[1.4rem] border border-customColor-gray1 rounded-[1px] bg-customColor-bg'
                              onClick={() => handleConfirm('source')}
                            >
                              확인
                            </button>
                            <Button
                              type='button'
                              variant='ok'
                              className='mr-[15.2px]'
                              onClick={() => handleCancel('source')}
                            >
                              취소
                            </Button>
                          </div>
                        ) : (
                          <div className='flex items-center w-full border rounded-[4px] border-customColor-bg3'>
                            <Input
                              variant='manual'
                              disabled
                              {...field}
                              placeholder='Source를 입력하세요'
                              className='flex-1'
                            />
                            <Button
                              variant='edit'
                              className='mr-[15px]'
                              onClick={() =>
                                handleEdit('source', field.value || '')
                              }
                            >
                              수정
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            {/* subject 필드 */}
            <fieldset className=''>
              <Controller
                control={control}
                name={`page.${index}.subject`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='items-start flex md:flex-row flex-col'>
                        <div className='flex md:px-[11.5px] px-1 py-[3px] text-center items-center text-[1.6rem] font-semibold md:border border-0 rounded-[4px] border-customColor-bg3 mr-[9px]'>
                          subject
                        </div>
                        <div className='flex items-center w-full'>
                          {isEditing.subject ? (
                            <div className='flex items-center w-full border border-customColor-gray1 rounded-[4px] bg-white'>
                              <Input
                                value={tempValues.subject}
                                onChange={(e) =>
                                  setTempValues((prev) => ({
                                    ...prev,
                                    subject: e.target.value,
                                  }))
                                }
                                variant='manual'
                                className='flex-1'
                                placeholder='Subject를 입력하세요'
                              />
                              <Button
                                type='button'
                                variant='ok'
                                className='mr-[7.8px]'
                                onClick={() => handleConfirm('subject')}
                              >
                                확인
                              </Button>
                              <Button
                                type='button'
                                variant='ok'
                                className='mr-[15.2px]'
                                onClick={() => handleCancel('subject')}
                              >
                                취소
                              </Button>
                            </div>
                          ) : (
                            <div className='flex items-center w-full border rounded-[4px] border-customColor-bg3'>
                              <Input
                                variant='manual'
                                disabled
                                {...field}
                                placeholder='Subject를 입력하세요'
                                className='flex-1'
                              />
                              <Button
                                type='button'
                                variant='edit'
                                className='mr-[15px]'
                                onClick={() =>
                                  handleEdit('subject', field.value || '')
                                }
                              >
                                수정
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            {/* Content 필드 */}
            <fieldset>
              <Controller
                control={control}
                name={`page.${index}.content`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='items-start flex md:flex-row flex-col'>
                        <div className='flex md:px-[5.9px] px-1 h-[32px] text-center items-center text-[1.6rem] font-semibold md:border border-0 rounded-[4px] border-customColor-bg3 mr-[9px]'>
                          content
                          <span className='text-red-500'>*</span>
                        </div>
                        {isEditing.content ? (
                          <div className='flex relative items-center w-full  rounded-[4px]'>
                            <textarea
                              value={tempValues.content}
                              onChange={(e) =>
                                setTempValues((prev) => ({
                                  ...prev,
                                  content: e.target.value,
                                }))
                              }
                              className='flex-1 pl-[16px] min-h-[171px] border rounded-[4px] p-2 text-[1.4rem] resize-none outline-none'
                              placeholder='Content를 입력하세요'
                            />
                            <div className='absolute bottom-0 right-0 mb-[11px]'>
                              <Button
                                type='button'
                                variant='ok'
                                className='mr-[7.8px]'
                                onClick={() => handleConfirm('content')}
                              >
                                확인
                              </Button>
                              <Button
                                type='button'
                                variant='ok'
                                className='mr-[15.2px]'
                                onClick={() => handleCancel('content')}
                              >
                                취소
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className='flex relative items-center w-full  rounded-[4px] '>
                            <textarea
                              disabled
                              {...field}
                              placeholder='Content를 입력하세요'
                              className={`flex-1 pl-[16px] min-h-[171px] bg-white border ${errors && 'border-red-500'} rounded-[4px] p-2 text-[1.4rem] resize-none outline-none`}
                            />
                            <Button
                              type='button'
                              variant='edit'
                              className='absolute bottom-0 right-0 mr-[15px] mb-[11px]'
                              onClick={() => handleEdit('content', field.value)}
                            >
                              수정
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>

          {/* 오른쪽 컬럼: Image 필드 */}
          <div className='w-full p-10'>
            {/* image 필드 */}
            <fieldset>
              <Controller
                control={control}
                name={`page.${index}.image_path`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='relative flex md:justify-start justify-center w-full md:h-[274px] h-[280px] rounded-[4px] bg-customColor-bg3'>
                        {/* 이미지 미리보기 */}
                        <figure className='md:mt-[12px] md:mr-[116px] mr-[5px] md:mb-[12px] md:ml-[16px] ml-[5px] flex justify-center'>
                          {field.value && (
                            <img
                              src={field.value}
                              alt={'img' + field.value}
                              style={{
                                width: 'auto',
                                height: '238px',
                              }}
                              className='mt-2 md:w-full md:h-auto h-fit md:max-h-max max-h-[235px]'
                            />
                          )}
                        </figure>
                        <div className='absolute right-[15px] bottom-[10px]'>
                          {/* 이미지 업로드 컴포넌트 */}
                          <InputLabel
                            variant='manualImage'
                            labelType='manualImage'
                            filePlaceholder='수정'
                            onImagePreview={(url: string) => {
                              handleImagePreview(url);
                            }}
                            id={field.name}
                            {...field}
                            onChange={(e) => {
                              handleImageChange(e, field);
                            }}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>
        </div>
        <div className='flex w-full justify-center items-center pb-8'>
          <div className='flex w-full justify-center items-center md:max-w-64 max-w-56 space-x-10'>
            <Button
              type='button'
              variant={'cancel1'}
              className='md:text-xl text-lg p-0 h-12 flex justify-center items-center'
              onClick={handleRemoveAddData}
            >
              추가 데이터 필드 삭제
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
};

export default EditSection;
