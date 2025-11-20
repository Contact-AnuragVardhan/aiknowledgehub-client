"use client";

export function Spinner() {
    return (
        <div className="inline-flex items-center gap-2 text-sm text-slate-600">
            <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity=".2" /><path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="4" /></svg>
            Loading…
        </div>
    );
}