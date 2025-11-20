"use client";
import { useEffect, useState } from "react";
import { uploadDocument, listDocs, askQuery } from "@/lib/api";
import type { QueryResponse } from "@/lib/types";


export default function DashboardPage() {
    const [docs, setDocs] = useState<string[]>([]);
    const [selected, setSelected] = useState<string>(""); // "" → all docs
    const [file, setFile] = useState<File | null>(null);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("");
    const [answer, setAnswer] = useState<QueryResponse | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => { (async () => { try { setDocs(await listDocs()); } catch { /* ignore */ } })(); }, []);


    const onUpload = async (e: React.FormEvent) => {
        e.preventDefault(); if (!file) return; setStatus("Uploading…");
        try { const r = await uploadDocument(file); setStatus(`Uploaded: ${r.name || file.name}`); setDocs(await listDocs()); }
        catch (e: any) { setStatus(`Error: ${e?.message || "upload failed"}`); }
    };


    const onAsk = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true); setAnswer(null);
        try { const r = await askQuery(q, selected || null); setAnswer(r); }
        catch (e: any) { setStatus(`Error: ${e?.message || "query failed"}`); }
        finally { setLoading(false); }
    };


    return (
        <div className="grid gap-6 md:grid-cols-2">
            <section className="card">
                <h2 className="mb-2 text-lg font-semibold">Upload</h2>
                <form className="grid gap-3" onSubmit={onUpload}>
                    <input className="input" type="file" accept=".pdf,.doc,.docx,.txt,.csv,.md,.rtf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    <button className="btn" disabled={!file}>Upload</button>
                </form>
                {status && <p className="mt-2 text-sm text-slate-700">{status}</p>}
            </section>


            <section className="card">
                <h2 className="mb-2 text-lg font-semibold">Query</h2>
                <form className="grid gap-3" onSubmit={onAsk}>
                    <select className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
                        <option value="">All Documents</option>
                        {docs.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input className="input" placeholder="Ask a question…" value={q} onChange={(e) => setQ(e.target.value)} />
                    <button className="btn" disabled={!q || loading}>{loading ? "Thinking…" : "Ask"}</button>
                </form>
            </section>


            <section className="card md:col-span-2">
                <h3 className="mb-2 text-base font-semibold">Answer</h3>
                {!answer ? (<p className="text-muted">No answer yet.</p>) : (
                    <div className="space-y-2">
                        <p>{answer.answer}</p>
                        {!!answer.sources?.length && (
                            <ul className="list-disc pl-5 text-sm">
                                {answer.sources.map((s, i) => (
                                    <li key={i}>{s.title || s.id || s as any}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}