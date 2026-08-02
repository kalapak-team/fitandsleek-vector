"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.register({ email, password, full_name: fullName, role });
      saveSession({
        token: res.result.access_token,
        user: res.result.user,
        apiKey: res.result.api_key,
      });
      setApiKey(res.result.api_key);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-ink bg-hero-glow">
      <div className="absolute right-5 top-5 z-10 md:right-8 md:top-8">
        <ThemeToggle />
      </div>
      <div className="fs-container flex min-h-screen items-center justify-center py-16">
        <div className="fs-panel w-full max-w-lg p-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-mint/70">Qdrant-style account</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-mist">Create account</h1>
          <p className="mt-2 text-sm text-mist/55">Register and receive your API key immediately — like Qdrant Cloud.</p>

          {!apiKey ? (
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label className="fs-label">Full name</label>
                <input className="fs-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <label className="fs-label">Email</label>
                <input className="fs-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="fs-label">Password</label>
                <input
                  className="fs-input"
                  type="password"
                  minLength={6}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="fs-label">Role</label>
                <select className="fs-input" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="mt-1 text-xs text-mist/40">First account is always promoted to Admin.</p>
              </div>
              {error && <p className="text-sm text-ember">{error}</p>}
              <button className="fs-btn w-full" disabled={loading}>
                {loading ? "Creating…" : "Create account & get API key"}
              </button>
            </form>
          ) : (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-mint">Account created. Save this API key now — it won&apos;t be shown again.</p>
              <code className="block break-all rounded-sm border border-line bg-ink/70 p-4 font-mono text-xs text-mint">
                {apiKey}
              </code>
              <p className="text-xs text-mist/50">
                Use header: <span className="font-mono text-mist">api-key: {apiKey.slice(0, 12)}…</span>
              </p>
              <div className="flex gap-3">
                <button className="fs-btn" onClick={() => navigator.clipboard.writeText(apiKey)}>
                  Copy key
                </button>
                <button className="fs-btn-ghost" onClick={() => router.push("/console")}>
                  Open Console
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 text-sm text-mist/45">
            Already have an account?{" "}
            <Link href="/login" className="text-mint hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
