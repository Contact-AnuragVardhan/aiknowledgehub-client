// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { uploadDocument, listDocs, askQuery, getIngestJobStatus } from "@/lib/api";
import type { QueryResponse } from "@/lib/types";

type TabId = "upload" | "url" | "ask";

const tabs: { id: TabId; label: string; hint: string }[] = [
    { id: "upload", label: "Upload document", hint: "PDF, DOCX, TXT…" },
    { id: "url", label: "Add from URL", hint: "Internal sites, wikis, etc." },
    { id: "ask", label: "Ask a question", hint: "RAG query with citations" },
];

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<TabId>("upload");

    const [docs, setDocs] = useState<string[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<string>("");

    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [uploadJobId, setUploadJobId] = useState<number | null>(null);

    const [url, setUrl] = useState("");
    const [urlLabel, setUrlLabel] = useState("");
    const [urlStatus, setUrlStatus] = useState("");

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState<QueryResponse | null>(null);
    const [queryStatus, setQueryStatus] = useState("");
    const [queryLoading, setQueryLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const d = await listDocs();
                setDocs(d);
            } catch { }
        })();
    }, []);

    // Poll job status when uploadJobId is set
    useEffect(() => {
        if (!uploadJobId) return;

        let cancelled = false;

        const interval = setInterval(async () => {
            try {
                const status = await getIngestJobStatus(uploadJobId);
                if (cancelled) return;

                setUploadStatus(
                    status.error
                        ? `Job #${status.id} – ${status.status.toUpperCase()}: ${status.error}`
                        : `Job #${status.id} – ${status.status.toUpperCase()}`
                );

                if (status.status === "completed" || status.status === "failed") {
                    clearInterval(interval);
                    setUploadJobId(null);

                    if (status.status === "completed") {
                        // refresh docs list when ingestion finishes
                        try {
                            const freshDocs = await listDocs();
                            if (!cancelled) {
                                setDocs(freshDocs);
                            }
                        } catch {
                            // ignore
                        }
                    }
                }
            } catch (err: any) {
                if (!cancelled) {
                    setUploadStatus(`Error checking job status: ${err?.message || "unknown error"}`);
                }
                clearInterval(interval);
                setUploadJobId(null);
            }
        }, 3000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [uploadJobId]);

    const onUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setUploadStatus("Uploading…");
        try {
            const res = await uploadDocument(file);
            setUploadStatus(`Uploaded: ${res.name || file.name}`);
            const freshDocs = await listDocs();
            setDocs(freshDocs);
        } catch (err: any) {
            setUploadStatus(`Error: ${err?.message || "upload failed"}`);
        }
    };

    const onAddUrl = async (e: React.FormEvent) => {
        e.preventDefault();
        setUrlStatus("Not wired to backend yet.");
    };

    const onAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        setQueryLoading(true);
        setAnswer(null);
        setQueryStatus("");
        try {
            const res = await askQuery(question, selectedDoc || null);
            setAnswer(res);
        } catch (err: any) {
            setQueryStatus(`Error: ${err?.message || "query failed"}`);
        } finally {
            setQueryLoading(false);
        }
    };

    return (
        <div className="app-shell-main">

            {/* LEFT SIDE — Dashboard Panel */}
            <section className="card">
                <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-card-heading">Workspace dashboard</h1>
                        <p className="text-xs text-card-main">
                            Use tabs to upload documents, add URLs, and run questions against your indexed knowledge.
                        </p>
                    </div>

                    <div className="tabs-list">
                        {tabs.map((tab) => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`tab-trigger ${active ? "tab-trigger-active" : ""}`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </header>

                <div className="mt-2 space-y-4">

                    {/* Upload Tab */}
                    {activeTab === "upload" && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-card-heading">Upload document</h2>
                            <p className="text-xs text-card-main">
                                Supported types: PDF, DOC, DOCX, TXT, CSV, MD, RTF. Backend will handle chunking, embeddings, and indexing.
                            </p>
                            <form
                                onSubmit={onUpload}
                                className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_auto]"
                            >
                                <input
                                    className="input"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt,.csv,.md,.rtf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <button className="btn" disabled={!file}>Upload</button>
                            </form>

                            {uploadStatus && (
                                <p className="text-xs text-card-main">{uploadStatus}</p>
                            )}
                        </div>
                    )}

                    {/* URL Tab */}
                    {activeTab === "url" && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-card-heading">Add content from URL</h2>
                            <p className="text-xs text-card-main">
                                Point to internal docs, Confluence pages, or other URLs.
                            </p>

                            <form onSubmit={onAddUrl} className="grid gap-3">
                                <div className="grid gap-2">
                                    <label className="text-[11px] font-medium text-card-main">URL</label>
                                    <input
                                        className="input"
                                        placeholder="https://your-confluence.com/page"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-[11px] font-medium text-card-main">Optional label</label>
                                    <input
                                        className="input"
                                        placeholder="e.g., Onboarding guide"
                                        value={urlLabel}
                                        onChange={(e) => setUrlLabel(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button className="btn" disabled={!url}>
                                        Index URL
                                    </button>
                                </div>
                            </form>

                            {urlStatus && <p className="text-xs text-card-main">{urlStatus}</p>}
                        </div>
                    )}

                    {/* Ask Tab */}
                    {activeTab === "ask" && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-card-heading">Ask a question</h2>
                            <p className="text-xs text-card-main">
                                Choose a document or search across all uploaded documents.
                            </p>

                            <form onSubmit={onAsk} className="space-y-3">
                                <select
                                    className="input"
                                    value={selectedDoc}
                                    onChange={(e) => setSelectedDoc(e.target.value)}
                                >
                                    <option value="">All documents</option>
                                    {docs.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>

                                <textarea
                                    className="input min-h-[80px] resize-y"
                                    placeholder="Ask something..."
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                />

                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-[11px] text-card-muted">
                                        The backend runs RAG and returns answer + sources.
                                    </p>

                                    <button className="btn" disabled={!question || queryLoading}>
                                        {queryLoading ? "Thinking…" : "Ask"}
                                    </button>
                                </div>
                            </form>

                            {queryStatus && (
                                <p className="text-xs text-red-400">{queryStatus}</p>
                            )}
                        </div>
                    )}

                </div>
            </section>

            {/* RIGHT SIDE — Answer + Recent Documents */}
            <aside className="space-y-4">

                <section className="card">
                    <h3 className="mb-2 text-sm font-semibold text-card-heading">Answer</h3>

                    {!answer ? (
                        <p className="text-xs text-card-muted">
                            Run a question in the Ask tab to see answers here.
                        </p>
                    ) : (
                        <div className="space-y-3 text-sm text-card-main">
                            <p>{answer.answer}</p>

                            {answer.sources?.length > 0 && (
                                <div className="space-y-1 text-xs">
                                    <h4 className="font-semibold text-card-heading">Sources</h4>
                                    <ul className="list-disc pl-4 text-card-main">
                                        {answer.sources.map((s: any, i: number) => (
                                            <li key={i}>
                                                {s.title || s.id || s}
                                                {typeof s.score === "number" && (
                                                    <span className="text-card-muted">
                                                        {" "}— score: {s.score.toFixed(3)}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <section className="card">
                    <h3 className="mb-2 text-sm font-semibold text-card-heading">
                        Recent documents
                    </h3>

                    {docs.length === 0 ? (
                        <p className="text-xs text-card-muted">
                            No documents yet. Upload one from the Upload tab.
                        </p>
                    ) : (
                        <ul className="space-y-1 text-xs text-card-main">
                            {docs.slice(0, 6).map((d) => (
                                <li key={d}>• {d}</li>
                            ))}
                        </ul>
                    )}

                    <h4 className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-card-muted">
                        Tips for better answers
                    </h4>
                    <ul className="mt-1 space-y-1 text-[11px] text-card-muted">
                        <li>• Ask specific questions.</li>
                        <li>• Scope to a document when possible.</li>
                        <li>• Keep questions grounded in uploaded documents.</li>
                    </ul>
                </section>
            </aside>
        </div>
    );
}

