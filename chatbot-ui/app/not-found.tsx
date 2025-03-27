import Link from 'next/link';
import loginLogo from '@/assets/logos/login/login-logo.svg';
import loginHuniExpert from '@/assets/logos/login/login-huniexpert.svg';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='text-5xl w-dvw h-dvh flex flex-col justify-center items-center'>
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
      <p>존재하지 않는 페이지입니다</p>

      <Link href='/'>
        <Button className='p-3 border-1 hover:bg-slate-200 mt-20'>
          홈 페이지로 이동
        </Button>
      </Link>
    </div>
  );
}
