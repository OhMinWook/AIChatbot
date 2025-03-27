'use server';

import { signIn as signInNormal } from '@/auth.normal';
import { signIn } from '@/auth';
import { loginFormSchema } from '@/const/zod/login-form-zod';
import { signInAdminAuth } from '@/services/admin-auth/admin-auth';
import { signInAuth } from '@/services/auth/auth';
import { CustomUser } from '@/types/user-types';
import { z } from 'zod';

export const formLoginAction = async (
  formData: z.infer<typeof loginFormSchema>,
  userType: 'admin' | 'user',
) => {
  let result = {
    error: false,
  };

  const loginInfo = { userType, ...formData };

  try {
    if (userType === 'admin') {
      await signIn('credentials', {
        ...loginInfo,
        redirect: false,
      });
    } else {
      await signInNormal('credentials', {
        ...loginInfo,
        redirect: false,
      });
    }
  } catch (err) {
    result.error = true;
  } finally {
    return result;
  }
};

const processCookies = (cookieString: string | null, userType: string) => {
  let authCookie = '';
  let sessionCookie = '';
  const CheckType = userType === 'admin' ? 'ADMIN_COOKIE' : 'COOKIE';

  const cookies = cookieString?.split(',').map((cookie) => cookie.trim());

  cookies?.forEach((cookie) => {
    if (cookie.startsWith(CheckType)) {
      authCookie = cookie;
    } else if (cookie.startsWith('session')) {
      sessionCookie = cookie;
    }
  });

  return { authCookie, sessionCookie };
};

export const authLoginAction = async (
  email: string,
  password: string,
  userType: string,
): Promise<CustomUser | null> => {
  let response;
  const loginInfo = {
    login_id: email,
    password,
  };

  // 어드민인지 체크
  if (userType === 'admin') {
    response = await signInAdminAuth(loginInfo);
  } else {
    response = await signInAuth(loginInfo);
  }

  if (response.data.error) return null;

  const { authCookie, sessionCookie } = processCookies(
    response.cookie,
    userType,
  );

  const fullCookie = `${authCookie};${sessionCookie}`;

  const responseAuthMenuList = response.data.data.auth_menu_list;
  const authMenuList = responseAuthMenuList
    ? responseAuthMenuList.split(',').map((domain) => domain.trim())
    : [];

  const user = {
    id: String(response.data.data.id!),
    email: response.data.data.login_id!,
    name: response.data.data.name || '',
    userType: userType,
    authCookie,
    sessionCookie,
    fullCookie,
    authMenuList,
  };

  return user;
};
