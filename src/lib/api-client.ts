"use client";

const TOKEN_STORAGE_KEY = "booknook_jwt_token";

export async function ensureJwtToken(
  email?: string,
  name?: string
): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const existing = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (existing) {
    try {
      const payloadPart = existing.split(".")[1];
      if (payloadPart) {
        const decoded = JSON.parse(
          atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"))
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
  } catch (err) {
    console.error("Failed to fetch JWT token:", err);
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
  name?: string
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

