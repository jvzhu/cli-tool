import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { Logger } from './logger.js';

export class ApiClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string, token: string | undefined, private readonly logger: Logger) {
    this.client = axios.create({ baseURL, timeout: 10000 });

    this.client.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    });
  }

  async get(path: string): Promise<unknown> {
    try {
      const response = await this.client.get(path);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 429) {
        this.logger.warn('Rate limited by API', { retryAfter: err.response.headers['retry-after'] });
      }
      throw new Error(`API request failed: ${err.message}`);
    }
  }
}
