"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function ConsoleOverviewPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState("—");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(getUser()?.email ?? null);
    Promise.all([api.getStats(), api.getRoot()])
      .then(([s, root]) => {
        setStats(s.result);
        setVersion(root.version);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  const cards = [
    { label: "Collections", value: stats?.collections ?? "—", hint: "Active indexes", tone: "mint" },
    { label: "Points", value: stats?.points ?? "—", hint: "Stored vectors", tone: "mist" },
    { label: "Indexed vectors", value: stats?.vectors_indexed ?? "—", hint: "Ready to search", tone: "mint" },
    { label: "Avg vector size", value: stats?.avg_vector_size ?? "—", hint: "Dimensions", tone: "mist" },
  ];

  const actions = [
    {
      href: "/console/collections",
      title: "Manage collections",
      body: "Create distance configs and inspect point counts.",
      cta: "Open collections",
    },
    {
      href: "/console/images",
      title: "Image search",
      body: "Upload a query image and rank similar products.",
      cta: "Search images",
    },
    {
      href: "/console/upload",
      title: "Ingest images",
      body: "Embed and upsert catalog photos into a collection.",
      cta: "Upload now",
    },
    {
      href: "/console/api-keys",
      title: "API keys",
      body: "Create or rotate keys for website and app clients.",
      cta: "Manage keys",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mint">Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-mist sm:text-3xl">Overview</h1>
          <p className="mt-1.5 max-w-xl text-sm text-mist/55">
            {email ? `Signed in as ${email}` : "Console"} · FitandSleek Vector v{version}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
              error
                ? "border-ember/40 bg-ember/10 text-ember"
                : "border-mint/30 bg-mint/10 text-mint"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", error ? "bg-ember" : "bg-mint")} />
            {error ? "API offline" : "API connected"}
          </span>
          <code className="max-w-full truncate rounded-md border border-line bg-panel px-2.5 py-1 font-mono text-[11px] text-mist/55">
            {api.base}
          </code>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-ember/35 bg-ember/10 px-4 py-3 text-sm text-ember">
          Backend unreachable: {error}. Start PostgreSQL + FastAPI (Docker maps API to port 6333).
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-line bg-graphite p-4 shadow-sm sm:p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-mist/45">{c.label}</p>
            <p className={cn("mt-2 text-2xl font-bold tracking-tight sm:text-3xl", c.tone === "mint" ? "text-mint" : "text-mist")}>
              {String(c.value)}
            </p>
            <p className="mt-1 text-[11px] text-mist/40">{c.hint}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-mist">Quick actions</h2>
          <Link href="/docs" className="text-xs font-medium text-mint hover:underline">
            View API docs →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group rounded-xl border border-line bg-graphite p-4 transition hover:border-mint/35 hover:bg-panel sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-mist group-hover:text-mint">{a.title}</h3>
                  <p className="mt-1.5 text-sm leading-snug text-mist/50">{a.body}</p>
                </div>
                <span className="mt-0.5 text-mist/30 transition group-hover:translate-x-0.5 group-hover:text-mint">→</span>
              </div>
              <p className="mt-3 text-xs font-semibold text-mint/80">{a.cta}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-line bg-graphite p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-mist">Operator checklist</h2>
        <ul className="mt-3 grid gap-2 text-sm text-mist/60 sm:grid-cols-2">
          <li className="rounded-lg border border-line bg-panel px-3 py-2">1. Keep an API key ready for your website</li>
          <li className="rounded-lg border border-line bg-panel px-3 py-2">2. Create a collection with Cosine distance</li>
          <li className="rounded-lg border border-line bg-panel px-3 py-2">3. Upload catalog images to index products</li>
          <li className="rounded-lg border border-line bg-panel px-3 py-2">4. Test image search before going live</li>
        </ul>
      </section>
    </div>
  );
}
