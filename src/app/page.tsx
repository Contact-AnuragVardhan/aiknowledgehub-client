import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  // change it later
  const hasSession = Boolean((await cookies()).get("JSESSIONID"));
  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-2">AI Knowledge Hub</h1>
      <p className="text-sm text-muted mb-4">Upload. Search. Cite.</p>
      <div className="flex gap-3">
        {hasSession ? (
          <Link className="btn" href="/dashboard">Open Dashboard →</Link>
        ) : (
          <Link className="btn" href="/login">Login / Register →</Link>
        )}
      </div>
    </div>
  );
}
