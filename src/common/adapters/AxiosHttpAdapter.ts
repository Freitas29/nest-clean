import axios, { AxiosInstance } from 'axios';
import { HttpClient, HttpParams, HttpResult } from '../ports/Http';

export class AxiosHttpAdapter implements HttpClient {
  private REQUEST: AxiosInstance;

  constructor(baseUrl: string) {
    this.REQUEST = axios.create({
      baseURL: baseUrl,
    });
  }
  async get<T>(params: HttpParams): Promise<HttpResult<T>> {
    try {
      const response = await this.REQUEST.get(params.url);

      return {
        body: response.data,
        statusCode: response.status,
      };
    } catch (e) {
      return {
        body: undefined,
        statusCode: 400,
      };
    }
  }
}
