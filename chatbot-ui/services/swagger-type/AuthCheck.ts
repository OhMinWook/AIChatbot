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

import { HttpClient, RequestParams } from './http-client';

export class AuthCheck<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name AuthCheckAuthCheckGet
   * @summary Auth Check
   * @request GET:/auth-check
   */
  authCheckAuthCheckGet = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/auth-check`,
      method: 'GET',
      format: 'json',
      ...params,
    });
}
