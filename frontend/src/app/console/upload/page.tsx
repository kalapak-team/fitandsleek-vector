"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function UploadPage() {
  const [collections, setCollections] = useState<string[]>([]);
  const [collection, setCollection] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("apparel");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || !collection) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await api.uploadImagePoint(collection, file, { title, category });
      setMessage(`Upserted image into ${collection} (${res.time}s)`);
      setFile(null);
      setTitle("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-mist">Upload Images</h1>
        <p className="mt-2 text-sm text-mist/55">Auto-embed and upsert points with payload metadata</p>
      </div>

      <form onSubmit={onSubmit} className="fs-panel grid max-w-xl gap-4 p-5">
        <div>
          <label className="fs-label">Collection</label>
          <select className="fs-input" value={collection} onChange={(e) => setCollection(e.target.value)}>
            {collections.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="fs-label">Title</label>
          <input className="fs-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Night Runner" />
        </div>
        <div>
          <label className="fs-label">Category</label>
          <input className="fs-input" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div>
          <label className="fs-label">Image file</label>
          <input
            className="fs-input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <button className="fs-btn" disabled={loading}>
          {loading ? "Uploading…" : "Embed & upsert"}
        </button>
        {message && <p className="text-sm text-mint">{message}</p>}
        {error && <p className="text-sm text-ember">{error}</p>}
      </form>
    </div>
  );
}
