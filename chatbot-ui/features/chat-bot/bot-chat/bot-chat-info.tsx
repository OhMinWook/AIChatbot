import { format } from 'date-fns';

interface BotInfoProps {
  date: number;
}
export default function BotInfo({ date }: BotInfoProps) {
  const time = new Date(date * 1000);
  const formattedDate = format(time, 'yyyy-MM-dd');

  return (
    <section className='flex space-x-3'>
      <article className='flex flex-col'>
        <p className='text-2xl font-bold'>휴니버스 챗봇</p>
        <p className='text-xl text-customColor-gray1'>{formattedDate}</p>
      </article>
    </section>
  );
}
