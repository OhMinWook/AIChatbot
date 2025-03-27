'use server';

import { auth } from '@/auth';

export const getAuthMenuList = async () => {
  const session = await auth();
  const authMenuList = session?.user.authMenuList;

  return authMenuList;
};
