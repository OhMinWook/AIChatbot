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

import {
  AddDataRequest,
  BodyUploadImageAdminManualImagePatch,
  BodyUploadManualAdminManualFilePost,
  CreateAdminRequest,
  CreateCollectionRequest,
  CreatePreprocessRequest,
  HTTPValidationError,
  SignInRequest,
  UpdateAdminRequest,
  UpdateAnswerRequest,
  UpdateManualRequest,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Admin<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags admin-common
   * @name AuthMenuAdminCommonAuthGet
   * @summary Auth Menu
   * @request GET:/admin/common/auth
   */
  authMenuAdminCommonAuthGet = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/admin/common/auth`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags admin-common
   * @name ManualSearchAdminCommonManualGet
   * @summary Manual Search
   * @request GET:/admin/common/manual
   */
  manualSearchAdminCommonManualGet = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/admin/common/manual`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags admin-common
   * @name ManualSearchAdminCommonAnswerGet
   * @summary Manual Search
   * @request GET:/admin/common/answer
   */
  manualSearchAdminCommonAnswerGet = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/admin/common/answer`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description ## DB 내 login_token 업데이트 및 set_cookie ### Args: login_id: 유저 이메일 (str) password: 유저 비밀번호 (str) ### Raises: SignInFailedException: 이메일 or 비밀번호 틀림 (401, 'Unauthorized') ### Returns: status: (200, 'OK') data: null
   *
   * @tags admin-auth
   * @name SignInAdminAuthSignInPost
   * @summary Sign In
   * @request POST:/admin/auth/sign-in
   */
  signInAdminAuthSignInPost = (
    data: SignInRequest,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/auth/sign-in`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description ## delete_cookie ### Args: ### Raises: 로그인 상태 아닌데 요청 보내면 401 Unauthorized: Not exists session_id at cookie ### Returns: status: (200, 'OK') data: null
   *
   * @tags admin-auth
   * @name SignOutAdminAuthSignOutPost
   * @summary Sign Out
   * @request POST:/admin/auth/sign-out
   */
  signOutAdminAuthSignOutPost = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/admin/auth/sign-out`,
      method: 'POST',
      format: 'json',
      ...params,
    });
  /**
   * @description # 날짜안넣으면 전체조회 ## status: (200, 'OK') ## data : [ { "report_id": 1, "question_content": "로그인 어떻게 해?", "answer_content": "로그인을 하려면 먼저 화면에 나타난 사번과 비밀번호란에 각각 사용자의 사번과 비밀번호를 입력해야 합니다. 그리고 "LOGIN" 버튼을 클릭하면 시스템에 인증이 됩니다.", "report_content": "이건", "creation_dt": 1727265550 }, ###... ### parameter 로 start_dt와 end_dt 있고 unix_time으로 입력가능 ### report_content 통해서 검색가능 ]
   *
   * @tags admin-answer
   * @name GetAllReportsAdminAnswerGet
   * @summary Get All Reports
   * @request GET:/admin/answer
   */
  getAllReportsAdminAnswerGet = (
    query?: {
      /**
       * Page No
       * @default 1
       */
      page_no?: number;
      /**
       * Page Size
       * @default 50
       */
      page_size?: number;
      /** Start Dt */
      start_dt?: number | null;
      /** End Dt */
      end_dt?: number | null;
      /** Report Content */
      report_content?: string | null;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/answer`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * @description # report 다중 삭제 ## status: (200, 'OK') ## parameter : report_id (1,3 이렇게 입력해도 되고  1 이렇게 입력해도 됩니다.) ### Returns: ### status: (200, 'OK') ### data: null ### Raises: ### ReportException: id list's element is not number = id_list에 숫자가 아닌 게 끼어있을 때 (400, "Bad Request")
   *
   * @tags admin-answer
   * @name DeleteReportAdminAnswerReportDelete
   * @summary Delete Report
   * @request DELETE:/admin/answer/report
   */
  deleteReportAdminAnswerReportDelete = (
    query: {
      /**
       * Report Id
       * Comma separated report IDs to delete
       */
      report_id: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/answer/report`,
      method: 'DELETE',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 관리자 report 상세 조회 ### Args: report_id: int = 위 전체 조회 api response의 id 값 주시면 됩니다 ### Raises: ReportNotFoundException: Report not found = 가져오려는 report no이 (404, "Not Found") ### Returns: status: (200, 'OK') data: { "report_id": 1, "question_content": "로그인 어떻게 해?", "answer_content": "로그인을 하려면 먼저 화면에 나타난 사번과 비밀번호란에 각각 사용자의 사번과 비밀번호를 입력해야 합니다. 그리고 "LOGIN" 버튼을 클릭하면 시스템에 인증이 됩니다.", "report_content": "이건", "creation_dt": 1727265550, "user_id": 1, "screen_id": null, "manual_name": null, "manual_path": null, "manual_id": null }
   *
   * @tags admin-answer
   * @name GetReportDetailAdminAnswerReportReportIdGet
   * @summary Get Report Detail
   * @request GET:/admin/answer/report/{report_id}
   */
  getReportDetailAdminAnswerReportReportIdGet = (
    reportId: number,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/answer/report/${reportId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description ## 관리자 답변 조회 ### Args: answer_id: int = 반드시 1입니다. ### Raises: AnswerNotFoundException: Report not found = 가져오려는 answer이 없을때 발생-사실 이경우는 발생할수 없습니다. (404, "Not Found") ### Returns: status: (200, 'OK') data: { "answer_id": 1, "answer_content": "Updated answer content" }
   *
   * @tags admin-answer
   * @name GetAnswerAdminAnswerAnswerIdGet
   * @summary Get Answer
   * @request GET:/admin/answer/{answer_id}
   */
  getAnswerAdminAnswerAnswerIdGet = (
    answerId: number,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/answer/${answerId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description ## 관리자 답변 update ### Args: answer_id: int = 반드시 1입니다. ### Request_body: answer_content: "Updated answer content" ### Returns: status: (200, 'OK') data: {}
   *
   * @tags admin-answer
   * @name UpdateAnswerAdminAnswerAnswerIdPatch
   * @summary Update Answer
   * @request PATCH:/admin/answer/{answer_id}
   */
  updateAnswerAdminAnswerAnswerIdPatch = (
    answerId: number,
    data: UpdateAnswerRequest,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/answer/${answerId}`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 전체 관리자 목록 paginate 하여 보여주기 ### Args: page_no: int = 요청할 페이지 번호 page_size: int = 한 번에 조회 할 관리자 수, 기본 값 50개 (10/30/50/100) start_dt, end_dt: Optional[float] = 이 api는 일자 필터가 없어서 아예 안보내주셔도 됩니다 ### Raises: ### Returns: status: (200, 'OK') data: [ { "id": 1, "name": "현빈", "dept_name": "경영지원", "tel_no": "010-3333-5555", "login_id": "Asdfwww", "auth_menu_list": "최고 관리자", "creation_dt": 1726055378 }, ... ]
   *
   * @tags admin-user
   * @name GetAllAdminAdminUserGet
   * @summary Get All Admin
   * @request GET:/admin/user/
   */
  getAllAdminAdminUserGet = (
    query?: {
      /**
       * Page No
       * @default 1
       */
      page_no?: number;
      /**
       * Page Size
       * @default 50
       */
      page_size?: number;
      /** Start Dt */
      start_dt?: number | null;
      /** End Dt */
      end_dt?: number | null;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/user/`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 관리자 등록 ### Args: name: str dept_name: str tel_no: str (010-3333-3333 or 01033335555로 보내주시면 됩니다.) login_id: str password: str password_check: str (비밀번호 확인) auth_menu_list: str (1, 2, 3 or 1,2,3 띄어쓰기 구분 상관 없이) ### Raises: AdminException: User already exists = 아이디가 이미 있는 경우 (400, "Bad Request") AdminException: Password mismatch = 비밀번호 확인 안맞을 때 (400, "Bad Request") AdminNotFoundException: Admin not found = 업데이트 하려는 아이디가 없을 때 (404, "Not Found") ### Returns: status: (200, 'OK') data: null
   *
   * @tags admin-user
   * @name CreateAdminAdminUserPost
   * @summary Create Admin
   * @request POST:/admin/user/
   */
  createAdminAdminUserPost = (
    data: CreateAdminRequest,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/user/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 관리자 수정 (변경되지 않는 필드는 request에 주시는 건가요?) ### Args: id: int (detail 조회에 쓴 id) name: str dept_name: str tel_no: str (010-3333-3333 or 01033335555로 보내주시면 됩니다.) login_id: str password: str password_check: str (비밀번호 확인) auth_menu_list: str (1, 2, 3 or 1,2,3 띄어쓰기 구분 상관 없이) ### Raises: AdminException: Password mismatch = 비밀번호 확인 안맞을 때 (400, "Bad Request") AdminNotFoundException: Admin not found = 업데이트 하려는 아이디가 없을 때 (404, "Not Found") ### Returns: status: (200, 'OK') data: null
   *
   * @tags admin-user
   * @name UpdateAdminAdminUserPatch
   * @summary Update Admin
   * @request PATCH:/admin/user/
   */
  updateAdminAdminUserPatch = (
    data: UpdateAdminRequest,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/user/`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 관리자 삭제 ### Args: id_list: str = "1, 2, 3" (리스트 [1, 2, 3]가 편하실까요? 문자열 "1, 2, 3"이 편하실까요?) ### Raises: AdminException: id list's element is not number = id_list에 숫자가 아닌 게 끼어있을 때 (400, "Bad Request") ### Returns: status: (200, 'OK') data: null
   *
   * @tags admin-user
   * @name DeleteAdminAdminUserDelete
   * @summary Delete Admin
   * @request DELETE:/admin/user/
   */
  deleteAdminAdminUserDelete = (
    query: {
      /** Id List */
      id_list: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/user/`,
      method: 'DELETE',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 관리자 상세 조회 ### Args: admin_id: int = 위 전체 조회 api response의 id 값 주시면 됩니다 ### Raises: AdminNotFoundException: Admin not found = 업데이트 하려는 아이디가 없을 때 (404, "Not Found") ### Returns: status: (200, 'OK') data: { "id": 1, "name": "현빈", "dept_name": "경영지원", "tel_no": "010-3333-5555", "login_id": "Asdfwww", "auth_menu_list": "최고 관리자" }
   *
   * @tags admin-user
   * @name GetAdminDetailAdminUserAdminIdGet
   * @summary Get Admin Detail
   * @request GET:/admin/user/{admin_id}
   */
  getAdminDetailAdminUserAdminIdGet = (
    adminId: number,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/user/${adminId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description ## 전체 메뉴얼 목록 paginate 하여 보여주기 ### Args: page_no: int = 요청할 페이지 번호 page_size: int = 한 번에 조회 할 메뉴얼 수, 기본 값 50개 (10/30/50/100) screen_id: Optional[str] = 화면(ID)로 검색 manual_name Optional[str] = 메뉴얼 이름으로 검색 start_dt, end_dt: Optional[float] = 메뉴얼 변동 일자 (unix time) 넣어주시면 됩니다 ### Raises: ### Returns: status: (200, 'OK') data: [ { "id": 1, "screen_id": "~~", "manual_name": "00.~~pdf", "manual_path": "www.~~~.kr", "creation_dt": 1726055378, "update_dt": 1726055378 }, ... ]
   *
   * @tags admin-manual
   * @name GetAllAdminManualGet
   * @summary Get All
   * @request GET:/admin/manual/
   */
  getAllAdminManualGet = (
    query?: {
      /**
       * Page No
       * @default 1
       */
      page_no?: number;
      /**
       * Page Size
       * @default 50
       */
      page_size?: number;
      /** Start Dt */
      start_dt?: number | null;
      /** End Dt */
      end_dt?: number | null;
      /** Screen Id */
      screen_id?: string | null;
      /** Manual Name */
      manual_name?: string | null;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/manual/`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 메뉴얼 다중 삭제 ### Args: id_list: str = "1, 2, 3" (리스트 [1, 2, 3]가 편하실까요? 문자열 "1, 2, 3"이 편하실까요?) ### Raises: ManualException: id list's element is not number = id_list에 숫자가 아닌 게 끼어있을 때 (400, "Bad Request") ### Returns: status: (200, 'OK') data: null
   *
   * @tags admin-manual
   * @name DeleteManualAdminManualDelete
   * @summary Delete Manual
   * @request DELETE:/admin/manual/
   */
  deleteManualAdminManualDelete = (
    query: {
      /** Id List */
      id_list: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/manual/`,
      method: 'DELETE',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 메뉴얼 id로 상세 조회 (좌측의 source/subject/content 페이지 별로 반환) ## id 값은 페이지에 해당하는 id이며, ## 상세 조회 시 그 메뉴얼에 해당하는 전체 페이지를 스크롤 형식으로 띄워줌. ## 이 경우, 요청한 id가 처음으로 보여야 함 ### Args: manual_id: int = 위 전체 조회 api response의 id 값 주시면 됩니다 ### Raises: ### Returns: status: (200, 'OK') data: { "manual_name": "테스트1", "page": [ { "id": 1, "source": "테스트1-1", "subject": "어쩌구저쩌구", "content": "어쩌구저쩌구", "image": null }, { "id": 2, "source": "테스트1-2", "subject": "어쩌구저쩌구", "content": "어쩌구저쩌구", "image": null }, { "id": 3, "source": "테스트1-3", "subject": "어쩌구저쩌구", "content": "어쩌구저쩌구", "image": null } ] }
   *
   * @tags admin-manual
   * @name GetOneManualAdminManualEmbeddingManualIdGet
   * @summary Get One Manual
   * @request GET:/admin/manual/embedding/{manual_id}
   */
  getOneManualAdminManualEmbeddingManualIdGet = (
    manualId: number,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/manual/embedding/${manualId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description ## 메뉴얼 개별 수정 (메뉴얼 등록 팝업 2) ## POST /embedding에서는 저장 버튼 눌러야 실제 테이블에 저장 되지만, 여기는 개별 수정 시 바로 반영된다 ### Args: manual_id: 변경하려는 메뉴얼 번호 (path 말고 body 안에 넣는 게 나을까요?) update_type: int = 변경 종류 (source = 0, subject = 1, content=2) ### Raises: ### Returns: status: (200, 'OK') data: null
   *
   * @tags admin-manual
   * @name UpdateManualAdminManualEmbeddingManualIdPatch
   * @summary Update Manual
   * @request PATCH:/admin/manual/embedding/{manual_id}
   */
  updateManualAdminManualEmbeddingManualIdPatch = (
    manualId: number,
    data: UpdateManualRequest,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/manual/embedding/${manualId}`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description ## /admin/manual/preprocess 요청 후 메뉴얼 등록 팝업 1의 값 ### Args: manual_id: int = POST /admin/manual/preprocess api response 값 주시면 됩니다 ### Raises: ### Returns: status: (200, 'OK') "data": { "manual_name": "테스트1", "page": [ { "id": 1, "source": "테스트1-1", "subject": "어쩌구저쩌구", "content": "어쩌구저쩌구", "image": null }, { "id": 2, "source": "테스트1-2", "subject": "어쩌구저쩌구", "content": "어쩌구저쩌구", "image": null }, { "id": 3, "source": "테스트1-3", "subject": "어쩌구저쩌구", "content": "어쩌구저쩌구", "image": null } ] }
   *
   * @tags admin-manual
   * @name GetOnePreprocessAdminManualPreprocessPreprocessIdGet
   * @summary Get One Preprocess
   * @request GET:/admin/manual/preprocess/{preprocess_id}
   */
  getOnePreprocessAdminManualPreprocessPreprocessIdGet = (
    preprocessId: number,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/manual/preprocess/${preprocessId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description ## 파일 업로드 및 파일 이름 중복 체크 (메뉴얼 등록 1) ## 아직 ncp 계정이 없어서.. 실제 업로드는 하지 않고 있습니다 ### Args: file: pdf 메뉴얼 파일 ### Raises: DuplicateManualException: 이미 동일한 이름의 파일이 upload 되어 있는 경우 (파일이 동일 하지 않아도 이름이 동일한 경우) "Duplicate Manual Name Not Allowed" (422, "Unprocessable Entity") ### Returns: status: (200, 'OK') data: 파일 명 반환
   *
   * @tags admin-manual
   * @name UploadManualAdminManualFilePost
   * @summary Upload Manual
   * @request POST:/admin/manual/file
   */
  uploadManualAdminManualFilePost = (
    data: BodyUploadManualAdminManualFilePost,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/manual/file`,
      method: 'POST',
      body: data,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 메뉴얼 등록/수정에서 데이터 추가 시 이미지 업로드 용 ## 아직 ncp 계정이 없어서.. 실제 업로드는 하지 않고 있습니다 ### Args: manual_name: 이미지 파일 저장 경로를 위해... image: 이미지 파일 ### Raises: ### Returns: status: (200, 'OK') data: 파일 저장 경로 반환
   *
   * @tags admin-manual
   * @name UploadImageAdminManualImagePatch
   * @summary Upload Image
   * @request PATCH:/admin/manual/image
   */
  uploadImageAdminManualImagePatch = (
    query: {
      /** Manual Name */
      manual_name: string;
    },
    data: BodyUploadImageAdminManualImagePatch,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/manual/image`,
      method: 'PATCH',
      query: query,
      body: data,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 메뉴얼 전처리 (메뉴얼 등록 1) ### Args: manual_name: 위의 POST /admin/manual/file의 response 값 넣어주시면 됩니다 pattern1, pattern1_1, pattern2: Optional[str] = {"패턴": "입력 페이지"} 현재 패턴은 1, 1_1, 2의 3종류이며, 제외 페이지는 exclude로 보내주실 수 있을까요?) request 예시 { "manual_name": "~~", "pattern1": "12, 20~23", "pattern1_1": "1~11", "pattern2": "13~14, 16~19", "exclude": "24~40" } ### Raises: ### Returns: status: (201, 'Created') data: 생성된 메뉴얼 id 반환
   *
   * @tags admin-manual
   * @name CreatePreprocessingAdminManualPreprocessPost
   * @summary Create Preprocessing
   * @request POST:/admin/manual/preprocess
   */
  createPreprocessingAdminManualPreprocessPost = (
    data: CreatePreprocessRequest,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/manual/preprocess`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 메뉴얼 수정 시 데이터 추가 (메뉴얼 등록 팝업 2) ### Args: manual_id: int (위에서 GET /admin/manual/embedding/{manual_id}의 manual_id 값) source: Optional[str] = None subject: Optional[str] = None content: str image_path: Optional[str] = None ### Raises: ### Returns: status: (200, 'OK') data: null
   *
   * @tags admin-manual
   * @name AddDataAdminManualEmbeddingPut
   * @summary Add Data
   * @request PUT:/admin/manual/embedding
   */
  addDataAdminManualEmbeddingPut = (
    data: AddDataRequest,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/manual/embedding`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 메뉴얼 전처리 완료 후 개별 수정 (메뉴얼 등록 2 팝업) ### Args: preprocess_id: int (GET /admin/manual/preprocess/{preprocess_id})의 return 값 updated_pages: List[dict] 변경할 값에 해당하는 데이터만 보내주시면 됩니다 "updated_pages": [ { "id": 1, "source": "string", "subject": "string", "content": "string", "image": "string" }, ... ] ### Raises: ### Returns: status: (201, 'Created') data: null
   *
   * @tags admin-manual
   * @name CreateCollectionAdminManualEmbeddingPost
   * @summary Create Collection
   * @request POST:/admin/manual/embedding
   */
  createCollectionAdminManualEmbeddingPost = (
    data: CreateCollectionRequest,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/manual/embedding`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 벡터db 데이터 삭제 ## 데이터 임베딩용, 안 씀
   *
   * @tags admin-manual
   * @name DeleteCollectionAdminManualEmbeddingDelete
   * @summary Delete Collection
   * @request DELETE:/admin/manual/embedding
   * @deprecated
   */
  deleteCollectionAdminManualEmbeddingDelete = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/admin/manual/embedding`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
  /**
   * @description ## 일반 사용자 챗봇 사용량 히스토리 ### Args: page_no: int = 요청할 페이지 번호 page_size: int = 한 번에 조회 할 메뉴얼 수, 기본 값 50개 (10/30/50/100) start_dt, end_dt: float= 조회할 사용일자(unixtime) ### Returns: "data": { "response": [ { "usage_id": 1, "hospital_name": "위데이터랩", "user_name": "user1", "call_path": "화면", "use_token_cnt": 20, "use_amount": "0.500000000000000000", "question_content": "질문 내용입니다",  # 최대 100자만 가져옵니다 "answer_content": "답변 내용입니다", # 최대 100자만 가져옵니다 "satisfaction_rate": 3.5, "creation_dt": 1724029200 }, ... ], "total_pages": 1, "page_size": 10, "current_page_no": 1
   *
   * @tags admin-use
   * @name GetUserAllUseAdminDashboardUseUserGet
   * @summary Get User All Use
   * @request GET:/admin/dashboard/use/user
   */
  getUserAllUseAdminDashboardUseUserGet = (
    query?: {
      /**
       * Page No
       * @default 1
       */
      page_no?: number;
      /**
       * Page Size
       * @default 50
       */
      page_size?: number;
      /**
       * Start Dt
       * @default 1640962800
       */
      start_dt?: number | null;
      /**
       * End Dt
       * @default 1727396384.064593
       */
      end_dt?: number | null;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/dashboard/use/user`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 일반 사용자 챗봇 사용량 통계 ### Args date_filter: Optional[str] = 날짜 필터 조건 -> 종류: all(default)/year/month/day detail_filter: Optional[str] = 상세 필터 조건 -> 종류: all(default)/hospital/call_path start_dt, end_dt: float =  조회할 사용일자(unix time) ### Returns "data": { "response": [ { "detail": "화면", "total_token_cnt": 20, "total_use_amount": "0.500000000000000000", "date": "2024.07" }, ... ], "total_pages": 1, "page_size": 50, "current_page_no": 1 }
   *
   * @tags admin-use
   * @name GetUserUseSummaryAdminDashboardUseUserSummaryGet
   * @summary Get User Use Summary
   * @request GET:/admin/dashboard/use/user/summary
   */
  getUserUseSummaryAdminDashboardUseUserSummaryGet = (
    query?: {
      /**
       * Page No
       * @default 1
       */
      page_no?: number;
      /**
       * Page Size
       * @default 50
       */
      page_size?: number;
      /**
       * Start Dt
       * @default 1640962800
       */
      start_dt?: number | null;
      /**
       * End Dt
       * @default 1727396384.06541
       */
      end_dt?: number | null;
      /**
       * Date Filter
       * @default "all"
       */
      date_filter?: string | null;
      /**
       * Detail Filter
       * @default "all"
       */
      detail_filter?: string | null;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/dashboard/use/user/summary`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 일반 사용자 챗봇 사용 상세 ### Args: use_id: int = 상세 조회할 사용 번호 ### Returns: "data": { "use_id": 6, "hospital": "서울대병원", "username": "user1", "call_path": "api", "use_token_cnt": 20, "use_amount": "0.500000000000000000", "question": "질문6", "answer": "답변6", "satisfaction_rate": 5, "creation_dt": 1726621200 }
   *
   * @tags admin-use
   * @name GetUserUseAdminDashboardUseUserUseIdGet
   * @summary Get User Use
   * @request GET:/admin/dashboard/use/user/{use_id}
   */
  getUserUseAdminDashboardUseUserUseIdGet = (
    useId: number,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/dashboard/use/user/${useId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description ## 관리자 사용량 데이터 전체 조회 ### Args start_dt, end_dt: float= 사용 일자(unix time) ### Returns "response": [ { "use_id": 1, "admin_name": "Jenny", "use_type": "1", "screen_id": "screen1", "manual_name": "manual1", "use_token_cnt": 20, "use_amount": "0.500000000000000000", "creation_dt": 1726707600 }, ... ], "total_pages": 1, "page_size": 50, "current_page_no": 1
   *
   * @tags admin-use
   * @name GetAdminAllUseAdminDashboardUseAdminGet
   * @summary Get Admin All Use
   * @request GET:/admin/dashboard/use/admin
   */
  getAdminAllUseAdminDashboardUseAdminGet = (
    query?: {
      /**
       * Page No
       * @default 1
       */
      page_no?: number;
      /**
       * Page Size
       * @default 50
       */
      page_size?: number;
      /**
       * Start Dt
       * @default 1640962800
       */
      start_dt?: number | null;
      /**
       * End Dt
       * @default 1727396384.064593
       */
      end_dt?: number | null;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/dashboard/use/admin`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 관리자 사용량 통계 ### Args date_filter: Optional[str] = 날짜 필터 조건 -> 종류: all(default)/year/month/day detail_filter: Optional[str] = 상세 필터 조건 -> 종류: all(default)/admin/type start_dt, end_dt: float =  조회할 사용 일자(unix time) ### Returns "data": { "response": [ { "detail": "전처리", "total_token_cnt": 80, "total_use_amount": "2.000000000000000000", "date": "2020.07 - 2024.09" }, { "detail": "임베딩", "total_token_cnt": 40, "total_use_amount": "1.000000000000000000", "date": "2020.07 - 2024.09" } ], "total_pages": 1, "page_size": 50, "current_page_no": 1 }
   *
   * @tags admin-use
   * @name GetAdminUseSummaryAdminDashboardUseAdminSummaryGet
   * @summary Get Admin Use Summary
   * @request GET:/admin/dashboard/use/admin/summary
   */
  getAdminUseSummaryAdminDashboardUseAdminSummaryGet = (
    query?: {
      /**
       * Page No
       * @default 1
       */
      page_no?: number;
      /**
       * Page Size
       * @default 50
       */
      page_size?: number;
      /**
       * Start Dt
       * @default 1640962800
       */
      start_dt?: number | null;
      /**
       * End Dt
       * @default 1727396384.06541
       */
      end_dt?: number | null;
      /**
       * Date Filter
       * @default "all"
       */
      date_filter?: string | null;
      /**
       * Detail Filter
       * @default "all"
       */
      detail_filter?: string | null;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/admin/dashboard/use/admin/summary`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
}
