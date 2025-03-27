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
  HTTPValidationError,
  QuestionRequest,
  RateRequest,
  ReportRequest,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Chatbot<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description ## 대화 내역 가져 오기 ## 무한 스크롤 방식 (요청마다 5개씩) ### Args: last_id: Optional[int] = 첫 요청일 때는 아예 값 안주셔도 되고 나머지 요청 시에는 이전 response의 가장 큰 id 값 넣어주시면 됩니다 ### Raises: ### Returns: status: (200, 'OK') data: [ { "id": 1, "question_content": "~~", "answer_content": "~~", "screen_id": "~~", "image_path": "~~", "manual_path": "~~", "dgstfn": 4.5 }, ... ]
   *
   * @tags chatbot
   * @name GetAllChatbotGet
   * @summary Get All
   * @request GET:/chatbot/
   */
  getAllChatbotGet = (
    query?: {
      /**
       * Last Id
       * @default 0
       */
      last_id?: number | null;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/chatbot/`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 질문 및 답변 반환 ## call_path를 path param으로 둔 이유는 페이지 호출(user), api 호출 (api)로 분리해야 해서,, ### Args: question_content: str = 질문 내용 call_path: str = user | api 둘 중 하나 값 (호출 경로 분리해야 해서 & default 값 api라서 ) ### Raises: fastapi.exceptions.RequestValidationError: call_path에 user/api 값이 아닌 게 들어간 경우 (422, "Unprocessable Entity") ### Returns: status: (200, 'OK') Response body : 답변
   *
   * @tags chatbot
   * @name QuestionChatbotPost
   * @summary Question
   * @request POST:/chatbot/
   * @deprecated
   */
  questionChatbotPost = (data: QuestionRequest, params: RequestParams = {}) =>
    this.request<any, HTTPValidationError>({
      path: `/chatbot/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags chatbot
   * @name AnswerDeprecatedChatbotAnswerGet
   * @summary Answer Deprecated
   * @request GET:/chatbot/answer
   * @deprecated
   */
  answerDeprecatedChatbotAnswerGet = (
    query: {
      /** Question Content */
      question_content: string;
      /**
       * Call Path
       * @default "api"
       * @pattern ^(user|api)$
       */
      call_path?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/chatbot/answer`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 답변 생성에 참조한 메뉴얼 정보 반환 ### Args: 인자는 위의 POST /chatbot/와 동일하게 주시면 됩니다! question_content: str = 질문 내용 call_path: str = user | api 둘 중 하나 값 (호출 경로 분리해야 해서 & default 값 api라서 ) ### Raises: ### Returns: status: (200, 'OK') data: { "id": 1, "question_content": "~~", "answer_content": "~~", "screen_id": "~~", "image_path": "~~", "manual_path": "~~", "dgstfn": 4.5 "date": unix time 형태 날짜.. }
   *
   * @tags chatbot
   * @name AnswerChatbotAnswerPost
   * @summary Answer
   * @request POST:/chatbot/answer
   */
  answerChatbotAnswerPost = (
    data: QuestionRequest,
    params: RequestParams = {},
  ) =>
    this.request<any, HTTPValidationError>({
      path: `/chatbot/answer`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 답변 만족도 등록 ### Args: id: int = 채팅 id dgstfn: Decimal = 0 ~ 5 사이 별점. 소숫점은 .5만 가능 ### Raises: RateValueException: Rate must be in 0 ~ 5 and decimal point must .0 or .5 = 별점 범위가 이상할 때 (400, "Bad Request") ChatNotFoundException: Chat Id Not Found. = 잘못된 id 값 (404, "Not Found") ### Returns: status: (200, 'OK') data: null
   *
   * @tags chatbot
   * @name RateChatbotRatePatch
   * @summary Rate
   * @request PATCH:/chatbot/rate
   */
  rateChatbotRatePatch = (data: RateRequest, params: RequestParams = {}) =>
    this.request<any, HTTPValidationError>({
      path: `/chatbot/rate`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description ## 답변 불만족 시 report 제출 ### Args: id: int = 채팅 id report_content: str = report 내용 ### Raises: ChatNotFoundException: Chat id Not Found. = 잘못된 id 값 (404, "Not Found") 이미 답변에 report 제출한 후 또 제출하려는 경우 ### Returns: status: (200, 'OK') data: null
   *
   * @tags chatbot
   * @name ReportChatbotReportPost
   * @summary Report
   * @request POST:/chatbot/report
   */
  reportChatbotReportPost = (data: ReportRequest, params: RequestParams = {}) =>
    this.request<any, HTTPValidationError>({
      path: `/chatbot/report`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
