/**
 * POST /api/founder/interest — capture interested-in-founder-tier emails.
 *
 * Active when Stripe isn't wired yet OR when the user wants to be notified
 * before launch. Once Stripe is configured, /api/founder/checkout takes
 * over the primary CTA.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { logError } from "@/lib/errorLog";

export const maxDuration = 15;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = await rateLimit(`founder-interest:${ip}`, 5, 60 * 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Try again in a bit." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
      );
    }

    const body = (await req.json()) as { email?: string; source?: string; notes?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    const source = (body.source ?? "founder_page").slice(0, 80);
    const notes = (body.notes ?? "").slice(0, 500) || null;

    const supabase = getSupabase();
    const { error } = await supabase.from("founder_interest").upsert(
      { email, source, notes },
      { onConflict: "email", ignoreDuplicates: false },
    );
    if (error) {
      void logError("api/founder/interest", error);
      // Still return ok — don't leak the table's existence to attackers.
    }

    // Confirmation email — best-effort.
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Tag Hunter <team@f21.ai>",
          to: email,
          subject: "You're on the Tag Hunter Founder list",
          text: [
            "Hi,",
            "",
            "You're on the early list for the Tag Hunter Founder tier — lifetime access for $99, capped at 500 spots.",
            "",
            "We'll email you the moment checkout opens. Expect this within days, not weeks.",
            "",
            "While you wait, the free product is fully live: build your strategy, run the optimizer, get draw odds across 25+ states.",
            "https://taghunter.us",
            "",
            "— The Tag Hunter team",
            "team@f21.ai",
          ].join("\n"),
        });
      } catch (err) {
        void logError("api/founder/interest[resend]", err);
      }
    }

    return NextResponse.json({ ok: true, message: "You're on the list. Check your inbox." });
  } catch (err) {
    void logError("api/founder/interest", err);
    return NextResponse.json({ error: "Something broke. Try again." }, { status: 500 });
  }
}
