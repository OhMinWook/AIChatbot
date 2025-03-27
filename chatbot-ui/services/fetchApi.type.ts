export interface fetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  // body?: Record<string, any>;
  requireAuth?: boolean;
  fileUpload?: boolean;
  isNormal?: boolean;
}

export interface ApiResponse<T> {
  error: boolean;
  message: string;
  data: T;
  code?: number;
}

// 이거는 무한스크롤일때 x
export interface PaginatedResponse<T> {
  response: T[];
  total_pages: number;
  page_size: number;
  current_page_no: number;
  total_count: number;
}

export interface ApiParams {
  last_id?: number;
  page_size?: number;
  start_dt?: number;
  end_dt?: number;
}
