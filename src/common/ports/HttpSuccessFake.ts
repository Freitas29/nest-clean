import { HttpClient, HttpResult } from './Http';
import Result from '../Result';

export class HttpSuccessFake implements HttpClient {
  async get<T>(): Promise<HttpResult<T>> {
    return {
      body: undefined,
      statusCode: 200,
    };
  }

  async post<T>(): Promise<Result<HttpResult<T>>> {
    return Result.ok({
      body: undefined,
      statusCode: 200,
    });
  }
}
