import Image from 'next/image';
import loginBg from '@/assets/logos/login/login-bg.svg';
import loginHuniExpert from '@/assets/logos/login/login-huniexpert.svg';
import loginLogo from '@/assets/logos/login/login-logo.svg';
import FormLogin from '@/components/login/formLogin';
import { LoginExistDialog } from '@/features/login/login-exist-dialog';
import { auth as authNormal } from '@/auth.normal';
import { redirect } from 'next/navigation';

interface SearchParams {
  [key: string]: string | undefined;
}

interface LoginPageParams {
  searchParams: SearchParams;
}

export default async function Login({ searchParams }: LoginPageParams) {
  const session = await authNormal();

  if (session && Object.keys(searchParams).length === 0) {
    redirect('/');
  }

  return (
    <>
      <section className='flex w-full h-dvh justify-center items-center'>
        <article className={`left-0 w-1/2 h-full hidden xl:flex absolute`}>
          <Image
            src={loginBg}
            alt='login-bg'
            fill
            style={{ objectFit: 'cover' }}
          />
        </article>

        <article className='w-1/2 h-full hidden xl:flex' />
        <section className='relative bottom-20 flex justify-center items-center w-full xl:w-1/2 px-[2rem] md:px-[23rem] h-screen'>
          <div className='pt-20 w-full'>
            <div className='flex justify-center items-center mb-6 gap-2'>
              <Image
                src={loginLogo}
                alt='Login with Logo'
                className='w-[40px] h-[40px] mr-1 md:w-[89px] md:h-[89px]'
              />
              <Image
                src={loginHuniExpert}
                alt='Login with Expert'
                className='w-72 h-20 md:w-[290px] md:h-[77px]'
              />
            </div>
            <div className='flex justify-center pt-7 leading-tight text-[20px] md:text-4xl text-center'>
              <p className='font-medium'>
                <span className='text-rose-700'>휴니버스 메뉴얼 챗봇</span>에
                오신걸 환영합니다.
              </p>
            </div>

            <div className='mt-[50px]'>
              <FormLogin userType='user' />
            </div>
          </div>
        </section>
      </section>
      <LoginExistDialog searchParams={searchParams} isNormal />
    </>
  );
}
