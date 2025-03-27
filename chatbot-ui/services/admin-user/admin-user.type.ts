import { ApiParams, PaginatedResponse } from '../fetchApi.type';

export interface AdminListData {
  id: number;
  name: string | null;
  dept_name: string | null;
  tel_no: string | null;
  login_id: string;
  auth_menu_list: string;
  creation_dt: number;
}

export interface AllAdminUserResponse
  extends PaginatedResponse<AdminListData> {}

export interface AdminUser {
  id: number;
  name: string;
  dept_name: string;
  tel_no: string;
  login_id: string;
  auth_menu_list: string;
}

export interface AdminUserParams extends ApiParams {}
