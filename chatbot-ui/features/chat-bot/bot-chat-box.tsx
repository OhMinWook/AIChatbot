import LoginLogo from '@/components/svg/login-logo';
import PlusSvg from '@/components/svg/plus';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import BotChatButtons from './bot-chat/bot-chat-buttons';
import BotChatText from './bot-chat/bot-chat-text';
import BotInfo from './bot-chat/bot-chat-info';

interface BotChatBoxProps {
  variant: 'text' | 'img' | 'manual' | 'array';
  date?: number;
  dgstfn?: string | number;
  chatId?: number | string;
  imgs?: (string | null)[];
  hash_id_list?: string[];
  text?: string;
  manuals?: (string | null)[];
  screen?: string;
  submitRate?: (chatid: number, dgstfn: number) => void;
  submitReport?: (chatid: number) => void;
  is_report_exist?: boolean;
}

export default function BotChatBox({
  variant,
  dgstfn,
  date,
  chatId,
  imgs,
  hash_id_list,
  text,
  manuals,
  screen,
  submitRate,
  submitReport,
  is_report_exist,
}: BotChatBoxProps) {
  return (
    <section className='w-full h-auto p-0 md:p-5 pb-10 flex justify-center items-center bg-transparent md:bg-customColor-bg3 rounded-xl'>
      <article className='w-full flex space-x-3'>
        <Avatar className='w-14 h-14 p-2 bg-white border-1'>
          <AvatarImage src={<LoginLogo />} />
        </Avatar>
        <section className='w-full flex flex-col space-y-5 md:space-y-8'>
          <article className='w-full flex justify-between items-center'>
            <fieldset>
              <BotInfo date={date!} />
            </fieldset>
            <fieldset>
              {variant === 'img' && (
                <div className='w-fit h-full hidden md:flex justify-center'>
                  <p className='text-2xl text-customColor-gray1'>
                    화면 ID : {screen ? screen : 'screen-id 없음'}
                  </p>
                </div>
              )}
            </fieldset>
            <fieldset>
              {variant === 'array' && (
                <div className='w-10 h-10 fill-customColor-gray1 hidden md:flex'>
                  <PlusSvg />
                </div>
              )}
              {variant === 'text' && (
                <BotChatButtons
                  className='hidden md:flex'
                  chatId={chatId!}
                  dgstfn={dgstfn}
                  submitRate={submitRate!}
                  submitReport={submitReport!}
                  is_report_exist={is_report_exist!}
                />
              )}
            </fieldset>
          </article>

          <div className='w-full text-2xl'>
            {variant === 'text' && (
              <BotChatText
                text={text!}
                chatId={chatId!}
                dgstfn={dgstfn}
                hash_id_list={hash_id_list}
                submitRate={submitRate!}
                submitReport={submitReport!}
                is_report_exist={is_report_exist!}
                imgs={imgs}
              />
            )}
            {/* {variant === 'array' && (
              <BotChatArray imgs={imgs!} manuals={manuals!} />
            )} */}
            {/* {variant === 'img' && <BotChatImg img={img!} screen={screen!} />} */}
            {/* {variant === 'manual' && <BotChatManual manual={manual!} />} */}
          </div>
        </section>
      </article>
    </section>
  );
}
