/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * AddDataRequest
 * @example {"content":"string","image_path":"string","manual_id":1,"source":"string","subject":"string"}
 */
export interface AddDataRequest {
  /** Manual Id */
  manual_id: number;
  /** Source */
  source?: string | null;
  /** Subject */
  subject?: string | null;
  /** Content */
  content: string;
  /** Image Path */
  image_path?: string | null;
}

/** Body_upload_image_admin_manual_image_patch */
export interface BodyUploadImageAdminManualImagePatch {
  /**
   * Image
   * @format binary
   */
  image: File;
}

/** Body_upload_manual_admin_manual_file_post */
export interface BodyUploadManualAdminManualFilePost {
  /**
   * Manual File
   * @format binary
   */
  manual_file: File;
}

/**
 * CreateAdminRequest
 * @example {"auth_menu_list":"1,3","dept_name":"경영지원","login_id":"admin2@gmail.com","name":"손예진","password":"password!","password_check":"password!","tel_no":"010-3333-3333"}
 */
export interface CreateAdminRequest {
  /** Name */
  name?: string;
  /** Dept Name */
  dept_name?: string;
  /** Tel No */
  tel_no?: string;
  /** Login Id */
  login_id?: string;
  /** Password */
  password?: string;
  /** Password Check */
  password_check?: string;
  /** Auth Menu List */
  auth_menu_list?: string;
}

/**
 * CreateCollectionRequest
 * @example {"preprocess_id":1,"updated_pages":[{"content":"string","id":1,"image_path":"string","source":"string","subject":"string"},{"content":"string","id":3,"image_path":"string","source":"string","subject":"string"}]}
 */
export interface CreateCollectionRequest {
  /** Preprocess Id */
  preprocess_id: number;
  /** Updated Pages */
  updated_pages?: ManualPage[] | null;
}

/**
 * CreatePreprocessRequest
 * @example {"exclude":"","manual_name":"00.기준정보_PHIS_설치및로그인.pdf","pattern1":"","pattern1_1":"","pattern2":""}
 */
export interface CreatePreprocessRequest {
  /** Manual Name */
  manual_name: string;
  /** Pattern1 */
  pattern1?: string | null;
  /** Pattern1 1 */
  pattern1_1?: string | null;
  /** Pattern2 */
  pattern2?: string | null;
  /** Exclude */
  exclude?: string | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** ManualPage */
export interface ManualPage {
  /** Id */
  id: number;
  /** Source */
  source: string | null;
  /** Subject */
  subject: string | null;
  /** Content */
  content: string;
  /** Image Path */
  image_path: string | null;
}

/** QuestionRequest */
export interface QuestionRequest {
  /** Question Content */
  question_content: string;
  /**
   * Call Path
   * @default "api"
   * @pattern ^(user|api)$
   */
  call_path?: string;
}

/** RateRequest */
export interface RateRequest {
  /** Id */
  id: number;
  /** Dgstfn */
  dgstfn: number | string;
}

/** ReportRequest */
export interface ReportRequest {
  /** Id */
  id: number;
  /** Report Content */
  report_content: string;
}

/**
 * SignInRequest
 * @example {"login_id":"admin","password":"admin"}
 */
export interface SignInRequest {
  /** 유저 이메일 */
  login_id: string;
  /** 유저 비밀번호 */
  password: string;
}

/**
 * UpdateAdminRequest
 * @example {"admin_id":1,"auth_menu_list":"1,3","dept_name":"경영지원","name":"손예진","password":"password!","password_check":"password!","tel_no":"010-3333-3333"}
 */
export interface UpdateAdminRequest {
  /** Admin Id */
  admin_id?: number;
  /** Name */
  name?: string | null;
  /** Dept Name */
  dept_name?: string;
  /** Tel No */
  tel_no?: string;
  /** Password */
  password?: string;
  /** Password Check */
  password_check?: string;
  /** Auth Menu List */
  auth_menu_list?: string;
}

/**
 * UpdateAnswerRequest
 * @example {"answer_content":"Updated answer content"}
 */
export interface UpdateAnswerRequest {
  /** Answer Content */
  answer_content: string;
}

/**
 * UpdateManualRequest
 * @example {"data":"string","update_type":1}
 */
export interface UpdateManualRequest {
  /** Update Type */
  update_type?: number;
  /** Data */
  data: string | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}
