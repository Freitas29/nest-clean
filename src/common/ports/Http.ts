export type HttpResult<T = any> = {
  body?: T;
  statusCode: number;
};

export type HttpParams = {
  url: string;
  body?: unknown;
  params?: unknown;
};

export interface IHttpGet {
  get<T>(params: HttpParams): Promise<HttpResult<T>>;
}

export type HttpClient = IHttpGet;
