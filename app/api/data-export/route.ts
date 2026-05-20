/**
 * GDPR Article 15 / CCPA right-to-know — POST { email } emails a JSON
 * dump of all server-side data tied to that address.
 *
 * Always returns 200 with a generic message regardless of whether the
 * email is on file — never reveal account existence to an unauthenticated
 * caller. Rate limited at 3/hr/IP because the body is sent via Resend
 * and we don't want a hostile actor flooding inboxes.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { logError } from "@/lib/errorLog";

export const maxDuration = 30;

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
    const rl = await rateLimit(`data-export:${ip}`, 3, 60 * 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again in a bit." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
      );
    }

    const body = (await req.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    const supabase = getSupabase();
    const [waitlist, feedback] = await Promise.all([
      supabase.from("waitlist").select("*").eq("email", email),
      supabase.from("feedback").select("*").eq("email", email),
    ]);

    const hasData = (waitlist.data?.length ?? 0) > 0 || (feedback.data?.length ?? 0) > 0;

    if (hasData && process.env.RESEND_API_KEY) {
      const payload = {
        generated_at: new Date().toISOString(),
        email,
        waitlist: waitlist.data ?? [],
        feedback: feedback.data ?? [],
        note:
          "Locally-stored data (saved plans, hunter profile, application tracker, chat history) lives only in your browser. Open Tag Hunter and use the Export buttons inside Profile / Tracker to retrieve those.",
      };

      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Tag Hunter <team@f21.ai>",
          to: email,
          subject: "Your Tag Hunter data export",
          text: [
            "Hi,",
            "",
            "You requested an export of every piece of data Tag Hunter holds about you on the server.",
            "Here it is — the full JSON record:",
            "",
            JSON.stringify(payload, null, 2),
            "",
            "Browser-side data (saved plans, hunter profile, application tracker, chat history) is stored only on your device. Open Tag Hunter and use the Export buttons inside Profile and Tracker to retrieve those.",
            "",
            "Want to delete your data instead? https://taghunter.us/data-delete",
            "",
            "— The Tag Hunter team",
            "team@f21.ai",
          ].join("\n"),
        });
      } catch (err) {
        void logError("api/data-export[resend]", err);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "If that email is on file, a data export has been sent. Check your inbox.",
    });
  } catch (err) {
    void logError("api/data-export", err);
    return NextResponse.json({ error: "Something broke on our end. Try again." }, { status: 500 });
  }
}
