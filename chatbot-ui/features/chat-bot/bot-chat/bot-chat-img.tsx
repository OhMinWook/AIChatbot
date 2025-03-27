import PlusSvg from '@/components/svg/plus';

interface BotChatImgProps {
  img: string;
  screen: string;
}
export default function BotChatImg({ img, screen }: BotChatImgProps) {
  return (
    <>
      <section className='w-full flex flex-col space-y-5 border-1 border-customColor-bg3 h-auto md:bg-white rounded-xl px-3 py-5 relative'>
        <div className='w-full h-auto relative hidden md:flex justify-center items-center'>
          {/* <Image
            alt='chat-bot-img'
            src={img}
            width={960}
            height={540}
            style={{
              width: 'auto',
              height: '540px',
            }}
          /> */}
          <img
            alt='chat-bot-img'
            src={img}
            style={{
              width: 'auto',
              height: 'auto',
            }}
          />
        </div>

        {/* 모바일 */}
        <article className='flex md:hidden justify-between items-center'>
          <p>화면 ID : {screen}</p>
          <div className='w-10 h-10 fill-customColor-gray1'>
            <PlusSvg />
          </div>
        </article>
        <article className='w-full h-auto relative bg-customColor-bg1 rounded-xl flex justify-center items-center md:hidden'>
          {/* <Image
            alt='chat-bot-img'
            src={img}
            width={350}
            height={250}
            style={{
              width: 'auto',
              height: '250px',
            }}
          /> */}
          <img
            alt='chat-bot-img'
            src={img}
            style={{
              width: 'auto',
              height: 'auto',
            }}
          />
        </article>
      </section>
    </>
  );
}
