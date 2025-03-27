import LoginLogo from '@/components/svg/login-logo';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import BotInfo from './bot-chat/bot-chat-info';
import BeatLoader from 'react-spinners/BeatLoader';

interface BotChatLoadingUIProps {
  date: number;
}
export default function BotChatLoadingUI({ date }: BotChatLoadingUIProps) {
  return (
    <section className='w-full h-auto p-0 md:p-5 pb-10 flex justify-center items-center bg-transparent md:bg-customColor-bg3 rounded-xl'>
      <article className='w-full flex space-x-3'>
        <Avatar className='w-14 h-14 p-2 bg-white border-1'>
          <AvatarImage src={<LoginLogo />} />
        </Avatar>
        <section className='w-full flex flex-col space-y-5 md:space-y-8'>
          <article className='w-full flex justify-between items-center'>
            <fieldset>
              <BotInfo date={date} />
            </fieldset>
            <fieldset></fieldset>
            <fieldset></fieldset>
          </article>

          <div className='w-full text-2xl'>
            <article className='flex justify-center items-center md:items-start bg-customColor-white md:bg-transparent border-1 border-customColor-bg3 rounded-2xl w-fit px-8 md:px-0 py-3 md:py-0 h-auto min-h-16'>
              <BeatLoader
                color={'#c92f5c'}
                loading={true}
                size={20}
                aria-label='Loading Spinner'
                data-testid='loader'
              />
            </article>
          </div>
        </section>
      </article>
    </section>
  );
}
