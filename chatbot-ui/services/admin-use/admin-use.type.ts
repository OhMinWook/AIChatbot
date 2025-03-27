import { ApiParams, PaginatedResponse } from '../fetchApi.type';

export interface AllUsageParams extends ApiParams {}

export interface UseHistory {
  use_id: number;
  hospital: string;
  username: string;
  call_path: string;
  use_token_cnt: number;
  use_amount: string;
  question: string;
  answer: string;
  satisfaction_rate: string;
  creation_dt: number;
}

export interface UseHistoryResponse extends PaginatedResponse<UseHistory> {}

export interface AllSummaryParams extends ApiParams {
  date_filter?: string;
  detail_filter?: string;
}

export interface UserSummary {
  detail: string;
  total_token_cnt: number;
  total_use_amount: string;
  date: string;
}

export interface UseSummaryResponse extends PaginatedResponse<UserSummary> {}

export interface UserUsage {
  use_id: number;
  hospital: string;
  username: string;
  call_path: string;
  use_token_cnt: number;
  use_amount: string;
  question: string;
  answer: string;
  satisfaction_rate: string;
  creation_dt: number;
}

export interface AdminUsageHistory {
  use_id: number;
  admin_name: string;
  use_type: string;
  screen_id: string;
  manual_name: string;
  use_token_cnt: number;
  use_amount: string;
  creation_dt: number;
}

export interface AdminUseHistoryResponse
  extends PaginatedResponse<AdminUsageHistory> {}
