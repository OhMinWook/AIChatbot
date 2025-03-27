import { auth } from '@/auth';
import { auth as authNormal } from '@/auth.normal';
import { ApiResponse, fetchOptions } from './fetchApi.type';
import { redirect } from 'next/navigation';

export async function fetchApi<T>(
  endpoint: string,
  options: fetchOptions = {},
): Promise<{ data: ApiResponse<T>; cookie: string | null }> {
  const {
    method = 'GET',
    headers = {},
    body = null,
    requireAuth = false,
    fileUpload = false,
    isNormal = false,
  } = options;

  const session = isNormal ? await authNormal() : await auth();

  if (requireAuth) {
    const cookie = session?.user?.fullCookie;
    if (cookie) {
      headers['Cookie'] = cookie;
    }
  }

  const defHeader: {} = fileUpload
    ? { charset: 'utf-8' }
    : { 'Content-Type': 'application/json' };

  const config: RequestInit = {
    method,
    headers: {
      ...defHeader,
      ...headers,
    },
  };

  if (body) {
    config.body = fileUpload ? body : JSON.stringify(body);
  }

  if (fileUpload) {
    // delete config.headers['Content-Type'];
  }

  try {
    // console.log('(fetch api) endpoint >>>>>>>>>>>>>>>>>\n', endpoint);
    // console.log('(fetch api) config >>>>>>>>>>>>>>>>>\n', config, '\n');
    const response = await fetch(endpoint, config);

    // 헤더에서 쿠키 값 가져오기
    const cookie = response.headers.get('set-cookie');

    const data = await response.json();

    if (data.message !== 'success') {
      const userType = session?.user?.userType;
      const basePath =
        userType === 'user' || !session ? '/login' : '/admin/login';

      switch (data.message) {
        case 'Duplicate login Detected.':
          redirect(`${basePath}?duplicated=true`);
        case 'Not exists session_id at cookie':
          redirect(`${basePath}?cookie=false`);
        case 'Session expired':
          redirect(`${basePath}?session=false`);
      }
    }

    return { data: data as ApiResponse<T>, cookie };
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
