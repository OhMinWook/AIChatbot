import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginFormSchema } from './const/zod/login-form-zod';
import { authLoginAction } from './actions/login';

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          label: 'Email',
          type: 'string', // 나중에 email로 수정
        },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'UserType', type: 'string' },
      },
      authorize: async (credentials) => {
        const parsed = loginFormSchema.safeParse(credentials);

        if (parsed.error) {
          throw new Error(
            parsed.error.errors[0]?.message || '잘못된 자격 증명입니다',
          );
        }

        // user 객체 받아오는 코드
        const user = await authLoginAction(
          parsed.data.email,
          parsed.data.password,
          credentials.userType as string,
        );

        if (!user) {
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    // 세션에 추가적인 정보를 포함시키기 위해 session 콜백 사용
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }

      if (token?.userType) {
        session.user.userType = token.userType;
      }

      if (token?.authCookie) {
        session.user.authCookie = token.authCookie;
      }

      if (token?.sessionCookie) {
        session.user.sessionCookie = token.sessionCookie;
      }

      if (token?.fullCookie) {
        session.user.fullCookie = token.fullCookie;
      }

      if (token?.authMenuList) {
        session.user.authMenuList = token.authMenuList;
      }

      return session;
    },

    // JWT 토큰에 user 정보를 저장
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.userType = user.userType;
        token.authCookie = user.authCookie;
        token.sessionCookie = user.sessionCookie;
        token.fullCookie = user.fullCookie;
        token.authMenuList = user.authMenuList;
      }

      // update token && session
      if (trigger === 'update' && session) {
        token = {
          ...token,
          sessionCookie: session.user.sessionCookie,
          fullCookie: session.user.fullCookie,
        };

        return token;
      }

      return token;
    },

    authorized: async ({ auth }) => {
      // 로그인한 사용자는 인증되며, 그렇지 않으면 로그인 페이지로 리다이렉션
      return !!auth;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 168,
  },
  cookies: {
    sessionToken: {
      name: 'auth.js.admin-user-session-token',
    },
    csrfToken: {
      name: 'auth.js.admin-user-csrf-token',
    },
    callbackUrl: {
      name: 'auth.js.admin-user-callback-url',
    },
  },
});
