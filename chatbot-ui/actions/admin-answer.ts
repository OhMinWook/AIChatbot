'use server';

import { updateSession } from '@/lib/session-util';
import {
  deleteAnswerReport,
  getAnswerReport,
  getAnswerReportId,
  updateAnswer,
} from '@/services/admin-answer/admin-answer';

import { UpdateAnswerData } from '@/services/admin-answer/admin-answer.type';

export const getAnswerReportAction = async (options: {
  last_id: number;
  page_size: number;
  start_dt?: number;
  end_dt?: number;
  report_content?: string;
}) => {
  const res = await getAnswerReport(options);
  await updateSession(res.cookie);
  return res.data;
};

export const deleteReportAction = async (id: string) => {
  const res = await deleteAnswerReport(id);
  return res.data;
};

export const updateAnswerAction = async (params: UpdateAnswerData) => {
  const res = await updateAnswer(params);
  return res.data;
};

export const getAnswerReportIdAction = async (id: number) => {
  const res = await getAnswerReportId(id);
  return res.data;
};
