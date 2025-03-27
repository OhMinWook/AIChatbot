export interface UserListData {
  id: number;
  login_id?: string;
  hospital_code?: string;
  name?: string;
  hospital_name?: string;
  dept_name?: string;
  creation_dt?: number;
}

export interface CreateNormalUserRequest {
  dept_name?: string;
  hospital_code?: string;
  hospital_name?: string;
  login_id: string;
  name: string;
  password: string;
  password_check: string;
}

export interface UpdateNormalUserRequest {
  dept_name?: string;
  hospital_code?: string;
  hospital_name?: string;
  name?: string;
  password?: string;
  password_check?: string;
  user_id: number;
}
