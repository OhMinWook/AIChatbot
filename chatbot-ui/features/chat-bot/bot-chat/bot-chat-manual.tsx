import BotChatManualLinkBox from './bot-chat-manaul-link-box';

interface BotChatManualProps {
  manual: string;
}

export default function BotChatManual({ manual }: BotChatManualProps) {
  return (
    <>
      <section className='w-full flex flex-col md:justify-center md:items-center space-y-5 md:space-y-0 border-1 border-customColor-bg3 rounded-xl px-3 py-5 md:p-0'>
        <article className='w-full h-auto min-h-20 bg-customColor-bg1 rounded-xl flex justify-center items-center cursor-pointer md:hidden'>
          <BotChatManualLinkBox manual={manual} slicePath={8} />
        </article>
        <article className='hidden md:flex flex-col md:space-y-2 w-full h-full justify-center items-center'>
          <BotChatManualLinkBox manual={manual} slicePath={28} />
        </article>
      </section>
    </>
  );
}
