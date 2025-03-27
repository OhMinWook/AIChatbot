'use server';

import { updateAdminUser } from '@/services/admin-user/admin-user';
import { UpdateAdminRequest } from '@/services/swagger-type/data-contracts';

export const updateAdminUserAction = async (adminUser: UpdateAdminRequest) => {
  const response = await updateAdminUser(adminUser);
  return response.data;
};
