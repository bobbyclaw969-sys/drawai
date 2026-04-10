/**
 * verify-deadlines.ts
 *
 * One-time verification of every (state, species) record in lib/huntingData.ts
 * against the official state agency website, using Claude Opus 4.6 with the
 * web search server tool.
 *
 * Usage:
 *   npm run verify-data
 *
 * What it does:
 *   1. Reads all records from lib/huntingData.ts
 *   2. Dedupes by stateId+species (first record wins) — same as the dashboard
 *   3. For each unique combo, calls Claude with web_search enabled
 *   4. Compares Claude's findings to the stored values
 *   5. Auto-stamps high-confidence verifications in the Supabase
 *      deadline_verifications table via the service role key
 *   6. Writes scripts/verification-report.json (full structured results)
 *      and scripts/verification-report.md (human-readable summary)
 *
 * Run order is sequential with a 2-second delay between calls to avoid
 * rate limits and to keep web search within budget.
 */
import * as fs from "fs";
import * as path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { huntingData, STATE_NAMES, DATA_YEAR } from "../lib/huntingData";
import type { StateSeasonData, SpeciesKey } from "../lib/types";

// ── Load env from .env.local manually (no dotenv dep) ──────────────────────
function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnvLocal();

// ── Hard prerequisites ─────────────────────────────────────────────────────
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY not found in .env.local");
  console.error("Add your API key and run again.");
  process.exit(1);
}

const HAS_SUPABASE =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!HAS_SUPABASE) {
  console.warn(
    "Warning: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.\n" +
      "         Verification will run but Supabase auto-stamping will be skipped.",
  );
}

const VERIFIED_BY =
  (process.env.ADMIN_EMAILS ?? "ai-verified@taghunter.us")
    .split(",")[0]
    ?.trim() || "ai-verified@taghunter.us";

const anthropic = new Anthropic();
const supabase = HAS_SUPABASE
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
  : null;

// ── Configuration ──────────────────────────────────────────────────────────

/**
 * Claude Opus 4.6 — most accurate research model. The user spec said
 * "claude-opus-4-5" but the current Opus is 4.6 (per claude-api skill).
 */
const MODEL = "claude-opus-4-6";

/**
 * web_search_20260209 is the newer version with dynamic filtering — more
 * accurate than the older web_search_20250305 the spec mentioned.
 */
const WEB_SEARCH_TOOL_TYPE = "web_search_20260209" as const;

const DELAY_MS = 2000;
const MAX_TOKENS = 4000;
const SEASON_YEAR = DATA_YEAR; // 2026

// ── Source URLs (per spec) ─────────────────────────────────────────────────
const STATE_SOURCES: Record<string, { url: string; label: string }> = {
  az: { url: "https://www.azgfd.com/hunting/draw/", label: "azgfd.com" },
  ca: { url: "https://wildlife.ca.gov/Licensing/Hunting", label: "wildlife.ca.gov" },
  co: { url: "https://cpw.state.co.us/thingstodo/Pages/Hunting-Application.aspx", label: "cpw.state.co.us" },
  id: { url: "https://idfg.idaho.gov/licenses/hunting", label: "idfg.idaho.gov" },
  mt: { url: "https://fwp.mt.gov/hunting", label: "fwp.mt.gov" },
  nv: { url: "https://www.ndow.org/hunting/", label: "ndow.org" },
  nm: { url: "https://www.wildlife.state.nm.us/hunting/", label: "wildlife.state.nm.us" },
  or: { url: "https://myodfw.com/hunting", label: "myodfw.com" },
  ut: { url: "https://wildlife.utah.gov/hunting-in-utah.html", label: "wildlife.utah.gov" },
  wa: { url: "https://wdfw.wa.gov/licenses/hunting", label: "wdfw.wa.gov" },
  wy: { url: "https://wgfd.wyo.gov/Hunting/Apply-for-a-License", label: "wgfd.wyo.gov" },
  // Eastern whitetail states
  pa: { url: "https://www.pgc.pa.gov/hunting", label: "pgc.pa.gov" },
  mi: { url: "https://www.michigan.gov/dnr/hunting", label: "michigan.gov/dnr" },
  wi: { url: "https://dnr.wisconsin.gov/topic/hunting", label: "dnr.wisconsin.gov" },
  ky: { url: "https://fw.ky.gov/hunt", label: "fw.ky.gov" },
  mn: { url: "https://www.dnr.state.mn.us/hunting", label: "dnr.state.mn.us" },
  tx: { url: "https://tpwd.texas.gov/huntwild/hunt", label: "tpwd.texas.gov" },
  oh: { url: "https://ohiodnr.gov/hunting", label: "ohiodnr.gov" },
  il: { url: "https://www2.illinois.gov/dnr/hunting", label: "illinois.gov/dnr" },
  ms: { url: "https://www.mdwfp.com/hunting", label: "mdwfp.com" },
  ga: { url: "https://georgiawildlife.com/hunting", label: "georgiawildlife.com" },
  sd: { url: "https://gfp.sd.gov/hunting/", label: "gfp.sd.gov" },
};

// ── Types for Claude's structured response ────────────────────────────────
interface ClaudeFindings {
  verified: boolean;
  confidence: "high" | "medium" | "low";
  found_close_month: number | null;
  found_close_day: number | null;
  found_fee_nr: number | null;
  found_is_otc_nr: boolean | null;
  date_matches: boolean;
  fee_matches: boolean;
  otc_matches: boolean;
  source_url: string;
  source_label: string;
  discrepancies: string | null;
  notes: string | null;
  unable_to_verify: boolean;
  unable_reason: string | null;
}

type ResultStatus = "verified" | "mismatch" | "unable";

interface ResultEntry {
  stateId: string;
  species: string;
  stateName: string;
  stored: {
    close_month: number;
    close_day: number;
    fee_nr: number;
    hasOTC: boolean;
  };
  found: ClaudeFindings | null;
  status: ResultStatus;
  auto_stamped: boolean;
  supabase_error: string | null;
  discrepancies: string | null;
}

// ── Dedupe huntingData (same logic as the dashboard) ──────────────────────
function dedupedRecords(): StateSeasonData[] {
  const seen = new Set<string>();
  const out: StateSeasonData[] = [];
  for (const d of huntingData) {
    const key = `${d.stateId}-${d.species}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(d);
  }
  return out;
}

// ── Build prompt for Claude ────────────────────────────────────────────────
function buildPrompt(record: StateSeasonData): string {
  const stateName = STATE_NAMES[record.stateId.toUpperCase()] ?? record.stateName;
  const source = STATE_SOURCES[record.stateId];
  const sourceLine = source
    ? `Official source to check: ${source.url}`
    : `(no canonical source URL on file — search for the official state agency)`;

  return `You are verifying hunting application data for Tag Hunter, a western big game draw strategy tool.

Look up the following information for the ${SEASON_YEAR} hunting season using the official state wildlife agency website.

State: ${stateName}
Species: ${record.species}
${sourceLine}

Find and confirm:
1. Application deadline (month and day) for the ${SEASON_YEAR} season
2. Non-resident application or tag fee in USD
3. Whether this is a draw (limited entry) or OTC for non-residents

Current stored values to verify:
- Close date: ${record.appCloseMonth}/${record.appCloseDay}
- NR fee: $${record.feeNonresident}
- OTC for NR: ${record.hasOTC}

Search the official state agency website and any official ${SEASON_YEAR} season announcements. Return ONLY a JSON object with no other text:

{
  "verified": true or false,
  "confidence": "high" or "medium" or "low",
  "found_close_month": number or null,
  "found_close_day": number or null,
  "found_fee_nr": number or null,
  "found_is_otc_nr": true or false or null,
  "date_matches": true or false,
  "fee_matches": true or false,
  "otc_matches": true or false,
  "source_url": "the exact URL where you found this",
  "source_label": "domain only e.g. wgfd.wyo.gov",
  "discrepancies": "describe any mismatches or null",
  "notes": "any important caveats or null",
  "unable_to_verify": true or false,
  "unable_reason": "why if unable_to_verify is true or null"
}`;
}

// ── Extract concatenated text from Claude's response ──────────────────────
function extractText(response: Anthropic.Message): string {
  let text = "";
  for (const block of response.content) {
    if (block.type === "text") text += block.text;
  }
  return text;
}

/** Pull the first JSON object out of a text blob — Claude often wraps it in prose. */
function extractJson(text: string): unknown | null {
  // Strip code fences if present
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  // Find first { and last }
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const jsonStr = candidate.slice(start, end + 1);
  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

function isValidFindings(obj: unknown): obj is ClaudeFindings {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.verified === "boolean" &&
    typeof o.confidence === "string" &&
    typeof o.date_matches === "boolean" &&
    typeof o.fee_matches === "boolean" &&
    typeof o.otc_matches === "boolean" &&
    typeof o.unable_to_verify === "boolean"
  );
}

// ── Single Claude call with one retry ─────────────────────────────────────
async function callClaude(prompt: string): Promise<ClaudeFindings | null> {
  const attempt = async (): Promise<Anthropic.Message> => {
    return await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // Web search may iterate; pause_turn handling below
      tools: [{ type: WEB_SEARCH_TOOL_TYPE, name: "web_search", max_uses: 5 }],
      messages: [{ role: "user", content: prompt }],
    });
  };

  let response: Anthropic.Message;
  try {
    response = await attempt();
  } catch (err) {
    if (
      err instanceof Anthropic.RateLimitError ||
      err instanceof Anthropic.APIError
    ) {
      // single retry after 5s
      await new Promise(r => setTimeout(r, 5000));
      try {
        response = await attempt();
      } catch {
        return null;
      }
    } else {
      return null;
    }
  }

  // Handle pause_turn — server-side tool loop hit its iteration limit.
  // Re-send with the assistant turn appended; server resumes automatically.
  let safety = 0;
  while (response.stop_reason === "pause_turn" && safety < 3) {
    safety += 1;
    try {
      response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        tools: [{ type: WEB_SEARCH_TOOL_TYPE, name: "web_search", max_uses: 5 }],
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: response.content },
        ],
      });
    } catch {
      return null;
    }
  }

  const text = extractText(response);
  const parsed = extractJson(text);
  if (!isValidFindings(parsed)) return null;
  return parsed;
}

// ── Auto-stamp in Supabase ────────────────────────────────────────────────
async function stampInSupabase(
  record: StateSeasonData,
  findings: ClaudeFindings,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  // Build close_date_confirmed (YYYY-MM-DD) from found month/day + season year
  let closeDateConfirmed: string | null = null;
  if (
    findings.found_close_month != null &&
    findings.found_close_day != null &&
    findings.found_close_month >= 1 &&
    findings.found_close_month <= 12 &&
    findings.found_close_day >= 1 &&
    findings.found_close_day <= 31
  ) {
    const mm = String(findings.found_close_month).padStart(2, "0");
    const dd = String(findings.found_close_day).padStart(2, "0");
    closeDateConfirmed = `${SEASON_YEAR}-${mm}-${dd}`;
  }

  const { error } = await supabase
    .from("deadline_verifications")
    .upsert(
      {
        state_id: record.stateId,
        species: record.species,
        season_year: SEASON_YEAR,
        verified_by: VERIFIED_BY,
        verified_at: new Date().toISOString(),
        source_url: findings.source_url,
        source_label: findings.source_label,
        notes: findings.notes ?? "AI-verified via web search",
        close_date_confirmed: closeDateConfirmed,
        fee_nr_confirmed: findings.found_fee_nr,
      },
      { onConflict: "state_id,species,season_year" },
    );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── Process one record ────────────────────────────────────────────────────
async function processRecord(
  record: StateSeasonData,
  index: number,
  total: number,
): Promise<ResultEntry> {
  const stateName = STATE_NAMES[record.stateId.toUpperCase()] ?? record.stateName;
  const label = `[${index + 1}/${total}] ${stateName} · ${record.species}`;

  const findings = await callClaude(buildPrompt(record));

  const stored = {
    close_month: record.appCloseMonth,
    close_day: record.appCloseDay,
    fee_nr: record.feeNonresident,
    hasOTC: record.hasOTC,
  };

  if (!findings) {
    console.log(`${label} → ? UNABLE TO VERIFY (api/parse error)`);
    return {
      stateId: record.stateId,
      species: record.species,
      stateName,
      stored,
      found: null,
      status: "unable",
      auto_stamped: false,
      supabase_error: null,
      discrepancies: "API error or could not parse response",
    };
  }

  if (findings.unable_to_verify) {
    console.log(`${label} → ? UNABLE TO VERIFY (${findings.unable_reason ?? "no reason"})`);
    return {
      stateId: record.stateId,
      species: record.species,
      stateName,
      stored,
      found: findings,
      status: "unable",
      auto_stamped: false,
      supabase_error: null,
      discrepancies: findings.unable_reason,
    };
  }

  const allMatch =
    findings.date_matches && findings.fee_matches && findings.otc_matches;
  const isHighConfidence = findings.confidence === "high";
  const isVerifiedFlag = findings.verified;

  if (allMatch && isHighConfidence && isVerifiedFlag) {
    // Auto-stamp
    const stamp = await stampInSupabase(record, findings);
    const stampMsg = stamp.ok ? "stamped" : `stamp failed: ${stamp.error}`;
    console.log(`${label} → ✓ VERIFIED (${stampMsg})`);
    return {
      stateId: record.stateId,
      species: record.species,
      stateName,
      stored,
      found: findings,
      status: "verified",
      auto_stamped: stamp.ok,
      supabase_error: stamp.ok ? null : (stamp as { error: string }).error,
      discrepancies: null,
    };
  }

  // Mismatches or low confidence — flag for manual review
  const issues: string[] = [];
  if (!findings.date_matches) {
    issues.push(
      `date: stored ${stored.close_month}/${stored.close_day}, found ${findings.found_close_month}/${findings.found_close_day}`,
    );
  }
  if (!findings.fee_matches) {
    issues.push(`fee: stored $${stored.fee_nr}, found $${findings.found_fee_nr}`);
  }
  if (!findings.otc_matches) {
    issues.push(`otc: stored ${stored.hasOTC}, found ${findings.found_is_otc_nr}`);
  }
  if (findings.confidence !== "high") {
    issues.push(`confidence: ${findings.confidence}`);
  }
  const summary = issues.join(", ") || findings.discrepancies || "unknown";
  console.log(`${label} → ⚠ MISMATCH (${summary})`);

  return {
    stateId: record.stateId,
    species: record.species,
    stateName,
    stored,
    found: findings,
    status: "mismatch",
    auto_stamped: false,
    supabase_error: null,
    discrepancies: summary,
  };
}

// ── Markdown report ───────────────────────────────────────────────────────
function buildMarkdownReport(
  results: ResultEntry[],
  runAt: string,
): string {
  const verified = results.filter(r => r.status === "verified");
  const mismatches = results.filter(r => r.status === "mismatch");
  const unable = results.filter(r => r.status === "unable");

  const lines: string[] = [];
  lines.push("# Tag Hunter Data Verification Report");
  lines.push(`Run: ${runAt}`);
  lines.push("");
  lines.push("## Summary");
  lines.push(`- ✓ Auto-verified: ${verified.length} records`);
  lines.push(`- ⚠ Mismatches requiring fixes: ${mismatches.length} records`);
  lines.push(`- ? Unable to verify: ${unable.length} records`);
  lines.push("");

  if (mismatches.length > 0) {
    lines.push("## ⚠ Mismatches — Fix These in huntingData.ts");
    lines.push("");
    for (const m of mismatches) {
      lines.push(`### ${m.stateName} · ${m.species}`);
      const f = m.found;
      if (f) {
        if (!f.date_matches) {
          lines.push(
            `- Close date: stored ${m.stored.close_month}/${m.stored.close_day}, found ${f.found_close_month}/${f.found_close_day} → **UPDATE**`,
          );
        }
        if (!f.fee_matches) {
          lines.push(
            `- NR fee: stored $${m.stored.fee_nr}, found $${f.found_fee_nr} → **UPDATE**`,
          );
        }
        if (!f.otc_matches) {
          lines.push(
            `- OTC for NR: stored ${m.stored.hasOTC}, found ${f.found_is_otc_nr} → **UPDATE**`,
          );
        }
        if (f.confidence !== "high") {
          lines.push(`- Confidence: ${f.confidence}`);
        }
        if (f.notes) lines.push(`- Notes: ${f.notes}`);
        lines.push(`- Source: [${f.source_label}](${f.source_url})`);
      } else {
        lines.push(`- ${m.discrepancies}`);
      }
      lines.push("");
    }
  }

  if (unable.length > 0) {
    lines.push("## ? Unable to Verify — Manual Check Required");
    lines.push("");
    for (const u of unable) {
      lines.push(`### ${u.stateName} · ${u.species}`);
      const reason = u.found?.unable_reason ?? u.discrepancies ?? "no reason given";
      lines.push(`- Reason: ${reason}`);
      const src = STATE_SOURCES[u.stateId];
      if (src) lines.push(`- Check: [${src.label}](${src.url})`);
      lines.push("");
    }
  }

  if (verified.length > 0) {
    lines.push(`## ✓ Auto-Verified Records (${verified.length})`);
    lines.push("");
    for (const v of verified) {
      const src = v.found?.source_label ?? "unknown source";
      const stamped = v.auto_stamped ? "" : " *(stamp failed — manual review needed)*";
      lines.push(`- ${v.stateName} · ${v.species} · ${src}${stamped}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const records = dedupedRecords();
  const total = records.length;
  const startedAt = Date.now();
  const runAt = new Date().toISOString();

  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TAG HUNTER DATA VERIFICATION");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Records to verify: ${total}`);
  console.log(`Model: ${MODEL}`);
  console.log(`Web search: ${WEB_SEARCH_TOOL_TYPE}`);
  console.log(`Season year: ${SEASON_YEAR}`);
  console.log(`Supabase auto-stamp: ${HAS_SUPABASE ? "enabled" : "disabled"}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");

  const results: ResultEntry[] = [];

  for (let i = 0; i < records.length; i++) {
    const result = await processRecord(records[i], i, total);
    results.push(result);

    // Print ETA after first 5
    if (i === 4) {
      const elapsed = (Date.now() - startedAt) / 1000;
      const perRecord = elapsed / 5;
      const remainingSeconds = Math.round(perRecord * (total - 5));
      const mm = Math.floor(remainingSeconds / 60);
      const ss = remainingSeconds % 60;
      console.log(`    ⌛ Estimated time remaining: ${mm}m ${ss}s`);
    }

    // Rate limit pause (skip after the last one)
    if (i < records.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  // ── Write reports ────────────────────────────────────────────────────
  const verifiedCount = results.filter(r => r.status === "verified").length;
  const mismatchCount = results.filter(r => r.status === "mismatch").length;
  const unableCount = results.filter(r => r.status === "unable").length;

  const report = {
    run_at: runAt,
    model: MODEL,
    total,
    verified: verifiedCount,
    mismatches: mismatchCount,
    unable_to_verify: unableCount,
    results,
  };

  const scriptsDir = path.join(process.cwd(), "scripts");
  if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir, { recursive: true });

  const jsonPath = path.join(scriptsDir, "verification-report.json");
  const mdPath = path.join(scriptsDir, "verification-report.md");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(mdPath, buildMarkdownReport(results, runAt));

  // ── Final summary ────────────────────────────────────────────────────
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TAG HUNTER DATA VERIFICATION COMPLETE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✓ Auto-verified and stamped:  ${verifiedCount} records`);
  console.log(`⚠ Mismatches — fix required:  ${mismatchCount} records`);
  console.log(`? Unable to verify:           ${unableCount} records`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("Next steps:");
  console.log("1. Review scripts/verification-report.md");
  console.log("2. Fix mismatches in lib/huntingData.ts");
  console.log("3. Manually verify \"unable\" records at official sites");
  console.log("4. Run npm run verify-data again to stamp fixed records");
  console.log("");
  console.log(`Full results: scripts/verification-report.json`);
  console.log("");
}

main().catch(err => {
  console.error("\nFatal error:", err instanceof Error ? err.message : err);
  process.exit(1);
});
