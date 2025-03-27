'use server';

import { adminCreateformSchema } from '@/const/zod/admin-create-form-zod';
import { updateSession } from '@/lib/session-util';
import {
  createAdminUser,
  deleteAdminUser,
  getAllAdminUser,
  getAdminUserById,
} from '@/services/admin-user/admin-user';
import { z } from 'zod';

export const getAdminListUserAction = async (options: {
  last_id: number;
  page_size: number;
}) => {
  const res = await getAllAdminUser(options);
  await updateSession(res.cookie);
  return res.data;
};

// export const getAdminListUserActionWithUpdate = async (
//   pageIndex: number,
//   pageSize: number,
// ) => {
//   const response = await getAllAdminUser(pageIndex, pageSize); // 서버에서 api 사용 후 클라이언트로 return

//   const session = await auth();
//   const user = session?.user;
//   const responseCookie = response.cookie;
//   const updatefullCookie = `${user?.authCookie};${responseCookie}`;

//   // 세션 업데이트
//   const updatedData: Partial<CustomUser> = {
//     ...user,
//     sessionCookie: responseCookie,
//     fullCookie: updatefullCookie,
//   };

//   await update({ user: updatedData });

//   return response.data;
// };

/**
 * 추후 api 업데이트하면 지워야함
 */
const convertItemsToNumbersString = (itemsArray: string[]): string => {
  const mapping: Record<any, number> = {
    manual: 2,
    qna: 3,
    dashboard: 4,
  };

  const numbers: number[] = [];

  for (const item of itemsArray) {
    if (!(item in mapping)) {
      return '';
    }
    numbers.push(mapping[item as any]);
  }

  return numbers.join(',');
};

export const createAdminUserAction = async (
  values: z.infer<typeof adminCreateformSchema>,
) => {
  // 추후 api 업데이트하면 바꿔야함
  const numericItems = convertItemsToNumbersString(values.items!);

  const adminUser = {
    name: values.username,
    dept_name: values.group,
    tel_no: values.phoneNumber,
    login_id: values.id,
    password: values.password,
    password_check: values.confirmPassword,
    auth_menu_list: numericItems,
  };

  const response = await createAdminUser(adminUser);
  return response.data;

  // return response.data;
};

export const deleteAdminUserAction = async (idList: string) => {
  const response = await deleteAdminUser(idList);
  return response.data;
};

export const getAdminUserByIdAction = async (adminId: string | number) => {
  const response = await getAdminUserById(adminId);
  return response.data;
};
