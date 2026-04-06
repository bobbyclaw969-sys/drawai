import { NextRequest, NextResponse } from "next/server";
import { getStats } from "@/lib/analytics";

export const maxDuration = 15;

// Simple token check — not a public endpoint
const STATS_TOKEN = process.env.STATS_TOKEN ?? "taghunter-stats-2026";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== STATS_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getStats();
  if (!stats) {
    return NextResponse.json({ error: "Analytics unavailable" }, { status: 503 });
  }

  return NextResponse.json({
    ...stats,
    generatedAt: new Date().toISOString(),
  });
}
