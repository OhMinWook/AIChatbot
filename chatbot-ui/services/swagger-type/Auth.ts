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

import { HTTPValidationError, SignInRequest } from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Auth<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description ## DB 내 login_token 업데이트 및 set_cookie ### Args: login_id: 유저 이메일 (str) password: 유저 비밀번호 (str) ### Raises: SignInFailedException: 이메일 or 비밀번호 틀림 (401, 'Unauthorized') ### Returns: status: (200, 'OK') data: null
   *
   * @tags auth
   * @name SignInAuthSignInPost
   * @summary Sign In
   * @request POST:/auth/sign-in
   */
  signInAuthSignInPost = (data: SignInRequest, params: RequestParams = {}) =>
    this.request<any, HTTPValidationError>({
      path: `/auth/sign-in`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description ## delete_cookie ### Args: ### Raises: 로그인 상태 아닌데 요청 보내면 401 Unauthorized: Not exists session_id at cookie ### Returns: status: (200, 'OK') data: null
   *
   * @tags auth
   * @name SignOutAuthSignOutPost
   * @summary Sign Out
   * @request POST:/auth/sign-out
   */
  signOutAuthSignOutPost = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/auth/sign-out`,
      method: 'POST',
      format: 'json',
      ...params,
    });
}
