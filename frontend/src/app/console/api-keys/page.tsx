"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { clearSession, getApiKey, getToken, getUser, saveApiKey } from "@/lib/auth";

export default function ApiKeysPage() {
  const router = useRouter();
  const [keys, setKeys] = useState<Array<Record<string, unknown>>>([]);
  const [name, setName] = useState("Website key");
  const [freshKey, setFreshKey] = useState<string | null>(null);
  const [storedKey, setStoredKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");

  async function load() {
    const res = await api.listKeys();
    setKeys(res.result);
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    const user = getUser();
    setUserEmail(user?.email || "");
    setStoredKey(getApiKey() || "");
    load().catch((e: Error) => setError(e.message));
  }, [router]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.createKey(name);
      setFreshKey(res.result.api_key);
      saveApiKey(res.result.api_key);
      setStoredKey(res.result.api_key);
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function onRevoke(id: number) {
    await api.revokeKey(id);
    await load();
  }

  function onSaveStored(e: FormEvent) {
    e.preventDefault();
    saveApiKey(storedKey.trim());
    setFreshKey(null);
  }

  function logout() {
    clearSession();
    router.push("/login");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-mist">API Keys</h1>
          <p className="mt-2 text-sm text-mist/55">
            Like Qdrant Cloud — use header <span className="font-mono text-mint">api-key: &lt;your-key&gt;</span>
          </p>
          <p className="mt-1 text-xs text-mist/40">{userEmail}</p>
        </div>
        <button className="fs-btn-ghost" onClick={logout}>
          Logout
        </button>
      </div>

      <form onSubmit={onSaveStored} className="fs-panel space-y-3 p-5">
        <label className="fs-label">Active API key for Console requests</label>
        <input
          className="fs-input font-mono text-xs"
          value={storedKey}
          onChange={(e) => setStoredKey(e.target.value)}
          placeholder="fsv_..."
        />
        <button className="fs-btn" type="submit">
          Save key to browser
        </button>
      </form>

      <form onSubmit={onCreate} className="fs-panel grid gap-4 p-5 md:grid-cols-[1fr_auto]">
        <div>
          <label className="fs-label">Create new key</label>
          <input className="fs-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex items-end">
          <button className="fs-btn w-full">Generate</button>
        </div>
      </form>

      {freshKey && (
        <div className="border border-mint/30 bg-mint/10 p-4">
          <p className="text-sm text-mint">New key (copy now — shown once):</p>
          <code className="mt-2 block break-all font-mono text-xs text-mist">{freshKey}</code>
        </div>
      )}

      {error && <p className="text-sm text-ember">{error}</p>}

      <div className="fs-panel overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-mist/10 text-xs uppercase tracking-[0.14em] text-mist/45">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Prefix</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={String(k.id)} className="border-b border-mist/5">
                <td className="px-4 py-3 text-mist">{String(k.name)}</td>
                <td className="px-4 py-3 font-mono text-xs text-mint">{String(k.key_prefix)}…</td>
                <td className="px-4 py-3 text-mist/70">{String(k.role)}</td>
                <td className="px-4 py-3 text-mist/70">{String(k.is_active)}</td>
                <td className="px-4 py-3 text-right">
                  {k.is_active ? (
                    <button className="text-ember hover:underline" onClick={() => onRevoke(Number(k.id))}>
                      Revoke
                    </button>
                  ) : (
                    <span className="text-mist/30">revoked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
