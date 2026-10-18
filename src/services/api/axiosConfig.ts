export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  private getAuthHeader(): Record<string, string> {
    try {
      const persisted = localStorage.getItem('persist:root');
      if (persisted) {
        const root = JSON.parse(persisted);
        const auth = JSON.parse(root.auth || '{}');
        if (auth.token) {
          return { Authorization: `Bearer ${auth.token}` };
        }
      }
    } catch {
      // ignore
    }
    return {};
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<{ data: T }> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers
    };

    // In local demo mode, requests resolve via internal mock handler
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[ApiClient Mock Request] ${this.baseURL}${endpoint}`, headers);
    }
    return {
      data: {} as T
    };
  }
}

export const apiClient = new ApiClient();
