import { ApiParams, PaginatedResponse } from '../fetchApi.type';

export interface AnswerSearch {
  key: string;
  value: string;
  display_name: string;
}

export interface AnswerParams extends ApiParams {
  report_content?: string;
}

export interface AnswerListData {
  report_id: number;
  question_content: string;
  answer_content: string;
  creation_dt: number;
  report_content: string;
}

export interface AnswerReportData {
  report_id: number;
  question_content: string;
  answer_content: string;
  report_content: string;
  creation_dt: number;
  user_id: string;
  screen_id: string;
  manual_name: string;
  manual_path: string;
  manual_id: number;
}

export interface AnswerData {
  answer_id: number;
  answer_content: string;
}

export interface UpdateAnswerData {
  answer_content: string;
}

export interface AnswerResponse extends PaginatedResponse<AnswerListData> {}
export interface ReportResponse extends PaginatedResponse<AnswerReportData> {}
