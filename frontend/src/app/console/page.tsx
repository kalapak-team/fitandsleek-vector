"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ConsoleOverviewPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState("—");

  useEffect(() => {
    Promise.all([api.getStats(), api.getRoot()])
      .then(([s, root]) => {
        setStats(s.result);
        setVersion(root.version);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  const cards = [
    { label: "Collections", value: stats?.collections ?? "—" },
    { label: "Points", value: stats?.points ?? "—" },
    { label: "Indexed vectors", value: stats?.vectors_indexed ?? "—" },
    { label: "Avg vector size", value: stats?.avg_vector_size ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mint/70">Console</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-mist">Overview</h1>
        <p className="mt-2 text-sm text-mist/55">
          FitandSleek Vector v{version} · API {api.base}
        </p>
      </div>

      {error && (
        <div className="border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember">
          Backend unreachable: {error}. Start PostgreSQL + FastAPI on port 6333.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="fs-panel p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-mist/45">{c.label}</p>
            <p className="mt-3 font-display text-3xl font-bold text-mint">{String(c.value)}</p>
          </div>
        ))}
      </div>

      <div className="fs-panel grid gap-4 p-6 md:grid-cols-3">
        <Link href="/console/collections" className="border border-mist/10 p-4 transition hover:border-mint/40">
          <h2 className="font-display text-lg text-mist">Manage collections</h2>
          <p className="mt-2 text-sm text-mist/50">Create distance configs and inspect point counts.</p>
        </Link>
        <Link href="/console/images" className="border border-mist/10 p-4 transition hover:border-mint/40">
          <h2 className="font-display text-lg text-mist">Image search</h2>
          <p className="mt-2 text-sm text-mist/50">Upload a query image and rank similar products.</p>
        </Link>
        <Link href="/console/upload" className="border border-mist/10 p-4 transition hover:border-mint/40">
          <h2 className="font-display text-lg text-mist">Ingest images</h2>
          <p className="mt-2 text-sm text-mist/50">Embed and upsert catalog photos into a collection.</p>
        </Link>
      </div>
    </div>
  );
}
