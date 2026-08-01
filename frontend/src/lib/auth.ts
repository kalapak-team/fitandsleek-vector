const TOKEN_KEY = "fsv_access_token";
const API_KEY_KEY = "fsv_api_key";
const USER_KEY = "fsv_user";

export type AuthUser = {
  id: number;
  email: string;
  full_name: string;
  role: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(API_KEY_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveSession(opts: { token: string; user: AuthUser; apiKey?: string | null }) {
  localStorage.setItem(TOKEN_KEY, opts.token);
  localStorage.setItem(USER_KEY, JSON.stringify(opts.user));
  if (opts.apiKey) localStorage.setItem(API_KEY_KEY, opts.apiKey);
}

export function saveApiKey(apiKey: string) {
  localStorage.setItem(API_KEY_KEY, apiKey);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(API_KEY_KEY);
  localStorage.removeItem(USER_KEY);
}

export function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const apiKey = getApiKey();
  const token = getToken();
  if (apiKey) headers["api-key"] = apiKey;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
