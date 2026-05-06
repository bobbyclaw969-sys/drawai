import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/";
  // Only allow same-origin paths. Reject "//x" (protocol-relative),
  // "/\x" (backslash-bypass), and "@" (userinfo bypass: origin@evil.com).
  const safeNext =
    rawNext.startsWith("/") &&
    !rawNext.startsWith("//") &&
    !rawNext.startsWith("/\\") &&
    !rawNext.includes("@")
      ? rawNext
      : "/";

  if (code) {
    const response = NextResponse.redirect(`${origin}${safeNext}`);
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return response;
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
}
