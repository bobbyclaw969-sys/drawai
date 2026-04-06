import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 15;

export async function GET(req: NextRequest) {
  const results: Record<string, string> = {};

  try {
    const { rateLimit } = await import("@/lib/rateLimit");
    const r = await rateLimit("debug:test", 100, 60000);
    results.rateLimit = `ok: allowed=${r.allowed}`;
  } catch (e) {
    results.rateLimit = `FAIL: ${e instanceof Error ? e.message : String(e)}`;
  }

  try {
    const { logEvent } = await import("@/lib/analytics");
    await logEvent("chat", "127.0.0.1", { species: ["elk"] });
    results.analytics = "ok";
  } catch (e) {
    results.analytics = `FAIL: ${e instanceof Error ? e.message : String(e)}`;
  }

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    results.anthropic = `ok: ${!!client}`;
  } catch (e) {
    results.anthropic = `FAIL: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(results);
}
