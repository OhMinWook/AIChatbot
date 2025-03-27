import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_DOMAIN_LIST = process.env.ADMIN_DOMAIN_LIST
  ? process.env.ADMIN_DOMAIN_LIST.split(',').map((domain) =>
      domain.trim().toLowerCase(),
    )
  : [];

const throwAdminDomainError = (
  hostname: string,
  pathname: string,
  isAdminDomain: boolean,
) => {
  if (isAdminDomain) return undefined;

  if (pathname.startsWith('/admin')) {
    return new NextResponse(
      `Forbidden: Admin access required. \ncurrent hostname : ${hostname}`,
      { status: 403 },
    );
  }
};

const handleAdminAccess = (
  pathname: string,
  request: NextRequest,
): NextResponse | undefined => {
  if (
    pathname.startsWith('/admin') &&
    (!request.auth || request.auth.user.userType !== 'admin') &&
    pathname !== '/admin/login'
  ) {
    const newUrl = new URL('/admin/login', request.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  return undefined;
};

const addCustomHeaders = (request: NextRequest): NextResponse => {
  const newHeaders = new Headers();
  newHeaders.set('x-current-path', request.nextUrl.pathname);
  return NextResponse.next({ headers: newHeaders });
};

const permissionPathMap: Record<string, string[]> = {
  '1': ['/admin/manager'],
  '2': ['/admin/manual'],
  '3': ['/admin/answer'],
  '4': ['/admin/usage'],
};

const adminCommonPaths: string[] = ['/admin/login'];

const checkUserPermissions = (
  pathname: string,
  authMenuList: string[],
): NextResponse | undefined => {
  // 공용 경로인 경우 권한 검증을 건너뜁니다.
  if (
    adminCommonPaths.some(
      (adminPath) =>
        pathname === adminPath || pathname.startsWith(`${adminPath}/`),
    )
  ) {
    return undefined;
  }

  // 사용자가 접근할 수 있는 경로 리스트 생성
  const allowedPrefixes: string[] = authMenuList.flatMap(
    (key) => permissionPathMap[key] || [],
  );

  // 경로가 허용된 접두사로 시작하는지 확인
  const isAllowed = allowedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isAllowed && pathname.startsWith('/admin')) {
    return new NextResponse(
      `Forbidden: You do not have access to ${pathname} section.`,
      { status: 403 },
    );
  }

  return undefined;
};

export const middleware = auth((request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const host = request.headers.get('host');
  const hostname = host?.split(':')[0]?.toLowerCase();
  const isAdminDomain = ADMIN_DOMAIN_LIST.includes(hostname!);

  // 어드민은 허락된 도메인만 접근
  const adminDomainErrorResponse = throwAdminDomainError(
    hostname!,
    pathname,
    isAdminDomain,
  );
  if (adminDomainErrorResponse) {
    return adminDomainErrorResponse;
  }

  // 일반 세션은 어드민 로그인으로
  const adminAccessResponse = handleAdminAccess(pathname, request);
  if (adminAccessResponse) {
    return adminAccessResponse;
  }

  // 어드민 메뉴 접근 권한
  if (request.auth) {
    const currentAuthMenuList = request.auth.user.authMenuList;

    const permissionResponse = checkUserPermissions(
      pathname,
      currentAuthMenuList,
    );

    if (permissionResponse) {
      return permissionResponse;
    }
  }

  // Headers 정보 서버 컴포넌트로 전달
  return addCustomHeaders(request);
});

export const config = {
  matcher: [
    // match all routes except static files and APIs
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
