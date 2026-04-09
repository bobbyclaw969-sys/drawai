import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
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
    const body = await req.json() as { email?: string; source?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }
    if (email.length > 254) {
      return NextResponse.json({ error: "Email too long." }, { status: 400 });
    }

    const supabase = getSupabase();

    // Check if already registered
    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({ ok: true, alreadyRegistered: true });
    }

    // Get current count for position + enforce 5K cap
    const { count } = await supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true });

    const position = (count ?? 0) + 1;
    const USER_CAP = 5000;

    if (position > USER_CAP) {
      return NextResponse.json({
        ok: false,
        error: "Tag Hunter has reached its initial 5,000-user cap. Join the overflow waitlist and we'll notify you when spots open.",
        capped: true,
        position,
      }, { status: 200 });
    }

    // Insert
    const { error: insertError } = await supabase
      .from("waitlist")
      .insert({ email, source: body.source ?? "homepage" });

    if (insertError) {
      if (insertError.code === "23505") {
        // Duplicate — race condition, treat as already registered
        return NextResponse.json({ ok: true, alreadyRegistered: true });
      }
      throw insertError;
    }

    // Send confirmation email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Tag Hunter <team@f21.ai>",
        to: email,
        subject: "You're on the Tag Hunter waitlist 🎯",
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #070f06; color: #ede8dc;">
            <h1 style="font-size: 24px; font-weight: 900; color: #e8960f; margin-bottom: 8px;">You're in. 🎯</h1>
            <p style="font-size: 16px; color: #8fb887; margin-bottom: 24px;">
              You're <strong style="color: #e8960f;">#${position}</strong> on the Tag Hunter waitlist.
            </p>
            <p style="font-size: 14px; color: #8fb887; line-height: 1.7; margin-bottom: 20px;">
              Tag Hunter is a free AI-powered hunting strategy tool — it builds your personalized multi-year western tag plan, walks you through every state application, and tracks your points and deadlines.
            </p>
            <p style="font-size: 14px; color: #8fb887; line-height: 1.7; margin-bottom: 28px;">
              We'll email you the moment your spot opens up. In the meantime, the app is already live — start planning now.
            </p>
            <a href="https://taghunter.us" style="display: inline-block; background: #e8960f; color: #070f06; font-weight: 700; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px;">
              Start Planning Free →
            </a>
            <p style="font-size: 12px; color: #4a6e45; margin-top: 32px;">
              Built by <a href="https://f21.ai" style="color: #e8960f;">Factor21</a> · Not affiliated with any state wildlife agency. Always verify deadlines at official state agency sites.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true, position });
  } catch (err) {
    console.error("Waitlist error:", err);
    void logError("api/waitlist", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
