import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Home from '@/assets/icons/sidebar/home.svg';
import Manager from '@/assets/icons/sidebar/setting.svg';
import Manual from '@/assets/icons/sidebar/manual.svg';
import Answer from '@/assets/icons/sidebar/chat.svg';
import Usage from '@/assets/icons/sidebar/dashboard.svg';

export type SubMenuType = {
  key: string;
  label: string;
  route: string;
  searchParams?: boolean;
};

export type MenuType = {
  key: string;
  label: string;
  icon: string | StaticImport;
  hasSubmenu: boolean;
  route: string;
  authMenuKey?: string;
  subMenuList: SubMenuType[];
};

export const menuList: MenuType[] = [
  {
    key: 'manager',
    label: '최고 관리자 메뉴',
    icon: Manager,
    hasSubmenu: true,
    route: '',
    authMenuKey: '1',
    subMenuList: [
      {
        key: 'list',
        label: '관리자 리스트',
        route: '/admin/manager/list',
      },
      {
        key: 'user-list',
        label: '사용자 리스트',
        route: '/admin/manager/user-list',
      },
    ],
  },
  {
    key: 'manual',
    label: '메뉴얼 관리',
    icon: Manual,
    hasSubmenu: true,
    route: '',
    authMenuKey: '2',
    subMenuList: [
      {
        key: 'list',
        label: '메뉴얼 리스트',
        route: '/admin/manual/list',
        searchParams: true,
      },
    ],
  },
  {
    key: 'answer',
    label: '답변 관리',
    icon: Answer,
    hasSubmenu: true,
    route: '',
    authMenuKey: '3',
    subMenuList: [
      {
        key: 'manage',
        label: '사용자 불만족 답변 관리',
        route: '/admin/answer/manage',
        searchParams: true,
      },
      {
        key: 'setting',
        label: '답변 설정',
        route: '/admin/answer/setting',
      },
    ],
  },
  {
    key: 'usage',
    label: '사용량 대시보드',
    icon: Usage,
    hasSubmenu: true,
    route: '',
    authMenuKey: '4',
    subMenuList: [
      {
        key: 'user',
        label: '사용자 사용량 리스트',
        route: '/admin/usage/user/all/all',
        searchParams: true,
      },
      {
        key: 'embedding',
        label: '전처리 사용량 리스트',
        route: '/admin/usage/embedding/all/all',
        searchParams: true,
      },
    ],
  },
];
