import { BASE_URL, fetchApi } from '../fetchApi';
import { SignInRequest } from '../swagger-type/data-contracts';
import { LoginResponse } from './auth.type';

export const signInAuth = (body: SignInRequest) => {
  return fetchApi<LoginResponse>(`${BASE_URL}/auth/sign-in`, {
    method: 'POST',
    body: {
      ...body,
    },
  });
};

export const signOutAuth = () => {
  return fetchApi<null>(`${BASE_URL}/auth/sign-out`, {
    method: 'POST',
    requireAuth: true,
    isNormal: true,
  });
};
