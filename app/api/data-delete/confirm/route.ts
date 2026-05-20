/**
 * GET /api/data-delete/confirm?token=...
 *
 * Verifies the HMAC token issued by /api/data-delete, then deletes
 * every row keyed on the confirmed email from public tables. Always
 * redirects to a status page — never returns JSON to the browser.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyRequest } from "@/lib/dataRequest";
import { logError } from "@/lib/errorLog";

export const maxDuration = 30;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const verified = verifyRequest(token);

  if (!verified) {
    return NextResponse.redirect(new URL("/data-delete/expired", req.nextUrl.origin));
  }

  try {
    const supabase = getSupabase();
    const results = await Promise.all([
      supabase.from("waitlist").delete().eq("email", verified.email),
      supabase.from("feedback").delete().eq("email", verified.email),
    ]);
    for (const r of results) {
      if (r.error) void logError("api/data-delete/confirm[delete]", r.error);
    }
    return NextResponse.redirect(new URL("/data-delete/done", req.nextUrl.origin));
  } catch (err) {
    void logError("api/data-delete/confirm", err);
    return NextResponse.redirect(new URL("/data-delete/expired", req.nextUrl.origin));
  }
}
