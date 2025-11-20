// src/lib/http.ts

export interface HttpOptions extends RequestInit {
  json?: boolean; // auto JSON serialize body if true
  token?: string | null; // optional Authorization token
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    if (!this.baseUrl) return path;
    return `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }

  private async request<T = any>(
    method: string,
    path: string,
    options: HttpOptions = {}
  ): Promise<T> {
    const url = this.buildUrl(path);

    const headers: Record<string, string> = {
      ...(options.headers as any),
    };

    // Auto JSON request
    let body = options.body;

    if (options.json && body && typeof body === "object") {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(body);
    }

    // Auto-token injection
    if (options.token) {
      headers["Authorization"] = `Bearer ${options.token}`;
    }

    const response = await fetch(url, {
      ...options,
      method,
      headers,
      body,
    });

    // Determine JSON or text
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    let data: any;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.detail ||
          `Request failed: ${response.status} ${response.statusText}`
      );
    }

    return data as T;
  }
  
  get<T = any>(path: string, options: HttpOptions = {}) {
    return this.request<T>("GET", path, options);
  }

  post<T = any>(path: string, body?: any, options: HttpOptions = {}) {
    return this.request<T>("POST", path, { ...options, body });
  }

  put<T = any>(path: string, body?: any, options: HttpOptions = {}) {
    return this.request<T>("PUT", path, { ...options, body });
  }

  patch<T = any>(path: string, body?: any, options: HttpOptions = {}) {
    return this.request<T>("PATCH", path, { ...options, body });
  }

  delete<T = any>(path: string, options: HttpOptions = {}) {
    return this.request<T>("DELETE", path, options);
  }
}
