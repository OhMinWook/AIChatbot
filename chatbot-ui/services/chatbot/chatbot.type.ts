export interface AllChatParams {
  last_id?: string | number;
}

export interface ChatImageParams {
  doc_id?: string;
}

export interface ChatData {
  id: number;
  question_content: string;
  answer_content: string;
  screen_id?: string;
  image_path?: (string | null)[];
  manual_path?: (string | null)[];
  dgstfn?: number;
  date: number;
  is_report_exist: boolean;
  hash_id_list?: string[];
}
