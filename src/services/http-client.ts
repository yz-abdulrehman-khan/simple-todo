import type { RequestConfig } from '@/types';
import { API_BASE_URL } from '@/constants';
import { API_CONFIG } from '@/configs';
import { handleApiError } from '@/helpers';

class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseURL: string, timeout: number, headers: Record<string, string>) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = headers;
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  async request<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.buildURL(endpoint, config?.params);

    const options: RequestInit = {
      method: config?.method || 'GET',
      headers: {
        ...this.defaultHeaders,
        ...config?.headers,
      },
    };

    if (config?.body) {
      options.body = JSON.stringify(config.body);
    }

    try {
      const response = await this.fetchWithTimeout(url, options);

      if (!response.ok) {
        throw handleApiError(response);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const httpClient = new HttpClient(API_BASE_URL, API_CONFIG.timeout, API_CONFIG.headers);
