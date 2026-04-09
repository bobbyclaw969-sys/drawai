import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { logError } from "@/lib/errorLog";

export const maxDuration = 15;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = await rateLimit(`feedback:${ip}`, 5, 60 * 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait before sending more feedback." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
      );
    }

    const body = await req.json() as {
      category?: string;
      message?: string;
      email?: string;
    };

    const message = (body.message ?? "").trim();
    if (!message || message.length < 5) {
      return NextResponse.json({ error: "Please provide a message (at least 5 characters)." }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "Message too long (max 5000 characters)." }, { status: 400 });
    }

    const category = ["bug", "feature", "general", "data"].includes(body.category ?? "")
      ? body.category
      : "general";

    const email = (body.email ?? "").trim().toLowerCase();

    const supabase = getSupabase();
    const { error: insertError } = await supabase.from("feedback").insert({
      category,
      message,
      email: email || null,
      ip_hash: ip.slice(0, 8),
    });

    if (insertError) throw insertError;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback error:", err);
    void logError("api/feedback", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
