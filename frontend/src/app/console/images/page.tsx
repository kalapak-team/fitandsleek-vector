"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, uploadUrl } from "@/lib/api";

export default function ImageSearchPage() {
  const [collections, setCollections] = useState<string[]>([]);
  const [collection, setCollection] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

  function onFile(f: File | null) {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function onSearch(e: FormEvent) {
    e.preventDefault();
    if (!file || !collection) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.searchImage(collection, file, 8);
      setResults(res.result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-mist">Image Search</h1>
        <p className="mt-2 text-sm text-mist/55">Visual similarity across FitandSleek catalog embeddings</p>
      </div>

      <form onSubmit={onSearch} className="fs-panel grid gap-5 p-5 md:grid-cols-[240px_1fr]">
        <div>
          <label className="fs-label">Query image</label>
          <label className="flex h-52 cursor-pointer items-center justify-center border border-dashed border-mist/20 bg-ink/40 text-sm text-mist/50 hover:border-mint/40">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="query" className="h-full w-full object-cover" />
            ) : (
              "Drop / choose image"
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
        <div className="space-y-4">
          <div>
            <label className="fs-label">Collection</label>
            <select className="fs-input" value={collection} onChange={(e) => setCollection(e.target.value)}>
              {collections.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <button className="fs-btn" disabled={!file || loading}>
            {loading ? "Searching…" : "Find similar"}
          </button>
          {error && <p className="text-sm text-ember">{error}</p>}
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((r) => {
          const payload = (r.payload || {}) as Record<string, unknown>;
          const img = uploadUrl(payload.filename as string | undefined);
          return (
            <article key={String(r.id)} className="fs-panel overflow-hidden">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" className="aspect-square w-full object-cover" />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-mist/5 text-mist/30">No image</div>
              )}
              <div className="p-3">
                <p className="truncate text-sm text-mist">{String(payload.title || r.id)}</p>
                <p className="mt-1 font-mono text-xs text-mint">score {Number(r.score).toFixed(4)}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
