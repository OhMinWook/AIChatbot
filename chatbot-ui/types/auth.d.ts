// auth.d.ts
import { User, AdapterUser, NextAuthResult } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { CustomUser } from './user-types';

// `next-auth` 모듈 확장
declare module 'next-auth' {
  interface User extends CustomUser {}
  interface AdapterUser extends CustomUser {}
  interface Session {
    user: CustomUser;
  }

  interface NextAuthResult {
    handlers: any;
    signIn: any;
    signOut: any;
    auth: any;
    unstable_update: (
      data: Partial<Session> | { user: Partial<CustomUser> },
    ) => Promise<Session | null>;
  }
}

// `next-auth/jwt` 모듈 확장
declare module 'next-auth/jwt' {
  interface JWT extends CustomUser {}
}
