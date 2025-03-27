import { BASE_URL, fetchApi } from '../fetchApi';
import { SignInRequest } from '../swagger-type/data-contracts';
import { LoginResponse } from './admin-auth.type';

export const signInAdminAuth = (body: SignInRequest) => {
  return fetchApi<LoginResponse>(`${BASE_URL}/admin/auth/sign-in`, {
    method: 'POST',
    body: {
      ...body,
    },
  });
};

export const signOutAdminAuth = () => {
  return fetchApi<null>(`${BASE_URL}/admin/auth/sign-out`, {
    method: 'POST',
    requireAuth: true,
  });
};
