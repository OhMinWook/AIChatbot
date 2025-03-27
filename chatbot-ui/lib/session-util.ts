import { auth, update } from '@/auth';
import { auth as authNormal, update as updateNormal } from '@/auth.normal';
import { CustomUser } from '@/types/user-types';

export async function updateSession(responseCookie: string | null) {
  const session = await auth();
  const user = session?.user;
  const updatefullCookie = `${user?.authCookie};${responseCookie}`;

  const updatedData: Partial<CustomUser> = {
    ...user,
    sessionCookie: responseCookie,
    fullCookie: updatefullCookie,
  };

  await update({ user: updatedData });
}

export async function updateSessionNormal(responseCookie: string | null) {
  const session = await authNormal();
  const user = session?.user;
  const updatefullCookie = `${user?.authCookie};${responseCookie}`;

  const updatedData: Partial<CustomUser> = {
    ...user,
    sessionCookie: responseCookie,
    fullCookie: updatefullCookie,
  };

  await updateNormal({ user: updatedData });
}
