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