//src\app\(ingest)\ingest\page.tsx
"use client";
import { useState } from "react";
import { uploadDocument } from "@/lib/api";


export default function IngestPage() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string>("");


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setStatus("Uploading…");
        try {
            const res = await uploadDocument(file);
            setStatus(`Uploaded: ${res?.name || file.name}`);
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
                    accept=".pdf,.doc,.docx,.txt,.csv,.md,.rtf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button className="btn" type="submit" disabled={!file}>Upload</button>
            </form>
            {status && <p className="mt-3 text-sm text-slate-700">{status}</p>}
            <p className="mt-4 text-xs text-muted">Backend will chunk, embed, and index using configured engine and vector DB.</p>
        </div>
    );
}