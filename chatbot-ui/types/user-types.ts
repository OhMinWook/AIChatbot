export interface CustomUser {
  id?: string;
  name?: string;
  email?: string;
  userType: string;
  authCookie: string | null;
  sessionCookie: string | null;
  fullCookie: string | null;
  authMenuList?: string[];
}
