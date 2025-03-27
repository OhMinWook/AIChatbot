'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';
import InputText from '@/components/ui/input/input-text';
import RegisterUserAlert from '@/features/manager/list/alert/magager-list-register-alert';
import { useQueryClient } from '@tanstack/react-query';
import {
  createNormalUserAction,
  getNormalUserByIdAction,
  updateNormalUserAction,
} from '@/actions/user-list-action';

interface DialogNormalUserModifyProps {
  userId: number;
  closeParentDialog: () => void;
  formSchema: z.ZodType<any>;
  isRegister?: boolean;
}

export default function DialogNormalUserModifyContent({
  userId,
  closeParentDialog,
  formSchema,
  isRegister = false,
}: DialogNormalUserModifyProps) {
  // query client
  const queryClient = useQueryClient();

  // state
  const [isSuccess, setIsSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let normalUser;
    let response;
    let successMessage;

    if (isRegister) {
      normalUser = {
        name: values.username || '',
        dept_name: values.group || '',
        hospital_name: values.hospitalName || '',
        hospital_code: values.hospitalCode || '',
        login_id: values.id,
        password: values.password,
        password_check: values.confirmPassword,
      };

      response = await createNormalUserAction(normalUser);

      successMessage = '성공적으로 등록되었습니다.';
    } else {
      normalUser = {
        name: values.username || '',
        dept_name: values.group || '',
        hospital_name: values.hospitalName || '',
        hospital_code: values.hospitalCode || '',
        user_id: userId,
        ...(values.password && { password: values.password }),
        ...(values.confirmPassword && {
          password_check: values.confirmPassword,
        }),
      };

      response = await updateNormalUserAction(normalUser);

      successMessage = '성공적으로 수정되었습니다.';
    }

    if (response.error) {
      setAlertMessage(response.message);
      setIsAlertOpen(true);
      return;
    }

    queryClient.refetchQueries({
      queryKey: ['user-list'],
    });

    setAlertMessage(successMessage);
    setIsSuccess(true);
    setIsAlertOpen(true);
  };

  useEffect(() => {
    const getManagerData = async () => {
      const response = await getNormalUserByIdAction(userId);

      if (response.error) {
        console.log(response.message);
        return;
      }

      const { data } = response;

      form.reset({
        username: data.name || '',
        group: data.dept_name || '',
        hospitalName: data.hospital_name || '',
        hospitalCode: data.hospital_code || '',
        id: data.login_id,
        password: '',
        confirmPassword: '',
      });
    };

    if (!isRegister) getManagerData();
  }, [userId]);

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
              <fieldset className='relative md:grid flex md:grid-cols-2 flex-col items-center mb-[16px] gap-[17px]'>
                <FormField
                  control={form.control}
                  name='hospitalName' // 병원명
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          labelContent='병원명'
                          placeholder='병원명을 입력해주세요'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='absolute' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='hospitalCode' // 병원코드
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          labelContent='병원코드'
                          placeholder='병원코드를 입력해주세요'
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
                          disabled={!isRegister}
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
