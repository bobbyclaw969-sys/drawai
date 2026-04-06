/**
 * Distributed rate limiter — uses Supabase as the backend so limits
 * are enforced globally across all Vercel serverless instances.
 * Falls back to an in-memory Map if Supabase is unavailable.
 *
 * Requires the `rate_limits` table + `check_rate_limit` function:
 *   supabase/rate_limits.sql
 */
import { createClient } from "@supabase/supabase-js";

// ── In-memory fallback ────────────────────────────────────────────────────────
interface RateLimitRecord { count: number; resetAt: number; }
const store = new Map<string, RateLimitRecord>();
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, r] of store.entries()) if (now > r.resetAt) store.delete(k);
  }, 5 * 60_000);
}

function inMemoryCheck(
  identifier: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const rec = store.get(identifier);
  if (!rec || now > rec.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }
  if (rec.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: rec.resetAt - now };
  }
  rec.count++;
  return { allowed: true, remaining: limit - rec.count, retryAfterMs: 0 };
}

// ── Supabase client (server-side only) ───────────────────────────────────────
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function rateLimit(
  identifier: string,
  limit = 20,
  windowMs = 60_000,
): Promise<{ allowed: boolean; remaining: number; retryAfterMs: number }> {
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.rpc("check_rate_limit", {
        p_key: identifier,
        p_limit: limit,
        p_window_ms: windowMs,
      });
      if (!error && data && data.length > 0) {
        const row = data[0];
        return {
          allowed: row.allowed,
          remaining: row.remaining,
          retryAfterMs: Number(row.retry_after_ms ?? 0),
        };
      }
    }
  } catch {
    // Fall through to in-memory
  }
  return inMemoryCheck(identifier, limit, windowMs);
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
