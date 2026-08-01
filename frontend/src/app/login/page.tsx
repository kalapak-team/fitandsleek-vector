"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({ email, password });
      saveSession({
        token: res.result.access_token,
        user: res.result.user,
        apiKey: null,
      });
      router.push("/console/api-keys");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink bg-hero-glow">
      <div className="fs-container flex min-h-screen items-center justify-center py-16">
        <div className="fs-panel w-full max-w-lg p-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-mint/70">Welcome back</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-mist">Login</h1>
          <p className="mt-2 text-sm text-mist/55">
            After login, create or paste your API key (Qdrant style) to call the Vector API.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="fs-label">Email</label>
              <input className="fs-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="fs-label">Password</label>
              <input
                className="fs-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-ember">{error}</p>}
            <button className="fs-btn w-full" disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-mist/45">
            New here?{" "}
            <Link href="/register" className="text-mint hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
