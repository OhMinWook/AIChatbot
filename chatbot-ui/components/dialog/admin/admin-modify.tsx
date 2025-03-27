'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogClose } from '@radix-ui/react-dialog';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { getAdminUserByIdAction } from '@/actions/admin-list-action';
import { adminUpdateformSchema } from '@/const/zod/admin-create-form-zod';
import {
  convertItemsToNumbersString,
  convertNumbersStringToItems,
} from '@/lib/extract-admin';
import { updateAdminUserAction } from '@/actions/admin-user-action';
import ModifyUserAlert from '@/features/manager/list/alert/manager-list-modify-alert';
import InputText from '@/components/ui/input/input-text';
import RegisterUserAlert from '@/features/manager/list/alert/magager-list-register-alert';
import { useQueryClient } from '@tanstack/react-query';

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

interface DialogAdminModifyProps {
  adminId: number;
  closeParentDialog: () => void;
}

export default function DialogAdminModifyContent({
  adminId,
  closeParentDialog,
}: DialogAdminModifyProps) {
  // query client
  const queryClient = useQueryClient();

  // state
  const [isSuccess, setIsSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // form
  const form = useForm<z.infer<typeof adminUpdateformSchema>>({
    resolver: zodResolver(adminUpdateformSchema),
    defaultValues: {
      items: [],
    },
  });

  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof adminUpdateformSchema>) => {
    if (!values.items || values.items.length === 0) {
      setAlertMessage('최소 하나의 권한을 선택해야합니다.');
      setIsAlertOpen(true);
      return;
    }

    const result = items.reduce(
      (acc, item) => {
        acc[item.id] = values.items?.includes(item.id) || false;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    let numericItems = convertItemsToNumbersString(values.items!);

    if (adminId === 1) {
      numericItems = '1, 2, 3, 4';
    } else {
      numericItems = convertItemsToNumbersString(values.items!);
    }

    const adminUser = {
      name: values.username || '',
      dept_name: values.group || '',
      tel_no: values.phoneNumber || '',
      admin_id: adminId,
      auth_menu_list: numericItems,
      ...(values.password && { password: values.password }),
      ...(values.confirmPassword && { password_check: values.confirmPassword }),
    };

    const response = await updateAdminUserAction(adminUser);

    if (response.error) {
      setAlertMessage(response.message);
      setIsAlertOpen(true);
      return;
    }

    queryClient.refetchQueries({
      queryKey: ['manager-list'],
    });

    setAlertMessage('성공적으로 수정되었습니다.');
    setIsSuccess(true);
    setIsAlertOpen(true);
  };

  useEffect(() => {
    const getManagerData = async () => {
      const response = await getAdminUserByIdAction(adminId);

      if (response.error) {
        return;
      }

      const { data } = response;

      const mappedItems = convertNumbersStringToItems(data.auth_menu_list);
      const mapping = mappedItems.map((item) => item.id);

      form.reset({
        username: data.name || '',
        group: data.dept_name || '',
        phoneNumber: data.tel_no || '',
        id: data.login_id,
        password: '',
        confirmPassword: '',
        items: mapping,
      });
    };

    getManagerData();
  }, [adminId]);

  const handleAlertClose = () => {
    setIsAlertOpen(false);
    if (isSuccess) closeParentDialog();
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
                          disabled
                          {...field}
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
                              checked={field.value.includes(item.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, item.id]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (id: string) => id !== item.id,
                                    ),
                                  );
                                }
                              }}
                              disabled={adminId === 1}
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
                  <p>
                    * &apos;최고 관리자 메뉴&apos;의 하위 메뉴는 최고 관리자만
                    접근 가능합니다.
                  </p>
                </div>
                <p>* ID는 변경할 수 없습니다. (관리자 신규등록 해야함)</p>
              </section>
            </article>

            <footer className='relative flex justify-center mt-[31.5px] border-customColor-bg1_1 border-t-[1px]'>
              <section className='flex justify-center md:w-[300px] w-96 md:h-[48px] h-16 gap-[16px] mt-[22px] md-[32.2px]'>
                <Button type='submit' variant='enter2' className=''>
                  등록
                </Button>
                <DialogClose asChild>
                  <Button type='button' variant='cancel1' className=''>
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
