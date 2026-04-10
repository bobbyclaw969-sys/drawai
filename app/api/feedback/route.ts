import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { logError } from "@/lib/errorLog";

export const maxDuration = 15;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/**
 * Notify the team via Resend on every feedback submission.
 * Fails silently if RESEND_API_KEY is not set — submission still succeeds.
 */
async function notifyTeam(input: {
  category: string;
  message: string;
  email: string;
  referer: string;
}): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    // TODO: configure RESEND_API_KEY in Vercel env to enable email notifications
    return;
  }
  try {
    const resend = new Resend(resendKey);
    const fromName = input.email || "Anonymous";
    const body = [
      `From: ${fromName}`,
      `Category: ${input.category}`,
      `Page: ${input.referer || "(not captured)"}`,
      `Time: ${new Date().toISOString()}`,
      ``,
      `Message:`,
      input.message,
    ].join("\n");
    await resend.emails.send({
      from: "Tag Hunter Feedback <team@f21.ai>",
      to: "team@f21.ai",
      replyTo: input.email || undefined,
      subject: `New Tag Hunter Feedback — ${input.category}`,
      text: body,
    });
  } catch (err) {
    // Never let notification failure block the submission
    console.warn("Feedback notification failed:", err);
    void logError("api/feedback[notify]", err);
  }
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

    // Fire-and-forget email notification — never blocks the response
    void notifyTeam({
      category: category ?? "general",
      message,
      email,
      referer: req.headers.get("referer") ?? "",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback error:", err);
    void logError("api/feedback", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
