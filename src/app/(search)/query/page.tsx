"use client";
import { useState } from "react";
import { askQuery } from "@/lib/api";
import type { QueryResponse } from "@/lib/types";


export default function QueryPage() {
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<QueryResponse | null>(null);
    const [error, setError] = useState<string>("");


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); 
        setError(""); 
        setData(null);

        try {
            const res = await askQuery(q, null);
            setData(res);
        } catch (e: any) {
            setError(e?.message || "Something went wrong");
        } finally { 
            setLoading(false); 
        }
    };


    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="card">
                <form onSubmit={onSubmit} className="grid gap-3">
                    <label className="text-sm font-medium">Ask a question</label>
                    <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g., Summarize policy X with citations" />
                    <button className="btn" disabled={!q || loading} type="submit">{loading ? "Thinking…" : "Ask"}</button>
                </form>
                <p className="mt-2 text-xs text-muted">The backend runs the RAG pipeline and returns an answer with sources.</p>
            </div>


            <div className="card">
                <h2 className="mb-2 text-base font-semibold">Answer</h2>
                {error && <p className="text-red-600">{error}</p>}
                {!error && !data && <p className="text-muted">No answer yet.</p>}
                {!error && data && (
                    <div className="space-y-3">
                        <p>{data.answer}</p>
                        {!!data.sources?.length && (
                            <div>
                                <h3 className="mt-3 text-sm font-semibold">Sources</h3>
                                <ul className="list-disc pl-5 text-sm">
                                    {data.sources.map((s, i) => (
                                        <li key={i}>
                                            <span className="font-medium">{s.title || s.id}</span>
                                            {s.score !== undefined && <span className="text-muted"> — score: {s.score.toFixed(3)}</span>}
                                            {s.url && (
                                                <a className="ml-2 underline" href={s.url} target="_blank" rel="noreferrer">open</a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}