import Image from 'next/image';
import Logo from '@/assets/logos/sidebar/side-logo.svg';
import CloseBtn from '@/assets/icons/sidebar/close_button.svg';
import { SideMenu } from '@/features/sidebar/component/Menu';
import { Footer } from '@/features/sidebar/component/Footer';
import { Session } from 'next-auth';

interface Props {
  setIsToggleOpen: (isOpen: boolean) => void;
  userName: string;
  session: Session | null;
}

export function Sidenav({ setIsToggleOpen, userName, session }: Props) {
  return (
    <>
      <section className='w-full h-full bg-customColor-bg0 relative'>
        <div className='py-7 flex items-center justify-start md:justify-center pl-3 md:pl-0'>
          <Image
            src={Logo}
            alt='hunivers logo'
            className='w-[172px] h-[57px] md:w-[205px] md:h-[68px]'
            priority
          />
        </div>
        <Image
          src={CloseBtn}
          alt='menu close button'
          className='w-[24px] h-[24px] absolute top-5 right-4 cursor-pointer block md:hidden'
          onClick={() => setIsToggleOpen(false)}
        />
        <SideMenu setIsToggleOpen={setIsToggleOpen} session={session} />
        <Footer userName={userName} session={session}/>
      </section>
    </>
  );
}
