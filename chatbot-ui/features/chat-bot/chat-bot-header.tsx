'use client';
import Image from 'next/image';
import Logo from '@/assets/logos/sidebar/side-logo.svg';
import { Button } from '@/components/ui/button';
import { handleSignOut } from '@/actions/logout';
import { useQueryClient } from '@tanstack/react-query';

export default function ChatBotHeader() {
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await queryClient.removeQueries();
    await handleSignOut(true);
  };

  return (
    <section className='w-full h-28 fixed border-b-1 z-40 top-0 px-20 py-1 bg-customColor-bg3 flex justify-between items-center'>
      <article className='relative w-52 h-24'>
        <Image src={Logo} alt='hunivers logo' fill />
      </article>
      <article className='flex space-x-5'>
        <form action={handleLogout}>
          <Button
            type='submit'
            className='hover:bg-customColor-primary1 hover:text-slate-50 p-3'
          >
            로그아웃
          </Button>
        </form>
      </article>
    </section>
  );
}
