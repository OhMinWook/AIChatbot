'use server';

import {
  createNormalUser,
  deleteNormalUser,
  getAllNoramlUserList,
  getNormalUserById,
  updateNoramlUser,
} from '@/services/admin-user/admin-normal-user';
import {
  CreateNormalUserRequest,
  UpdateNormalUserRequest,
} from '@/services/admin-user/admin-normal-user.type';

export const getUserListAction = async (options: {
  last_id: number;
  page_size: number;
}) => {
  const res = await getAllNoramlUserList(options);
  return res.data;
};

export const createNormalUserAction = async (
  normalUser: CreateNormalUserRequest,
) => {
  const response = await createNormalUser(normalUser);
  return response.data;

  // return response.data;
};

export const updateNormalUserAction = async (
  normalUser: UpdateNormalUserRequest,
) => {
  const response = await updateNoramlUser(normalUser);
  return response.data;
};

export const deleteNormalUserAction = async (idList: string) => {
  const response = await deleteNormalUser(idList);
  return response.data;
};

export const getNormalUserByIdAction = async (userId: string | number) => {
  const response = await getNormalUserById(userId);
  return response.data;
};
