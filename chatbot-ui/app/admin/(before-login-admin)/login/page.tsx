import Image from 'next/image';
import loginBg from '@/assets/logos/login/login-bg.svg';
import loginHuniExpert from '@/assets/logos/login/login-huniexpert.svg';
import loginLogo from '@/assets/logos/login/login-logo.svg';
import FormLogin from '@/components/login/formLogin';
import { LoginExistDialog } from '@/features/login/login-exist-dialog';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { menuList } from '@/const/menu-list';

interface SearchParams {
  [key: string]: string | undefined;
}

interface AdminLoginPageParams {
  searchParams: SearchParams;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageParams) {
  const session = await auth();

  if (session && Object.keys(searchParams).length === 0) {
    const authMenuList = session.user.authMenuList;

    if (!authMenuList) return;

    const filterList = menuList.filter((menu) => {
      const has = authMenuList.includes(menu.authMenuKey!);
      return has;
    });

    redirect(filterList[0].subMenuList[0].route!);
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
            <div className='flex flex-col items-center justify-center pt-7 leading-tight text-[20px] md:text-[30px] text-center'>
              <p className='grid justify-items-center text-rose-700 font-medium'>
                휴니버스 메뉴얼 챗봇 관리자 페이지
              </p>
              <p className=''>에 오신걸 환영합니다.</p>
            </div>

            <div className='mt-[50px]'>
              <FormLogin userType='admin' />
            </div>
          </div>
        </section>
      </section>
      <LoginExistDialog searchParams={searchParams} />
    </>
  );
}
