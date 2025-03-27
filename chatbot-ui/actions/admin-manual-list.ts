'use server';

import { updateSession } from '@/lib/session-util';
import {
  getAllManuals,
  getManuals,
} from '@/services/admin-manual/admin-manual';

export const getAllManualsAction = async () => {
  const res = await getAllManuals();
  return res.data;
};

export const getManualsAction = async (options: {
  last_id: number;
  page_size: number;
  screen_id?: string;
  manual_name?: string;
  start_dt?: any;
  end_dt?: any;
  last_update_dt?: number;
}) => {
  const res = await getManuals(options);
  await updateSession(res.cookie);
  return res.data;
};
