interface MyChatBoxProps {
  chat: string;
}

export default function MyChatBox({ chat }: MyChatBoxProps) {
  return (
    <section className='w-full flex justify-end'>
      <article
        className={`w-fit h-16 md:h-20 px-8 flex justify-center items-center text-2xl bg-customColor-bg1 rounded-xl`}
      >
        {chat}
      </article>
    </section>
  );
}
