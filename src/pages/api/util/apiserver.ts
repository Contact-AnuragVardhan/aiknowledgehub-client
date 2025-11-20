// src/pages/api/apiServer.ts

import { HttpClient } from "@/lib/http";
import { getBaseUrl } from "./backend";

const api = new HttpClient(getBaseUrl());

function extractToken(headers: HeadersInit | undefined): string | null {
  if (!headers) return null;

  const auth =
    (headers as any)["authorization"] ||
    (headers as any)["Authorization"];

  if (auth) return (auth as string).replace("Bearer ", "");

  const cookieHeader = (headers as any)["cookie"];
  if (cookieHeader) {
    const match = /auth_token=([^;]+)/.exec(cookieHeader);
    if (match) return match[1];
  }

  return null;
}

function buildServerHeaders(init: RequestInit): Record<string, string> {
  const incoming = init.headers as any;
  return {
    Cookie: incoming?.cookie || "",
    Authorization: incoming?.authorization || incoming?.Authorization || "",
  };
}

function shouldJsonSerialize(init: RequestInit) {
  if (!init.body) return false;
  if (typeof init.body === "string") return false;
  if (init.body instanceof FormData) return false;
  return true;
}

export const apiServer = {
  get: (path: string, init: RequestInit = {}) =>
    api.get(path, {
      ...init,
      headers: buildServerHeaders(init),
      token: extractToken(init.headers),
    }),

  post: (path: string, init: RequestInit = {}) =>
    api.post(path, init.body, {
      ...init,
      headers: buildServerHeaders(init),
      json: shouldJsonSerialize(init),
      token: extractToken(init.headers),
    }),

  put: (path: string, init: RequestInit = {}) =>
    api.put(path, init.body, {
      ...init,
      headers: buildServerHeaders(init),
      json: shouldJsonSerialize(init),
      token: extractToken(init.headers),
    }),

  patch: (path: string, init: RequestInit = {}) =>
    api.patch(path, init.body, {
      ...init,
      headers: buildServerHeaders(init),
      json: shouldJsonSerialize(init),
      token: extractToken(init.headers),
    }),

  delete: (path: string, init: RequestInit = {}) =>
    api.delete(path, {
      ...init,
      headers: buildServerHeaders(init),
      token: extractToken(init.headers),
    }),
};
