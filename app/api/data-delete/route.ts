/**
 * GDPR Article 17 / CCPA right-to-delete — POST { email } emails a
 * one-time signed confirmation link. The actual deletion happens at
 * /api/data-delete/confirm only after the user clicks through.
 *
 * Two-step confirm prevents drive-by deletion of someone else's email.
 * Always responds 200 with a neutral message so the endpoint can't be
 * used to probe for account existence.
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { logError } from "@/lib/errorLog";
import { signRequest } from "@/lib/dataRequest";

export const maxDuration = 15;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = await rateLimit(`data-delete:${ip}`, 3, 60 * 60_000);
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

    if (process.env.RESEND_API_KEY) {
      const token = signRequest({ email, action: "delete" });
      const origin =
        req.headers.get("origin") ||
        (req.nextUrl.origin.startsWith("http") ? req.nextUrl.origin : "https://taghunter.us");
      const confirmUrl = `${origin}/api/data-delete/confirm?token=${encodeURIComponent(token)}`;

      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Tag Hunter <team@f21.ai>",
          to: email,
          subject: "Confirm Tag Hunter data deletion",
          text: [
            "Hi,",
            "",
            "You (or someone with this email address) requested permanent deletion of all Tag Hunter data tied to this address.",
            "",
            "If that's correct, click the link below to confirm. The link expires in 24 hours.",
            "",
            confirmUrl,
            "",
            "What will be deleted: waitlist entry, feedback rows, review-asked timestamps. Locally-stored data on your device must be cleared by clearing site data in your browser settings.",
            "",
            "If you did NOT request this, ignore this email — nothing will happen.",
            "",
            "— The Tag Hunter team",
            "team@f21.ai",
          ].join("\n"),
        });
      } catch (err) {
        void logError("api/data-delete[resend]", err);
      }
    }

    return NextResponse.json({
      ok: true,
      message:
        "If that email is on file, a confirmation link has been sent. Click it to permanently delete your data.",
    });
  } catch (err) {
    void logError("api/data-delete", err);
    return NextResponse.json({ error: "Something broke on our end. Try again." }, { status: 500 });
  }
}
