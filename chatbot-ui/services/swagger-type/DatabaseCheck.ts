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

export class DatabaseCheck<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name DatabaseCheckDatabaseCheckGet
   * @summary Database Check
   * @request GET:/database-check
   */
  databaseCheckDatabaseCheckGet = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/database-check`,
      method: 'GET',
      format: 'json',
      ...params,
    });
}
