import { BASE_URL, fetchApi } from '../fetchApi';

export const authCheck = () => {
  return fetchApi<any>(`${BASE_URL}/auth-check`, {
    method: 'GET',
    requireAuth: true,
  });
};

export const healthCheck = () => {
  return fetchApi<any>(`${BASE_URL}/health-check`, {
    method: 'GET',
  });
};

export const databaseCheck = () => {
  return fetchApi<any>(`${BASE_URL}/database-check`, {
    method: 'GET',
  });
};
