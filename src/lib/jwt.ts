import crypto from "crypto";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.BETTER_AUTH_SECRET ||
  "booknook-super-secret-jwt-key-2026-secure";

export interface JwtPayload {
  email: string;
  name?: string;
  sub?: string;
  iat?: number;
  exp?: number;
}

function base64UrlEncode(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

/**
 * Sign a standard HS256 JWT token
 */
export function signJwt(
  payload: Omit<JwtPayload, "iat" | "exp">,
  expiresInSeconds = 7 * 24 * 60 * 60
): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(signingInput)
    .digest();
  const encodedSignature = base64UrlEncode(signature);

  return `${signingInput}.${encodedSignature}`;
}

/**
 * Verify and decode a standard HS256 JWT token
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = base64UrlEncode(
      crypto.createHmac("sha256", JWT_SECRET).update(signingInput).digest()
    );

    if (encodedSignature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Verify JWT or BetterAuth session on incoming API requests
 */
export async function verifyRequestAuth(
  req: NextRequest
): Promise<JwtPayload | null> {
  // 1. Check Authorization: Bearer <token> header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    const verified = verifyJwt(token);
    if (verified) return verified;
  }

  // 2. Check booknook_jwt cookie
  const cookieToken = req.cookies.get("booknook_jwt")?.value;
  if (cookieToken) {
    const verified = verifyJwt(cookieToken);
    if (verified) return verified;
  }

  // 3. Fallback to BetterAuth active session
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (session?.user?.email) {
      return {
        email: session.user.email,
        name: session.user.name || undefined,
        sub: session.user.id,
      };
    }
  } catch {
    // Ignore session error
  }

  return null;
}

