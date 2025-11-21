// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, registerUser } from "@/lib/api";
import { useAppContext } from "@/contexts/appcontext";

export default function LoginPage() {
  const router = useRouter();
  const { setSlice } = useAppContext();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await login(username, password);

        // save user in generic context
        setSlice("user", { username: res?.username || username });

        router.push("/dashboard");
      } else {
        await registerUser(username, password);
        setMode("login");
      }
    } catch (e: any) {
      setErr(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-[1.4fr,1fr]">
      {/* Main form card */}
      <section className="card">
        <span className="badge mb-3">WELCOME BACK</span>
        <h1 className="mb-2 text-xl font-semibold text-card-heading">
          Sign in to your workspace
        </h1>
        <p className="mb-5 text-sm text-card-main">
          Authentication is handled by your existing Java backend. Once signed
          in, you&apos;ll land in the unified dashboard with document upload,
          URL ingestion, and query tabs.
        </p>

        <form className="grid gap-3" onSubmit={onSubmit}>
          <div className="grid gap-1">
            <label className="text-xs font-medium text-card-main">
              Username
            </label>
            <input
              className="input"
              placeholder="you@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs font-medium text-card-main">
              Password
            </label>
            <input
              className="input"
              placeholder="••••••••"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn mt-2"
            disabled={!username || !password || loading}
            type="submit"
          >
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Sign in"
              : "Create account"}
          </button>

          {err && (
            <p className="mt-1 text-xs text-red-500">
              {err}
            </p>
          )}
        </form>

        <p className="mt-4 text-xs text-card-muted">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button
                type="button"
                className="font-medium text-sky-600 hover:underline dark:text-sky-400"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Have an account?{" "}
              <button
                type="button"
                className="font-medium text-sky-600 hover:underline dark:text-sky-400"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </p>
      </section>

      {/* Security notes card */}
      <aside className="card">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-card-heading">
          Security notes
        </h2>
        <ul className="space-y-2 text-xs text-card-main">
          <li>• Credentials are sent only to your backend endpoints.</li>
          <li>• Session is tracked via the existing JSESSIONID cookie.</li>
          <li>• Frontend does not store your password.</li>
        </ul>
      </aside>
    </div>
  );
}
