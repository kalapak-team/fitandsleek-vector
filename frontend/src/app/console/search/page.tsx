"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function VectorSearchPage() {
  const [collections, setCollections] = useState<string[]>([]);
  const [collection, setCollection] = useState("");
  const [text, setText] = useState("emerald tee athletic");
  const [limit, setLimit] = useState(8);
  const [results, setResults] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .listCollections()
      .then((res) => {
        const names = res.result.collections.map((c) => c.name);
        setCollections(names);
        if (names.length) setCollection(names[0]);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  async function onSearch(e: FormEvent) {
    e.preventDefault();
    if (!collection) return;
    setLoading(true);
    setError(null);
    try {
      const sizeRes = await api.getCollection(collection);
      const size =
        ((sizeRes.result as { config?: { params?: { vectors?: { size?: number } } } }).config?.params?.vectors
          ?.size as number) || 512;
      const embedded = await api.embedText(text, size);
      const search = await api.search(collection, embedded.result.vector, limit);
      setResults(search.result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-mist">Vector Search</h1>
        <p className="mt-2 text-sm text-mist/55">Embed text → search nearest points (Qdrant `/points/search`)</p>
      </div>

      <form onSubmit={onSearch} className="fs-panel grid gap-4 p-5 md:grid-cols-4">
        <div>
          <label className="fs-label">Collection</label>
          <select className="fs-input" value={collection} onChange={(e) => setCollection(e.target.value)}>
            {collections.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="fs-label">Query text</label>
          <input className="fs-input" value={text} onChange={(e) => setText(e.target.value)} required />
        </div>
        <div>
          <label className="fs-label">Limit</label>
          <input
            className="fs-input"
            type="number"
            min={1}
            max={100}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
        </div>
        <div className="md:col-span-4">
          <button className="fs-btn" disabled={loading}>
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      {error && <p className="text-sm text-ember">{error}</p>}

      <div className="space-y-3">
        {results.map((r) => (
          <div key={String(r.id)} className="fs-panel flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-mist">
                #{String(r.id)} · {String((r.payload as Record<string, unknown>)?.title || "Untitled")}
              </p>
              <p className="text-xs text-mist/45">{JSON.stringify(r.payload)}</p>
            </div>
            <p className="font-mono text-sm text-mint">{Number(r.score).toFixed(4)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
