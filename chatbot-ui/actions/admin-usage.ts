'use server';

import { updateSession } from '@/lib/session-util';
import {
  getUserUsage,
  getUserUsageSummary,
  getUserUsageById,
  getAdminUsage,
  getAdminUsageSummary,
} from '@/services/admin-use/admin-use';

export const getUserUsageAction = async (options: {
  last_id: number;
  page_size: number;
  start_dt?: number;
  end_dt?: number;
}) => {
  const res = await getUserUsage(options);
  await updateSession(res.cookie);
  return res.data;
};

export const getUserUsageSummaryAction = async (options: {
  last_id: number;
  page_size: number;
  start_dt?: number;
  end_dt?: number;
  date_filter?: string;
  detail_filter?: string;
}) => {
  const res = await getUserUsageSummary(options);
  return res.data;
};

export const getUserUsageDetailAction = async (id: string | number) => {
  const res = await getUserUsageById(id);
  return res.data;
};

export const getEmbeddingAction = async (options: {
  last_id: number;
  page_size: number;
  start_dt?: number;
  end_dt?: number;
}) => {
  const res = await getAdminUsage(options);
  await updateSession(res.cookie);
  return res.data;
};

export const getEmbeddingSummaryAction = async (options: {
  last_id: number;
  page_size: number;
  start_dt?: number;
  end_dt?: number;
  date_filter?: string;
  detail_filter?: string;
}) => {
  const res = await getAdminUsageSummary(options);
  return res.data;
};
