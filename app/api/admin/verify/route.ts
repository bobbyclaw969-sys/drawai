/**
 * /api/admin/verify
 *
 * Admin-only endpoint for upserting and deleting deadline verifications.
 * Uses SUPABASE_SERVICE_ROLE_KEY server-side. Never exposed to the browser.
 *
 * Authentication:
 *   - Reads Supabase auth session from request cookies via @supabase/ssr
 *   - Validates user.email is in process.env.ADMIN_EMAILS (comma-separated)
 *   - Returns 403 if not authorized
 *
 * Methods:
 *   POST   { state_id, species, source_url, source_label, season_year,
 *            notes?, close_date_confirmed?, fee_nr_confirmed?, verified_by }
 *   DELETE { state_id, species, season_year }
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { logError } from "@/lib/errorLog";

export const maxDuration = 15;

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Build a server-side Supabase auth client that reads cookies from the request. */
function getAuthClient(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll() {
          // No-op — we never set cookies from this route handler.
        },
      },
    },
  );
}

/** Service-role client for privileged writes. */
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/** Validate the request comes from an admin and return their email. */
async function requireAdmin(req: NextRequest): Promise<{ email: string } | NextResponse> {
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) {
    return NextResponse.json(
      { error: "Admin access not configured" },
      { status: 503 },
    );
  }

  const supabase = getAuthClient(req);
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();

  if (!email || !adminEmails.includes(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { email };
}

// ── POST: upsert ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json() as {
      state_id?: string;
      species?: string;
      source_url?: string;
      source_label?: string;
      season_year?: number;
      notes?: string | null;
      close_date_confirmed?: string | null;
      fee_nr_confirmed?: number | null;
    };

    // Required-field validation
    const stateId = body.state_id?.trim().toLowerCase();
    const species = body.species?.trim().toLowerCase();
    const sourceUrl = body.source_url?.trim();
    const sourceLabel = body.source_label?.trim();
    const seasonYear = Number(body.season_year);

    if (!stateId || !species || !sourceUrl || !sourceLabel || !Number.isInteger(seasonYear)) {
      return NextResponse.json(
        { error: "Missing required field: state_id, species, source_url, source_label, season_year" },
        { status: 400 },
      );
    }
    if (sourceUrl.length > 2000 || sourceLabel.length > 200) {
      return NextResponse.json({ error: "Source URL or label too long" }, { status: 400 });
    }
    try {
      new URL(sourceUrl);
    } catch {
      return NextResponse.json({ error: "Invalid source URL" }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { error } = await supabase
      .from("deadline_verifications")
      .upsert({
        state_id: stateId,
        species,
        source_url: sourceUrl,
        source_label: sourceLabel,
        season_year: seasonYear,
        notes: body.notes?.trim() || null,
        close_date_confirmed: body.close_date_confirmed || null,
        fee_nr_confirmed:
          typeof body.fee_nr_confirmed === "number" && Number.isFinite(body.fee_nr_confirmed)
            ? body.fee_nr_confirmed
            : null,
        verified_by: auth.email,
        verified_at: new Date().toISOString(),
      }, { onConflict: "state_id,species,season_year" });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin verify POST error:", err);
    void logError("api/admin/verify[POST]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

// ── DELETE: remove verification ─────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json() as {
      state_id?: string;
      species?: string;
      season_year?: number;
    };

    const stateId = body.state_id?.trim().toLowerCase();
    const species = body.species?.trim().toLowerCase();
    const seasonYear = Number(body.season_year);

    if (!stateId || !species || !Number.isInteger(seasonYear)) {
      return NextResponse.json(
        { error: "Missing required field: state_id, species, season_year" },
        { status: 400 },
      );
    }

    const supabase = getServiceClient();
    const { error } = await supabase
      .from("deadline_verifications")
      .delete()
      .eq("state_id", stateId)
      .eq("species", species)
      .eq("season_year", seasonYear);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin verify DELETE error:", err);
    void logError("api/admin/verify[DELETE]", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
