/**
 * Server-side only analytics logger.
 * Writes to Supabase usage_events table.
 * No PII — IPs are hashed with a daily rotating salt.
 */
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function hashIp(ip: string): string {
  // Daily rotating salt — can count unique daily users without storing IPs
  const salt = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return createHash("sha256").update(ip + salt + "taghunter").digest("hex").slice(0, 16);
}

export type EventType = "strategy" | "find" | "chat";

export async function logEvent(
  eventType: EventType,
  ip: string,
  metadata?: { species?: string[]; states?: string[] }
): Promise<void> {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.from("usage_events").insert({
      event_type: eventType,
      ip_hash: hashIp(ip),
      species: metadata?.species ?? [],
      states: metadata?.states ?? [],
    });
  } catch {
    // Analytics failure must never break the main request
  }
}

export async function getStats() {
  const supabase = getSupabase();
  if (!supabase) return null;

  const now = new Date();
  const last24h = new Date(now.getTime() - 86_400_000).toISOString();
  const last7d  = new Date(now.getTime() - 7 * 86_400_000).toISOString();
  const last30d = new Date(now.getTime() - 30 * 86_400_000).toISOString();

  const [total, day, week, month, byType] = await Promise.all([
    supabase.from("usage_events").select("id", { count: "exact", head: true }),
    supabase.from("usage_events").select("id", { count: "exact", head: true }).gte("created_at", last24h),
    supabase.from("usage_events").select("id", { count: "exact", head: true }).gte("created_at", last7d),
    supabase.from("usage_events").select("id", { count: "exact", head: true }).gte("created_at", last30d),
    supabase.from("usage_events").select("event_type, ip_hash").gte("created_at", last30d),
  ]);

  const events = byType.data ?? [];
  const typeCounts = { strategy: 0, find: 0, chat: 0 };
  const uniqueHashes = new Set<string>();

  for (const e of events) {
    typeCounts[e.event_type as EventType] = (typeCounts[e.event_type as EventType] ?? 0) + 1;
    uniqueHashes.add(e.ip_hash);
  }

  return {
    total: total.count ?? 0,
    last24h: day.count ?? 0,
    last7d: week.count ?? 0,
    last30d: month.count ?? 0,
    uniqueUsers30d: uniqueHashes.size,
    byType: typeCounts,
  };
}
