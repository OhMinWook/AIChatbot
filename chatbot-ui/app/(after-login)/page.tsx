import { auth as authNormal } from '@/auth.normal';
import ChatBotManager from '@/features/chat-bot/chat-bot-manager';
import { redirect } from 'next/navigation';

export default async function ChatBotPage() {
  const session = await authNormal();
  const userType = session?.user?.userType;

  if (userType === 'admin' || !session) {
    redirect('/login');
  }

  return (
    <section className='w-full h-dvh min-h-dvh overflow-y-hidden'>
      <ChatBotManager session={session} />
    </section>
  );
}
