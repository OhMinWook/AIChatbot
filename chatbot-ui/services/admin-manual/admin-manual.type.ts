import { ApiParams, PaginatedResponse } from '../fetchApi.type';
import { ManualPage } from '../swagger-type/data-contracts';

export interface ManaulParams extends ApiParams {
  screen_id?: string;
  manual_name?: string;
  last_update_dt?: string | number;
  number?: string;
  Number?: string;
  hash_id?: string;
}

export interface Manuals {
  id: number;
  screen_id: string;
  manual_name: string;
  content: string;
  creation_dt: number;
  update_dt: number;
  hash_id: string;
}

export interface ManualResponse extends PaginatedResponse<Manuals> {}

export interface Manaul {
  id: number;
  source: string;
  subject: string;
  content: string;
  image_path: any;
}

export interface ManaulId {
  manual_name: string;
  page: Manaul[];
}

export interface UpdateManualBody {
  data: string;
  update_type: 0 | 1; // 등록/수정 여부 (등록: 0, 수정: 1)
  content_type: 0 | 1 | 2; // (source = 0, subject = 1, content=2)
}

export interface ManualUpload {
  get_url: string;
  post_url: string;
}

export interface CreateCollectionRequest {
  /** Preprocess Id */
  set_id: number;
  /** Updated Pages */
  updated_pages?: ManualPage[] | null;
}

export interface UploadImageParams {
  manual_id?: number;
  manual_name?: string;
}

export interface AddDataRequestBody {
  update_type: number; // 등록/수정 여부 (등록: 0, 수정: 1)
  type_id: number; // 메뉴얼 등록의 경우 GET /admin/manual/preprocess/{set_id}의 set_id 값 , 메뉴얼 수정의 경우 GET /admin/manual/embedding/{manual_id}의 manual_id 값
  content: string;
  manual_name: string;
  source?: string;
  subject?: string;
  image_path?: string;
}

export interface EmbeddingParams {
  set_id?: number;
  manual_id?: number;
}

export interface UploadManualParams {
  manual_name?: string;
}

export interface UploadManualEndParams {
  manual_name?: string;
  manual_path?: string;
}

export interface ImageUpload {
  real_path: string;
  post_url: string;
}
