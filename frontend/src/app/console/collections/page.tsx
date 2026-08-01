"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";

type CollectionRow = {
  name: string;
  points_count?: number;
  status?: string;
  config?: { params?: { vectors?: { size?: number; distance?: string } } };
};

export default function CollectionsPage() {
  const [rows, setRows] = useState<CollectionRow[]>([]);
  const [name, setName] = useState("fitandsleek_products");
  const [size, setSize] = useState(512);
  const [distance, setDistance] = useState("Cosine");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const list = await api.listCollections();
    const detailed = await Promise.all(
      list.result.collections.map(async (c) => {
        const info = await api.getCollection(c.name);
        return { name: c.name, ...(info.result as object) } as CollectionRow;
      })
    );
    setRows(detailed);
  }

  useEffect(() => {
    load().catch((e: Error) => setError(e.message));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await api.createCollection(name, size, distance);
      setMessage(`Created collection \`${name}\``);
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function onDelete(collectionName: string) {
    if (!confirm(`Delete collection ${collectionName}?`)) return;
    await api.deleteCollection(collectionName);
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-mist">Collections</h1>
        <p className="mt-2 text-sm text-mist/55">Qdrant-compatible collection management</p>
      </div>

      <form onSubmit={onCreate} className="fs-panel grid gap-4 p-5 md:grid-cols-4">
        <div>
          <label className="fs-label">Name</label>
          <input className="fs-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="fs-label">Vector size</label>
          <input
            className="fs-input"
            type="number"
            min={1}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="fs-label">Distance</label>
          <select className="fs-input" value={distance} onChange={(e) => setDistance(e.target.value)}>
            <option>Cosine</option>
            <option>Euclid</option>
            <option>Dot</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="fs-btn w-full" type="submit">
            Create
          </button>
        </div>
      </form>

      {message && <p className="text-sm text-mint">{message}</p>}
      {error && <p className="text-sm text-ember">{error}</p>}

      <div className="fs-panel overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-mist/10 text-xs uppercase tracking-[0.14em] text-mist/45">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Points</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Distance</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-mist/5">
                <td className="px-4 py-3">
                  <Link className="text-mint hover:underline" href={`/console/collections/${encodeURIComponent(row.name)}`}>
                    {row.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-mist/80">{row.points_count ?? 0}</td>
                <td className="px-4 py-3 text-mist/80">{row.config?.params?.vectors?.size ?? "—"}</td>
                <td className="px-4 py-3 text-mist/80">{row.config?.params?.vectors?.distance ?? "—"}</td>
                <td className="px-4 py-3 text-mint">{row.status ?? "green"}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-ember hover:underline" onClick={() => onDelete(row.name)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-mist/40">
                  No collections yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
