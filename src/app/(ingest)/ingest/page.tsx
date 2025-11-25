// src/app/(ingest)/ingest/page.tsx
"use client";
import { useEffect, useState } from "react";
import { uploadDocument, getIngestJobStatus, listDocs } from "@/lib/api";

export default function IngestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [jobId, setJobId] = useState<number | null>(null);

  useEffect(() => {
    if (!jobId) return;

    let cancelled = false;

    const interval = setInterval(async () => {
      try {
        const js = await getIngestJobStatus(jobId);
        if (cancelled) return;

        setStatus(
          js.error
            ? `Job #${js.id} – ${js.status.toUpperCase()}: ${js.error}`
            : `Job #${js.id} – ${js.status.toUpperCase()}`
        );

        if (js.status === "completed" || js.status === "failed") {
          clearInterval(interval);
          setJobId(null);

          if (js.status === "completed") {
            // optional: trigger docs refresh for other pages
            try {
              await listDocs();
            } catch {
              // ignore
            }
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setStatus(`Error checking job status: ${err?.message || "unknown error"}`);
        }
        clearInterval(interval);
        setJobId(null);
      }
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [jobId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setStatus("Uploading…");

    try {
      const res = await uploadDocument(file);
      setStatus(`Upload complete. Job #${res.job_id} queued for background indexing…`);
      setJobId(res.job_id);
      setFile(null);
    } catch (err: any) {
      setStatus(`Error: ${err?.message || "upload failed"}`);
    }
  };

  return (
    <div className="card max-w-xl">
      <h1 className="mb-3 text-xl font-semibold">Ingest Documents</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input
          className="input"
          type="file"
          accept=".pdf,doc,docx,txt,csv,md,rtf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button className="btn" type="submit" disabled={!file}>
          Upload
        </button>
      </form>
      {status && <p className="mt-3 text-sm text-slate-700">{status}</p>}
      <p className="mt-4 text-xs text-muted">
        Large documents are processed in the background. You can navigate away —
        once indexing finishes, they will appear in your documents list.
      </p>
    </div>
  );
}
