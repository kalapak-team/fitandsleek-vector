"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function RecommendPage() {
  const [collections, setCollections] = useState<string[]>([]);
  const [collection, setCollection] = useState("");
  const [positive, setPositive] = useState("1");
  const [negative, setNegative] = useState("");
  const [results, setResults] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState<string | null>(null);

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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const body = {
        positive: positive
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
          .map((x) => (/^\d+$/.test(x) ? Number(x) : x)),
        negative: negative
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
          .map((x) => (/^\d+$/.test(x) ? Number(x) : x)),
        limit: 8,
        with_payload: true,
      };
      const res = await fetch(
        `${api.base}/collections/${encodeURIComponent(collection)}/points/recommend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Recommend failed");
      setResults(data.result);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-mist">Recommend</h1>
        <p className="mt-2 text-sm text-mist/55">Qdrant-style positive / negative example recommendations</p>
      </div>

      <form onSubmit={onSubmit} className="fs-panel grid gap-4 p-5 md:grid-cols-3">
        <div>
          <label className="fs-label">Collection</label>
          <select className="fs-input" value={collection} onChange={(e) => setCollection(e.target.value)}>
            {collections.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="fs-label">Positive ids</label>
          <input className="fs-input" value={positive} onChange={(e) => setPositive(e.target.value)} placeholder="1,2" />
        </div>
        <div>
          <label className="fs-label">Negative ids</label>
          <input className="fs-input" value={negative} onChange={(e) => setNegative(e.target.value)} placeholder="5" />
        </div>
        <div className="md:col-span-3">
          <button className="fs-btn">Recommend</button>
        </div>
      </form>

      {error && <p className="text-sm text-ember">{error}</p>}

      <div className="space-y-3">
        {results.map((r) => (
          <div key={String(r.id)} className="fs-panel flex justify-between p-4">
            <p className="text-mist">
              #{String(r.id)} · {String((r.payload as Record<string, unknown>)?.title || "Untitled")}
            </p>
            <p className="font-mono text-mint">{Number(r.score).toFixed(4)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
