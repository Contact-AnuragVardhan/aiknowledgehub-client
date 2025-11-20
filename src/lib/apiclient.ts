"use client";

import { HttpClient } from "./http";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export class ApiClient {
  private http: HttpClient;

  constructor(baseUrl: string = "") {
    this.http = new HttpClient(baseUrl);
  }

  private withAuth(options: RequestInit = {}) {
    const token = getToken();

    const headers: Record<string, string> = {
      ...(options.headers as any),
    };

    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return {
      ...options,
      headers,
    };
  }

  get<T = any>(path: string, options: RequestInit = {}) {
    return this.http.get<T>(path, this.withAuth(options));
  }

  post<T = any>(path: string, body?: any, options: RequestInit = {}) {
    return this.http.post<T>(path, body, this.withAuth(options));
  }

  put<T = any>(path: string, body?: any, options: RequestInit = {}) {
    return this.http.put<T>(path, body, this.withAuth(options));
  }

  patch<T = any>(path: string, body?: any, options: RequestInit = {}) {
    return this.http.patch<T>(path, body, this.withAuth(options));
  }

  delete<T = any>(path: string, options: RequestInit = {}) {
    return this.http.delete<T>(path, this.withAuth(options));
  }
}
