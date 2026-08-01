import { authHeaders } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6333";

export type ApiEnvelope<T> = {
  result: T;
  status: string;
  time: number;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...authHeaders(),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail || JSON.stringify(data);
    } catch {
      /* ignore */
    }
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }

  return res.json();
}

export const api = {
  base: API_BASE,
  register: (body: { email: string; password: string; full_name?: string; role?: string }) =>
    request<
      ApiEnvelope<{
        user: { id: number; email: string; full_name: string; role: string };
        access_token: string;
        api_key: string;
        message: string;
      }>
    >("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<
      ApiEnvelope<{
        user: { id: number; email: string; full_name: string; role: string };
        access_token: string;
        api_keys: Array<Record<string, unknown>>;
        message: string;
      }>
    >("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request<ApiEnvelope<Record<string, unknown>>>("/auth/me"),
  listKeys: () => request<ApiEnvelope<Array<Record<string, unknown>>>>("/auth/keys"),
  createKey: (name: string) =>
    request<ApiEnvelope<{ api_key: string; api_key_info: Record<string, unknown>; message: string }>>("/auth/keys", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  revokeKey: (id: number) => request<ApiEnvelope<boolean>>(`/auth/keys/${id}`, { method: "DELETE" }),
  getRoot: () => request<{ title: string; version: string }>("/"),
  getStats: () => request<ApiEnvelope<Record<string, unknown>>>("/stats"),
  getTelemetry: () => request<Record<string, unknown>>("/telemetry"),
  listCollections: () =>
    request<ApiEnvelope<{ collections: { name: string }[] }>>("/collections"),
  getCollection: (name: string) => request<ApiEnvelope<Record<string, unknown>>>(`/collections/${encodeURIComponent(name)}`),
  createCollection: (name: string, size: number, distance: string) =>
    request<ApiEnvelope<boolean>>(`/collections/${encodeURIComponent(name)}`, {
      method: "PUT",
      body: JSON.stringify({ vectors: { size, distance } }),
    }),
  deleteCollection: (name: string) =>
    request<ApiEnvelope<boolean>>(`/collections/${encodeURIComponent(name)}`, { method: "DELETE" }),
  search: (name: string, vector: number[], limit = 10) =>
    request<ApiEnvelope<Array<Record<string, unknown>>>>(
      `/collections/${encodeURIComponent(name)}/points/search`,
      {
        method: "POST",
        body: JSON.stringify({ vector, limit, with_payload: true }),
      }
    ),
  scroll: (name: string, limit = 20) =>
    request<ApiEnvelope<{ points: Array<Record<string, unknown>>; next_page_offset: string | null }>>(
      `/collections/${encodeURIComponent(name)}/points/scroll`,
      {
        method: "POST",
        body: JSON.stringify({ limit, with_payload: true, with_vector: false }),
      }
    ),
  upsertPoints: (name: string, points: Array<{ id: string | number; vector: number[]; payload?: Record<string, unknown> }>) =>
    request<ApiEnvelope<Record<string, unknown>>>(`/collections/${encodeURIComponent(name)}/points`, {
      method: "PUT",
      body: JSON.stringify({ points }),
    }),
  deletePoints: (name: string, points: Array<string | number>) =>
    request<ApiEnvelope<Record<string, unknown>>>(`/collections/${encodeURIComponent(name)}/points/delete`, {
      method: "POST",
      body: JSON.stringify({ points }),
    }),
  count: (name: string) =>
    request<ApiEnvelope<{ count: number }>>(`/collections/${encodeURIComponent(name)}/points/count`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
  listSnapshots: (name: string) =>
    request<ApiEnvelope<Array<Record<string, unknown>>>>(`/collections/${encodeURIComponent(name)}/snapshots`),
  createSnapshot: (name: string) =>
    request<ApiEnvelope<{ name: string }>>(`/collections/${encodeURIComponent(name)}/snapshots`, {
      method: "POST",
    }),
  uploadImagePoint: async (name: string, file: File, meta?: { title?: string; category?: string; point_id?: string }) => {
    const form = new FormData();
    form.append("file", file);
    if (meta?.title) form.append("title", meta.title);
    if (meta?.category) form.append("category", meta.category);
    if (meta?.point_id) form.append("point_id", meta.point_id);
    return request<ApiEnvelope<Record<string, unknown>>>(
      `/collections/${encodeURIComponent(name)}/points/upload-image`,
      { method: "POST", body: form }
    );
  },
  searchImage: async (name: string, file: File, limit = 8) => {
    const form = new FormData();
    form.append("collection_name", name);
    form.append("file", file);
    form.append("limit", String(limit));
    form.append("with_payload", "true");
    return request<ApiEnvelope<Array<Record<string, unknown>>> & { query?: Record<string, string> }>(
      `/search/image`,
      { method: "POST", body: form }
    );
  },
  embedText: async (text: string, size = 512) => {
    const form = new FormData();
    form.append("text", text);
    form.append("size", String(size));
    return request<ApiEnvelope<{ vector: number[]; size: number; model: string }>>(`/embed/text`, {
      method: "POST",
      body: form,
    });
  },
};

export function uploadUrl(filename?: string) {
  if (!filename) return null;
  return `${API_BASE}/uploads/${filename}`;
}
