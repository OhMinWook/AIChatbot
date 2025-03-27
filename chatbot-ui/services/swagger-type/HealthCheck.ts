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

export class HealthCheck<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name HealthCheckHealthCheckGet
   * @summary Health Check
   * @request GET:/health-check
   */
  healthCheckHealthCheckGet = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/health-check`,
      method: 'GET',
      format: 'json',
      ...params,
    });
}
