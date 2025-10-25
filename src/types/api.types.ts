export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  message: string;
  status: number;
  statusText: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
}
