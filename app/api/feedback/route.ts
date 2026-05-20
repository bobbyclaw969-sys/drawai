import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { logError } from "@/lib/errorLog";

export const maxDuration = 15;

const FEEDBACK_RECIPIENT_EMAIL = process.env.FEEDBACK_RECIPIENT_EMAIL || "bsurfin87@gmail.com";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/**
 * Notify Bobby via Resend on every feedback submission.
 * Fails silently if RESEND_API_KEY is not set.
 */
async function notifyBobby(input: {
  sentiment: string;
  message: string;
  email: string;
  source: string;
  anonId: string;
  referer: string;
}): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("RESEND_API_KEY not set — feedback email notifications disabled.");
    return;
  }
  try {
    const resend = new Resend(resendKey);
    const fromUser = input.email || `anon:${input.anonId.slice(0, 8)}`;
    const body = [
      `Sentiment: ${input.sentiment.toUpperCase()}`,
      `From:      ${fromUser}`,
      `Source:    ${input.source}`,
      `Page:      ${input.referer || "(not captured)"}`,
      `Time:      ${new Date().toISOString()}`,
      ``,
      `Message:`,
      input.message || "(no message — just a thumbs click)",
    ].join("\n");
    await resend.emails.send({
      from: "TagHunter Feedback <team@f21.ai>",
      to: FEEDBACK_RECIPIENT_EMAIL,
      replyTo: input.email || undefined,
      subject: `TagHunter feedback: ${input.sentiment}`,
      text: body,
    });
  } catch (err) {
    console.warn("Feedback notification failed:", err);
    void logError("api/feedback[notify]", err);
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = await rateLimit(`feedback:${ip}`, 10, 60 * 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Slow down and try again in a bit." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
      );
    }

    const body = (await req.json()) as {
      anon_id?: string;
      sentiment?: string;
      message?: string;
      email?: string;
      source?: string;
      // legacy fallback — keep old form working
      category?: string;
    };

    const message = (body.message ?? "").trim();
    const sentiment = (() => {
      const s = (body.sentiment ?? "").toLowerCase();
      if (s === "positive" || s === "negative" || s === "neutral") return s;
      // Legacy form: treat "bug"/"data" as negative, everything else neutral
      if (body.category === "bug" || body.category === "data") return "negative";
      return "neutral";
    })();

    // Require message UNLESS this is a positive click-through log
    const isPositiveClickThrough = sentiment === "positive" && message.startsWith("[clicked through to");
    if (!isPositiveClickThrough) {
      if (message.length < 5) {
        return NextResponse.json(
          { error: "Tell us a little more — at least a sentence." },
          { status: 400 },
        );
      }
      if (message.length > 5000) {
        return NextResponse.json({ error: "Message too long (max 5000 chars)." }, { status: 400 });
      }
    }

    const email = (body.email ?? "").trim().toLowerCase();
    if (email && !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
    }

    const anonId = (body.anon_id ?? "").trim() || `ip:${ip.slice(0, 12)}`;
    const source = (body.source ?? "feedback_page").slice(0, 80);

    const supabase = getSupabase();

    // ── Idempotency: same anon_id + same sentiment within 60s = dedupe ─
    const sixtySecondsAgo = new Date(Date.now() - 60_000).toISOString();
    const { data: recent } = await supabase
      .from("feedback")
      .select("id, message")
      .eq("anon_id", anonId)
      .eq("sentiment", sentiment)
      .gte("created_at", sixtySecondsAgo)
      .limit(1);
    if (recent && recent.length > 0) {
      return NextResponse.json({ ok: true, deduped: true });
    }

    const { error: insertError } = await supabase.from("feedback").insert({
      anon_id: anonId,
      sentiment,
      message: message || null,
      email: email || null,
      source,
      // keep legacy column populated for the admin dashboard, if it reads `category`
      category: sentiment === "negative" ? "bug" : "general",
      ip_hash: ip.slice(0, 8),
    });

    if (insertError) throw insertError;

    // Fire-and-forget — never blocks the response
    void notifyBobby({
      sentiment,
      message,
      email,
      source,
      anonId,
      referer: req.headers.get("referer") ?? "",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback error:", err);
    void logError("api/feedback", err);
    return NextResponse.json({ error: "Something broke on our end. Try again." }, { status: 500 });
  }
}
