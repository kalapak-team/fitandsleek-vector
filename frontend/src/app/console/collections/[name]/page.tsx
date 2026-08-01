"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, uploadUrl } from "@/lib/api";

export default function CollectionDetailPage() {
  const params = useParams<{ name: string }>();
  const name = decodeURIComponent(params.name);
  const [info, setInfo] = useState<Record<string, unknown> | null>(null);
  const [points, setPoints] = useState<Array<Record<string, unknown>>>([]);
  const [snapshots, setSnapshots] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [collection, scroll, snaps] = await Promise.all([
          api.getCollection(name),
          api.scroll(name, 50),
          api.listSnapshots(name),
        ]);
        if (cancelled) return;
        setInfo(collection.result);
        setPoints(scroll.result.points);
        setSnapshots(snaps.result);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [name]);

  async function load() {
    const [collection, scroll, snaps] = await Promise.all([
      api.getCollection(name),
      api.scroll(name, 50),
      api.listSnapshots(name),
    ]);
    setInfo(collection.result);
    setPoints(scroll.result.points);
    setSnapshots(snaps.result);
  }
  async function makeSnapshot() {
    await api.createSnapshot(name);
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mint/70">Collection</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-mist">{name}</h1>
      </div>

      {error && <p className="text-sm text-ember">{error}</p>}

      {info && (
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Points", info.points_count],
            ["Indexed", info.indexed_vectors_count],
            ["Segments", info.segments_count],
            ["Status", info.status],
          ].map(([label, value]) => (
            <div key={String(label)} className="fs-panel p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-mist/45">{String(label)}</p>
              <p className="mt-2 font-display text-2xl text-mint">{String(value)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="fs-panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-mist">Points</h2>
          <button className="fs-btn-ghost" onClick={makeSnapshot}>
            Create snapshot
          </button>
        </div>
        <div className="space-y-3">
          {points.map((p) => {
            const payload = (p.payload || {}) as Record<string, unknown>;
            const img = uploadUrl(payload.filename as string | undefined);
            return (
              <div key={String(p.id)} className="flex items-center gap-4 border border-mist/10 p-3">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="h-14 w-14 object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center bg-mist/5 font-mono text-xs text-mist/40">
                    vec
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-mist">
                    #{String(p.id)} · {String(payload.title || "Untitled")}
                  </p>
                  <p className="truncate text-xs text-mist/45">{JSON.stringify(payload)}</p>
                </div>
              </div>
            );
          })}
          {!points.length && <p className="text-sm text-mist/40">No points</p>}
        </div>
      </div>

      <div className="fs-panel p-5">
        <h2 className="font-display text-xl text-mist">Snapshots</h2>
        <ul className="mt-3 space-y-2 text-sm text-mist/70">
          {snapshots.map((s) => (
            <li key={String(s.name)} className="font-mono text-xs">
              {String(s.name)} · {String(s.size)} bytes
            </li>
          ))}
          {!snapshots.length && <li className="text-mist/40">No snapshots yet</li>}
        </ul>
      </div>
    </div>
  );
}
