// src/lib/api.ts
import { ApiClient } from "./apiclient";
import type { QueryResponse, IngestResponse, IngestJobStatus, UploadResponse } from "./types";

const api = new ApiClient("");

export async function registerUser(username: string, password: string) {
  const data = await api.post("/api/register", { username, password }, { json: true });
  return data;
}

export async function login(username: string, password: string) {
  const data = await api.post("/api/login", { username, password }, { json: true });

  if (data.token && typeof window !== "undefined") {
    localStorage.setItem("auth_token", data.token);
  }

  return data;
}

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const fd = new FormData();
  fd.set("file", file);

  const data = await api.post<UploadResponse>("/api/ingest", fd, {
    credentials: "include",
  });

  return data;
}

export async function getIngestJobStatus(
  jobId: number
): Promise<IngestJobStatus> {
  const data = await api.get<IngestJobStatus>(`/api/ingest-jobs/${jobId}`, {
    credentials: "include",
    cache: "no-store",
  });

  return data;
}

export async function listDocs(): Promise<string[]> {
  const data = await api.get<string[]>("/api/docs", {
    cache: "no-store",
    credentials: "include",
  });
  return data;
}

export async function askQuery(query: string, docName: string | null): Promise<QueryResponse> {
  const data = await api.post<QueryResponse>(
    "/api/query",
    { query, docName },
    {
      json: true,
      credentials: "include",
    }
  );

  return data;
}
