// 메뉴얼 수정 다이얼로그
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input/input';
import { InputLabel } from '@/components/ui/input/inputlabel';

const formSchema = z
  .object({
    preprocess_id: z.number(),
    updated_pages: z.array(
      z.object({
        content: z.string({
          required_error: 'content는 필수로 작성되어야 합니다',
        }),
        id: z.number().optional(),
        image_path: z.string().optional(),
        source: z.string().optional(),
        subject: z.string().optional(),
      }),
    ),
  })
  .catchall(z.any());

export default function DialogAdminModify() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preprocess_id: 1, // 기본 값: 1
      updated_pages: [],
    },
  });

  const [sectionsArray, setSectionsArray] = useState([
    {
      id: 1,
      content: '',
      source: '',
      subject: '',
      image_path: '',
    },
  ]);

  // 사본 배열
  const [copySectionsArray, setCopySectionsArray] = useState([
    ...sectionsArray,
  ]);

  // 수정 모드로 전환
  const [editingFields, setEditingFields] = useState<{
    [key: string]: boolean;
  }>({});

  const handleEdit = (fieldName: string) => {
    setEditingFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleConfirm = (fieldName: string) => {
    setEditingFields((prev) => ({ ...prev, [fieldName]: false }));

    setSectionsArray((prev) =>
      prev.map((section, index) => ({
        ...section,
        content: copySectionsArray[index].content,
        source: copySectionsArray[index].source,
        subject: copySectionsArray[index].subject,
        image_path: section.image_path,
      })),
    );
  };

  const handleCancel = (fieldName: string) => {
    setEditingFields((prev) => ({ ...prev, [fieldName]: false }));

    setCopySectionsArray((prev) =>
      prev.map((section, index) => ({
        ...section,
        content: sectionsArray[index].content,
        source: sectionsArray[index].source,
        subject: sectionsArray[index].subject,
      })),
    );
  };

  const addSection = () => {
    const newSection = {
      id: sectionsArray.length + 1,
      content: '',
      source: '',
      subject: '',
      image_path: '',
    };
    // 원본 배열과 사본 배열에 새 섹션 추가
    setSectionsArray((prev) => [...prev, newSection]);
    setCopySectionsArray((prev) => [...prev, newSection]);
  };

  // 특정 섹션의 필드 업데이트
  const updateSection = (id: number, field: string, value: string) => {
    setCopySectionsArray((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, [field]: value } : section,
      ),
    );
  };

  // 이미지 미리보기 처리
  const handleImagePreview = (id: number, url: string) => {
    setSectionsArray((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, image_path: url } : section,
      ),
    );
  };

  // 폼 제출 처리
  const onSubmit = () => {
    const updatedPages = sectionsArray.map((section) => ({
      id: section.id,
      content: section.content,
      source: section.source,
      subject: section.subject,
      image_path: section.image_path,
    }));

    const dataToSend = {
      preprocess_id: 1,
      updated_pages: updatedPages,
    };
  };

  return (
    <div className='md:w-[1291px] max-h-[878px] overflow-y-auto'>
      <header className='flex h-[37px] bg-customColor-bg0 text-[1.2rem] font-semibold'>
        <div className='w-[56px] px-[10px] border-r-1 border-customColor-gray1'>
          메뉴얼 번호
        </div>
        <div className='flex justify-between w-full items-center text-[1.4rem]'>
          <div className='flex-1 text-center'>업로드 파일: </div>
          <div className='flex-1 text-center'>해당 이미지</div>
        </div>
      </header>
      <div>
        <Form {...form}>
          <form
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <article>
              {sectionsArray.map((section) => (
                <section
                  key={section.id}
                  className='flex border-b-1 border-customColor-gray1'
                >
                  <div className='flex w-[59px] text-[12px] border-r-1 border-customColor-gray1 font-semibold justify-center items-center'>
                    {section.id}
                  </div>
                  <div className='grid grid-cols-2 gap-[13px] mt-[23px] ml-[16px] mr-[30px] w-full'>
                    <div>
                      <fieldset className='mb-[16px]'>
                        <FormField
                          control={form.control}
                          name={`source_${section.id}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className='flex'>
                                  <div className='flex px-[15.33px] text-center items-center text-[1.6rem] font-semibold border rounded-[4px] border-customColor-bg3 mr-[9px]'>
                                    source
                                  </div>
                                  <div className='flex w-full items-center rounded-[4px] bg-customColor-bg3'>
                                    {editingFields[`source_${section.id}`] ? (
                                      <div className='flex items-center w-full border border-customColor-gray1 rounded-[4px] bg-white'>
                                        <Input
                                          variant='manual'
                                          {...field}
                                          value={
                                            copySectionsArray.find(
                                              (s) => s.id === section.id,
                                            )?.source || ''
                                          }
                                          onChange={(e) => {
                                            updateSection(
                                              section.id,
                                              'source',
                                              e.target.value,
                                            );
                                            field.onChange(e);
                                          }}
                                        />
                                        <Button
                                          type='button'
                                          variant='ok'
                                          className='mr-[7.8px]'
                                          onClick={() =>
                                            handleConfirm(
                                              `source_${section.id}`,
                                            )
                                          }
                                        >
                                          확인
                                        </Button>
                                        <Button
                                          type='button'
                                          variant='ok'
                                          className='mr-[15.2px]'
                                          onClick={() =>
                                            handleCancel(`source_${section.id}`)
                                          }
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
                                          value={
                                            copySectionsArray.find(
                                              (s) => s.id === section.id,
                                            )?.source || ''
                                          }
                                        />
                                        <Button
                                          type='button'
                                          variant='edit'
                                          className='mr-[15px]'
                                          onClick={() =>
                                            handleEdit(`source_${section.id}`)
                                          }
                                        >
                                          수정
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className='absolute' />
                            </FormItem>
                          )}
                        />
                      </fieldset>

                      <fieldset className='mb-[16px]'>
                        <FormField
                          control={form.control}
                          name={`subject_${section.id}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className='flex'>
                                  <div className='flex px-[13.5px] text-center items-center text-[1.6rem] font-semibold border rounded-[4px] border-customColor-bg3 mr-[9px]'>
                                    subject
                                  </div>
                                  <div className='flex w-full items-center rounded-[4px] bg-customColor-bg3'>
                                    {editingFields[`subject_${section.id}`] ? (
                                      <div className='flex items-center w-full border border-customColor-gray1 rounded-[4px] bg-white'>
                                        <Input
                                          variant='manual'
                                          {...field}
                                          value={
                                            copySectionsArray.find(
                                              (s) => s.id === section.id,
                                            )?.subject || ''
                                          }
                                          onChange={(e) => {
                                            updateSection(
                                              section.id,
                                              'subject',
                                              e.target.value,
                                            );
                                            field.onChange(e);
                                          }}
                                        />
                                        <Button
                                          type='button'
                                          variant='ok'
                                          className='mr-[7.8px]'
                                          onClick={() =>
                                            handleConfirm(
                                              `subject_${section.id}`,
                                            )
                                          }
                                        >
                                          확인
                                        </Button>
                                        <Button
                                          type='button'
                                          variant='ok'
                                          className='mr-[15.2px]'
                                          onClick={() =>
                                            handleCancel(
                                              `subject_${section.id}`,
                                            )
                                          }
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
                                          value={
                                            copySectionsArray.find(
                                              (s) => s.id === section.id,
                                            )?.subject || ''
                                          }
                                        />
                                        <Button
                                          type='button'
                                          variant='edit'
                                          className='mr-[15px]'
                                          onClick={() =>
                                            handleEdit(`subject_${section.id}`)
                                          }
                                        >
                                          수정
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className='absolute' />
                            </FormItem>
                          )}
                        />
                      </fieldset>

                      <fieldset className='mb-[16px]'>
                        <FormField
                          control={form.control}
                          name={`content_${section.id}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className='flex'>
                                  <div className='flex px-[8px] h-[32px] text-center items-center text-[1.6rem] font-semibold border rounded-[4px] border-customColor-bg3 mr-[9px]'>
                                    content
                                    <p className='text-customColor-primary1'>
                                      *
                                    </p>
                                  </div>
                                  <div className='flex w-full items-center rounded-[4px] bg-customColor-bg3'>
                                    {editingFields[`content_${section.id}`] ? (
                                      <div className='flex relative items-center w-full border border-customColor-gray1 rounded-[4px] bg-white'>
                                        <Input
                                          variant='manual'
                                          className='min-h-[171px]'
                                          {...field}
                                          value={
                                            copySectionsArray.find(
                                              (s) => s.id === section.id,
                                            )?.content || ''
                                          }
                                          onChange={(e) => {
                                            updateSection(
                                              section.id,
                                              'content',
                                              e.target.value,
                                            );
                                            field.onChange(e);
                                          }}
                                        />
                                        <div className='absolute bottom-0 right-0 mb-[11px]'>
                                          <Button
                                            type='button'
                                            variant='ok'
                                            className=' mr-[7.8px]'
                                            onClick={() =>
                                              handleConfirm(
                                                `content_${section.id}`,
                                              )
                                            }
                                          >
                                            확인
                                          </Button>
                                          <Button
                                            type='button'
                                            variant='ok'
                                            className='mr-[15.2px]'
                                            onClick={() =>
                                              handleCancel(
                                                `content_${section.id}`,
                                              )
                                            }
                                          >
                                            취소
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className='flex relative items-center w-full border rounded-[4px] border-customColor-bg3'>
                                        <Input
                                          variant='manual'
                                          className='min-h-[171px]'
                                          disabled
                                          {...field}
                                          value={
                                            copySectionsArray.find(
                                              (s) => s.id === section.id,
                                            )?.content || ''
                                          }
                                        />
                                        <Button
                                          type='button'
                                          variant='edit'
                                          className='absolute bottom-0 right-0 mr-[15px] mb-[11px]'
                                          onClick={() => {
                                            handleEdit(`content_${section.id}`);
                                          }}
                                        >
                                          수정
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className='absolute' />
                            </FormItem>
                          )}
                        />
                      </fieldset>
                    </div>

                    <div>
                      <fieldset className=''>
                        <FormField
                          control={form.control}
                          name={`image_path_${section.id}`}
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormControl>
                                  <div className='relative flex w-full h-[274px] rounded-[4px] bg-customColor-bg3'>
                                    {/* 이미지 미리보기 */}
                                    <figure className='mt-[12px] mr-[116px] mb-[12px] ml-[16px]'>
                                      {section.image_path && (
                                        <Image
                                          width={0}
                                          height={0}
                                          style={{
                                            width: 'auto',
                                            height: '238px',
                                          }}
                                          src={section.image_path}
                                          alt='미리보기'
                                          className='mt-2 w-full h-auto'
                                        />
                                      )}
                                    </figure>
                                    <div className='absolute right-[15px] bottom-[10px]'>
                                      <InputLabel
                                        variant='manualImage'
                                        labelType='manualImage'
                                        filePlaceholder='수정'
                                        onImagePreview={(url: string) => {
                                          handleImagePreview(section.id, url);
                                        }}
                                        id={field.name}
                                        {...field}
                                        onChange={(e) => {
                                          updateSection(
                                            section.id,
                                            'image_path',
                                            e.target.value,
                                          );

                                          field.onChange(e);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage className='absolute' />
                              </FormItem>
                            );
                          }}
                        />
                      </fieldset>
                    </div>
                  </div>
                </section>
              ))}

              <section className='flex h-[57px] justify-center items-center'>
                <Button
                  type='button'
                  variant='addData'
                  icon='manualPlus'
                  onClick={addSection}
                >
                  데이터 추가
                </Button>
              </section>
            </article>

            <footer className='relative h-[82px] bg-customColor-bg0 border-customColor-bg1_1 border-t-[1px] rounded-b-[8px]'>
              <section className='flex justify-center px-[140px] h-[48px] gap-[16px] mt-[15px]'>
                <Button type='submit' variant='enter2' className='px-[69px]'>
                  저장
                </Button>
                <DialogClose asChild>
                  <Button type='button' variant='cancel1'>
                    취소
                  </Button>
                </DialogClose>
              </section>
            </footer>
          </form>
        </Form>
      </div>
    </div>
  );
}
