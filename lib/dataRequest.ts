/**
 * Signed-token helper for GDPR/CCPA data-deletion confirmation links.
 *
 * /api/data-delete (POST email) → emails a one-time URL containing a
 * 24h-expiring HMAC-signed token. /api/data-delete/confirm verifies the
 * token and performs the deletion.
 *
 * Falls back to STATS_TOKEN if DATA_REQUEST_SECRET is unset, so a single
 * env var rotation can re-key every confirmation link in flight.
 */
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.DATA_REQUEST_SECRET || process.env.STATS_TOKEN || "";

if (!SECRET) {
  console.warn(
    "DATA_REQUEST_SECRET (or STATS_TOKEN fallback) unset — /api/data-delete will reject every confirmation token.",
  );
}

export type DataAction = "delete";

export interface SignedPayload {
  email: string;
  action: DataAction;
  exp: number; // ms epoch
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export function signRequest(
  payload: { email: string; action: DataAction },
  ttlMs: number = TWENTY_FOUR_HOURS,
): string {
  const body: SignedPayload = { ...payload, exp: Date.now() + ttlMs };
  const b64 = Buffer.from(JSON.stringify(body), "utf8").toString("base64url");
  const sig = createHmac("sha256", SECRET).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

export function verifyRequest(token: string): SignedPayload | null {
  if (!SECRET || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;

  const expected = createHmac("sha256", SECRET).update(b64).digest("base64url");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return null;
  try {
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  let parsed: SignedPayload;
  try {
    parsed = JSON.parse(Buffer.from(b64, "base64url").toString("utf8")) as SignedPayload;
  } catch {
    return null;
  }
  if (typeof parsed.exp !== "number" || parsed.exp < Date.now()) return null;
  if (parsed.action !== "delete") return null;
  if (typeof parsed.email !== "string" || !parsed.email) return null;
  return parsed;
}
