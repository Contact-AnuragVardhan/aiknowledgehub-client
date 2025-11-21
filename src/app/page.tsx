// src/app/page.tsx
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const hasSession = Boolean((await cookies()).get("JSESSIONID"));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section className="card">
        <span className="badge mb-3">PREVIEW</span>
        <h1 className="mb-3 text-2xl font-semibold tracking-tight text-card-heading">
          Turn your documents &amp; internal links into an AI-ready knowledge
          hub.
        </h1>
        <p className="mb-5 text-sm text-card-main">
          Upload PDFs, Word files, or plug in URLs from your internal sites, then
          ask natural language questions. The backend runs your RAG pipeline and
          returns answers with citations.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {hasSession ? (
            <Link className="btn" href="/dashboard">
              Open dashboard →
            </Link>
          ) : (
            <Link className="btn" href="/login">
              Login / Register →
            </Link>
          )}
          <span className="chip">Java + Python backend</span>
          <span className="chip">pgvector / RAG</span>
        </div>

        <div className="mt-6 grid gap-3 text-xs">
          <div>
            <p className="font-semibold text-card-heading">1. Ingest</p>
            <p className="text-card-muted">
              Upload documents or add URLs; backend chunks &amp; embeds.
            </p>
          </div>
          <div>
            <p className="font-semibold text-card-heading">2. Search</p>
            <p className="text-card-muted">
              Hybrid BM25 + semantic retrieval (configurable per your backend).
            </p>
          </div>
          <div>
            <p className="font-semibold text-card-heading">3. Answer</p>
            <p className="text-card-muted">
              Chat-style answers with sources and scores from your own data.
            </p>
          </div>
        </div>
      </section>

      <aside className="card">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-card-heading">
          What you can do here
        </h2>
        <ul className="space-y-2 text-xs text-card-main">
          <li>• Upload policy PDFs and ask compliance questions.</li>
          <li>• Point to Confluence / wiki URLs (backend URL ingester).</li>
          <li>• Summarize long documents with citations.</li>
          <li>• Ask &quot;what changed&quot; style questions across versions.</li>
        </ul>
      </aside>
    </div>
  );
}
