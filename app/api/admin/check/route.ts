import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const maxDuration = 5;

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

function getAuthClient(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll() {},
      },
    },
  );
}

export async function GET(req: NextRequest) {
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) {
    return NextResponse.json({ isAdmin: false });
  }

  const supabase = getAuthClient(req);
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  const isAdmin = !!email && adminEmails.includes(email);

  return NextResponse.json({ isAdmin });
}
