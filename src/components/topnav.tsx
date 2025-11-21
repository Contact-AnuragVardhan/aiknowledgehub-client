"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/appcontext";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ingest", label: "Ingest" },
  { href: "/query", label: "Query" },
];

export function TopNav() {
  const { state, setSlice, toggleTheme } = useAppContext();
  const user = state.user;
  const theme = state.theme ?? "dark";
  const isLoggedIn = !!user?.username;

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "AI Knowledge Hub";

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <header className="sticky top-0 z-30 mb-4 rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 backdrop-blur-xl shadow-sm">
      <nav className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/90 text-xs font-bold text-slate-950 shadow-sm">
            AI
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              {appName}
            </span>
            <span className="text-[11px] text-slate-400">
              Private RAG workspace
            </span>
          </div>
        </Link>

        {isLoggedIn && (
          <div className="hidden items-center gap-1 text-xs font-medium text-slate-300 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* theme toggle */}
          <button
            type="button"
            onClick={handleThemeToggle}
            className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm hover:border-slate-500 hover:bg-slate-700"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

          {isLoggedIn ? (
            <>
              <span className="hidden text-[11px] text-slate-400 sm:inline">
                {user?.username}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold">
                {user?.username?.charAt(0).toUpperCase() ?? "U"}
              </div>
            </>
          ) : (
            <Link href="/login" className="btn text-xs px-3 py-1.5">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
