/**
 * Deadline verification data layer.
 *
 * Reads use the public Supabase anon client (RLS allows SELECT for all).
 * Writes go through /api/admin/verify which uses the service role key
 * server-side and gates by ADMIN_EMAILS — never expose service role here.
 */
import { createClient } from "@/lib/supabase/client";

export interface DeadlineVerification {
  id: string;
  state_id: string;
  species: string;
  verified_at: string;
  verified_by: string;
  source_url: string;
  source_label: string;
  season_year: number;
  notes: string | null;
  close_date_confirmed: string | null; // ISO date YYYY-MM-DD
  fee_nr_confirmed: number | null;
}

export type VerificationInput = Omit<DeadlineVerification, "id" | "verified_at">;

/** Fetch all verifications for a given season year. */
export async function getAllVerifications(year: number): Promise<DeadlineVerification[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("deadline_verifications")
    .select("*")
    .eq("season_year", year)
    .order("verified_at", { ascending: false });
  if (error || !data) return [];
  return data as DeadlineVerification[];
}

/** Fetch a single verification by composite key. */
export async function getVerification(
  stateId: string,
  species: string,
  year: number,
): Promise<DeadlineVerification | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("deadline_verifications")
    .select("*")
    .eq("state_id", stateId)
    .eq("species", species)
    .eq("season_year", year)
    .maybeSingle();
  if (error || !data) return null;
  return data as DeadlineVerification;
}

/**
 * Upsert a verification — POSTs to the admin API route.
 * The route validates admin status and uses the service role key.
 */
export async function upsertVerification(input: VerificationInput): Promise<void> {
  const res = await fetch("/api/admin/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Failed to verify (${res.status})`);
  }
}

/**
 * Delete a verification — DELETEs to the admin API route.
 */
export async function deleteVerification(
  stateId: string,
  species: string,
  year: number,
): Promise<void> {
  const res = await fetch("/api/admin/verify", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state_id: stateId, species, season_year: year }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Failed to delete (${res.status})`);
  }
}

/** Build a Map keyed by `${state_id}-${species}` for quick lookup in render loops. */
export function buildVerificationMap(verifications: DeadlineVerification[]): Map<string, DeadlineVerification> {
  const map = new Map<string, DeadlineVerification>();
  for (const v of verifications) {
    map.set(`${v.state_id}-${v.species}`, v);
  }
  return map;
}
