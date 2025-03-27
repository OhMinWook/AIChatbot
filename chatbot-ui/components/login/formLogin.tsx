'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { formLoginAction } from '@/actions/login';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input/input';
import { loginFormSchema } from '@/const/zod/login-form-zod';
import { useRouter } from 'next/navigation';
import LoginAlertDialog from './login-alert';
import { useState } from 'react';
import { getAuthMenuList } from '@/actions/session-action';
import { menuList } from '@/const/menu-list';

interface FormLoginProps {
  userType: 'admin' | 'user';
}

export default function FormLogin({ userType }: FormLoginProps) {
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    // 서버 액션
    const response = await formLoginAction(values, userType);

    if (response.error) {
      setIsAlertOpen(true);
      return;
    }

    if (userType === 'user') router.push('/');

    if (userType === 'admin') {
      const authMenuList = await getAuthMenuList();

      if (!authMenuList) return;

      const filterList = menuList.filter((menu) => {
        const has = authMenuList.includes(menu.authMenuKey!);
        return has;
      });

      router.push(filterList[0].subMenuList[0].route!);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-[4rem] md:gap-[7rem]'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input variant='inputId' placeholder='이메일' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input variant='inputPw' placeholder='비밀번호' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' variant='enter1' className='mt-[2rem] md:mt-0'>
            로그인
          </Button>
        </form>
      </Form>
      <LoginAlertDialog
        title='회원정보'
        description={`아이디와 비밀번호를 확인 후 다시 입력해 주시기 바랍니다.`}
        cancelButton={{
          text: '확인',
          className: 'text-2xl px-5 py-3 border-1 hover:bg-slate-200',
        }}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
      />
    </>
  );
}
