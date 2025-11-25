export type UploadResponse = { id: string; name?: string };


export type Source = {
    id: string;
    title?: string;
    url?: string;
    score?: number;
    metadata?: Record<string, unknown>;
};


export type QueryResponse = {
    answer: string;
    sources: Source[];
};

export interface IngestResponse {
    name: string;
    status: string;
    job_id: number;
}

export interface IngestJobStatus {
    id: number;
    name: string;
    status: "pending" | "processing" | "completed" | "failed" | string;
    error?: string | null;
}