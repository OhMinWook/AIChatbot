'use server';
import { auth, signOut } from '@/auth';
import { auth as authNormal, signOut as signOutNormal } from '@/auth.normal';

export const handleSignOut = async (isNormal: boolean) => {
  const session = isNormal ? await authNormal() : await auth();
  const userType = session?.user?.userType;

  if (userType === 'user' || !session) {
    await signOutNormal({ redirectTo: '/login' });
  } else {
    await signOut({ redirectTo: '/admin/login' });
  }
};
