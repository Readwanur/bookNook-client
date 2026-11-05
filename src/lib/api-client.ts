"use client";

const TOKEN_STORAGE_KEY = process.env.TOKEN_STORAGE_KEY as string;
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function ensureJwtToken(
  email?: string,
  name?: string,
): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const existing = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (existing) {
    try {
      const payloadPart = existing.split(".")[1];
      if (payloadPart) {
        const decoded = JSON.parse(
          atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/")),
        );
        const now = Math.floor(Date.now() / 1000);
        if (
          (!decoded.exp || decoded.exp > now + 60) &&
          (!email || decoded.email === email)
        ) {
          return existing;
        }
      }
    } catch {
      // Token malformed, request a new one
    }
  }

  // Request JWT from Next.js /api/jwt (same secret, zero CORS failures)
  try {
    const res = await fetch("/api/jwt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        return data.token;
      }
    }
  } catch {
    // Ignore
  }

  return null;
}

export async function clearJwtToken(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
  try {
    await fetch("/api/jwt", { method: "DELETE" });
  } catch {
    // Ignore
  }
}

export async function getAuthHeaders(
  email?: string,
  name?: string,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = await ensureJwtToken(email, name);
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Tries the Express backend (NEXT_PUBLIC_SERVER_URL) first; if unreachable,
 * blocked by CORS, or route not yet added (404/401/403), seamlessly falls back
 * to the built-in Next.js MongoDB API route so the app never breaks.
 */
export async function fetchWithFallback(
  expressPath: string,
  nextApiPath: string,
  options?: RequestInit,
): Promise<Response> {
  try {
    const expressRes = await fetch(`${SERVER_URL}${expressPath}`, options);
    if (expressRes.ok || expressRes.status === 409) {
      // Clone and verify body is non-empty JSON before returning
      const cloned = expressRes.clone();
      const text = await cloned.text();
      if (text && text.trim().length > 0) {
        return expressRes;
      }
    }
  } catch {
    // Network or CORS error on Express server — fall back to Next.js API route
  }

  return fetch(nextApiPath, options);
}
