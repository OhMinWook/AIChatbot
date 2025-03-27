'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import InputText from '@/components/ui/input/input-text';
import { DialogClose } from '@radix-ui/react-dialog';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { adminCreateformSchema } from '@/const/zod/admin-create-form-zod';
import { createAdminUserAction } from '@/actions/admin-list-action';
import RegisterUserAlert from '@/features/manager/list/alert/magager-list-register-alert';
import { useState } from 'react';

// 체크박스
const items = [
  {
    id: 'manual',
    label: '메뉴얼 관리',
  },
  {
    id: 'qna',
    label: '답변 관리',
  },
  {
    id: 'dashboard',
    label: '사용량 대시보드',
  },
] as const;

interface DialogAdminRegisterProps {
  refetchFn: () => void;
  onClose: () => void;
}

export default function DialogAdminRegister({
  refetchFn,
  onClose,
}: DialogAdminRegisterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const form = useForm<z.infer<typeof adminCreateformSchema>>({
    resolver: zodResolver(adminCreateformSchema),
    defaultValues: {
      username: '',
      group: '',
      phoneNumber: '',
      id: '',
      password: '',
      confirmPassword: '',
      items: [],
    },
  });

  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const handleAlertClose = () => {
    setIsAlertOpen(false);
    if (isSuccess) onClose();
  };

  const onSubmit = async (values: z.infer<typeof adminCreateformSchema>) => {
    if (!values.items || values.items.length === 0) {
      setAlertMessage('최소 하나의 권한을 선택해야합니다.');
      setIsAlertOpen(true);
      return;
    }

    setIsLoading(true);
    const result = items.reduce(
      (acc, item) => {
        acc[item.id] = values.items?.includes(item.id) || false;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    const response = await createAdminUserAction(values);

    if (response.error) {
      setAlertMessage(response.message);
      setIsAlertOpen(true);
      setIsLoading(false);
      return;
    }

    setAlertMessage('성공적으로 등록되었습니다.');
    refetchFn();
    setIsSuccess(true);
    setIsLoading(false);
    setIsAlertOpen(true);
    // onClose();
  };

  return (
    <div className='w-full overflow-y-auto'>
      <div className='mb-[32px]'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <article className='md:px-[40px] px-7'>
              <p className='mt-[29px] mb-[12px] text-[1.6rem] font-bold'>
                기본정보
              </p>
              <fieldset className='relative md:grid flex md:grid-cols-2 flex-col items-center mb-[16px] gap-[17px]'>
                <FormField
                  control={form.control}
                  name='username' // 이름
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          labelContent='이름'
                          placeholder='2글자 이상 입력해주세요'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='absolute' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='group' // 소속
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          labelContent='소속'
                          placeholder='2글자 이상 입력해주세요'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='absolute' />
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative mb-[16px]'>
                <FormField
                  control={form.control}
                  name='phoneNumber' // 휴대전화번호
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          labelContent='휴대전화번호'
                          placeholder='- 없이 11자리 숫자를 입력해주세요'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='absolute' />
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative mb-[16px]'>
                <FormField
                  control={form.control}
                  name='id' // ID
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          labelContent='ID'
                          placeholder='4글자 이상 입력해주세요'
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage className='absolute' />
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative md:grid flex md:grid-cols-2 flex-col items-center mb-[29px] gap-[17px]'>
                <FormField
                  control={form.control}
                  name='password' // 비밀번호
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          labelContent='비밀번호'
                          variant='adminPw'
                          type='password'
                          placeholder='6글자 이상 입력해주세요'
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage className='absolute' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='confirmPassword' // 비밀번호 확인
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          labelContent='비밀번호 확인'
                          variant='adminPw'
                          type='password'
                          placeholder='6글자 이상 입력해주세요'
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage className='absolute' />
                    </FormItem>
                  )}
                />
              </fieldset>

              <p className='mb-[10px] text-[1.6rem] font-bold'>
                페이지 접근 권한 설정
              </p>

              <section className='flex mb-[15px]'>
                {items.map((item) => (
                  <FormField
                    name='items'
                    key={item.id}
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className='flex items-center h-[20px] space-x-[7.5px] md:mr-[42px] mr-0 space-y-0'
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== item.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className='md:text-[1.4rem] text-[1.3rem] font-medium cursor-pointer'>
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </section>

              <section className='text-[1.2rem] font-normal'>
                <div className='flex mb-[5px]'>
                  <p className='text-customColor-primary1'>*&nbsp;</p>
                  <p>은 필수 입력 항목입니다.</p>
                </div>
                <p>
                  * &apos;최고 관리자 메뉴&apos;의 하위 메뉴는 최고 관리자만
                  접근 가능합니다.
                </p>
              </section>
            </article>

            <footer className='relative flex justify-center mt-[31.5px] border-customColor-bg1_1 border-t-[1px]'>
              <section className='flex justify-center md:w-[300px] w-96 md:h-[48px] h-16 gap-[16px] mt-[22px] md-[32.2px]'>
                <Button type='submit' variant='enter2' disabled={isLoading}>
                  등록
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
      <RegisterUserAlert
        title='알림'
        description={alertMessage}
        cancelButton={{
          text: '확인',
          className: 'text-2xl px-5 py-3 border-1 hover:bg-slate-200',
        }}
        isOpen={isAlertOpen}
        setIsOpen={handleAlertClose}
      />
    </div>
  );
}
