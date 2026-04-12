/**
 * verify-deadlines.ts (v2 — fetch-based)
 *
 * Verifies every (state, species) record in lib/huntingData.ts against
 * official state agency websites by fetching HTML pages, stripping to
 * text, and asking Claude to extract deadline/fee data from the text.
 *
 * NO web_search dependency — eliminates rate-limit failures and cuts
 * cost from ~$40 to ~$5 for a full 80-record run.
 *
 * Usage:
 *   npm run verify-data                  # full run
 *   VERIFY_LIMIT=5 npm run verify-data   # smoke test on first 5
 *
 * Output:
 *   scripts/verification-report.json     (full structured results)
 *   scripts/verification-report.md       (human-readable summary)
 *   Supabase deadline_verifications      (auto-stamped for high-confidence)
 */
import * as fs from "fs";
import * as path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { huntingData, STATE_NAMES, DATA_YEAR } from "../lib/huntingData";
import type { StateSeasonData } from "../lib/types";

// ── Load env from .env.local manually ────────────────────────────────────
function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
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

// ── Hard prerequisites ────────────────────────────────────────────────────
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY not found in .env.local");
  process.exit(1);
}

const HAS_SUPABASE =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!HAS_SUPABASE) {
  console.warn(
    "Warning: Supabase keys missing — auto-stamping disabled.",
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

// ── Configuration ─────────────────────────────────────────────────────────
const MODEL = "claude-opus-4-6";
const DELAY_MS = 3000;
const MAX_TOKENS = 2000;
const SEASON_YEAR = DATA_YEAR;
const MAX_CHARS_PER_PAGE = 30_000;

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// ── Per-state URL config ──────────────────────────────────────────────────
// Curated states have specific fee + deadline pages for best extraction.
// Generic states use a single base page — Claude will return "unable" if
// the page doesn't contain the data, flagging it for manual check or
// future PDF fallback.
interface StateUrlConfig {
  urls: string[];
  label: string;
}

const STATE_URL_CONFIG: Record<string, StateUrlConfig> = {
  // ── Curated (verified by prototype) ──
  wy: {
    urls: [
      "https://wgfd.wyo.gov/licenses-applications/application-dates-deadlines",
      "https://wgfd.wyo.gov/licenses-applications/license-fee-list",
    ],
    label: "wgfd.wyo.gov",
  },
  id: {
    urls: [
      "https://idfg.idaho.gov/licenses/applications",
      "https://idfg.idaho.gov/licenses/fees-nonresident",
      "https://idfg.idaho.gov/licenses/controlled/apply",
    ],
    label: "idfg.idaho.gov",
  },
  ut: {
    urls: [
      "https://wildlife.utah.gov/licenses/guides/application.html",
      "https://wildlife.utah.gov/hunting/main-hunting-page/big-game.html",
      "https://wildlife.utah.gov/licenses/fees.html",
    ],
    label: "wildlife.utah.gov",
  },
  mt: {
    urls: [
      "https://fwp.mt.gov/buyandapply/hunting-licenses/application-drawing-dates",
      "https://fwp.mt.gov/buyandapply/fees-and-general-information",
      "https://fwp.mt.gov/buyandapply/hunting-licenses/nonresident-licenses",
    ],
    label: "fwp.mt.gov",
  },
  co: {
    urls: [
      "https://cpw.state.co.us/hunting/big-game",
    ],
    label: "cpw.state.co.us",
  },
  // ── Generic (single base URL — best-effort) ──
  az: { urls: ["https://www.azgfd.com/hunting/draw/"], label: "azgfd.com" },
  ca: { urls: ["https://wildlife.ca.gov/Licensing/Hunting"], label: "wildlife.ca.gov" },
  nv: { urls: ["https://www.ndow.org/hunting/"], label: "ndow.org" },
  nm: { urls: ["https://www.wildlife.state.nm.us/hunting/"], label: "wildlife.state.nm.us" },
  or: {
    urls: [
      "https://myodfw.com/big-game-hunting",
      "https://myodfw.com/articles/controlled-hunt-navigation",
    ],
    label: "myodfw.com",
  },
  wa: {
    urls: [
      "https://wdfw.wa.gov/licenses/hunting",
      "https://wdfw.wa.gov/licenses/hunting/big-game",
    ],
    label: "wdfw.wa.gov",
  },
  // ── Eastern states ──
  pa: { urls: ["https://www.pgc.pa.gov/hunting"], label: "pgc.pa.gov" },
  mi: { urls: ["https://www.michigan.gov/dnr/hunting"], label: "michigan.gov/dnr" },
  wi: { urls: ["https://dnr.wisconsin.gov/topic/hunting"], label: "dnr.wisconsin.gov" },
  ky: { urls: ["https://fw.ky.gov/hunt"], label: "fw.ky.gov" },
  mn: { urls: ["https://www.dnr.state.mn.us/hunting"], label: "dnr.state.mn.us" },
  tx: { urls: ["https://tpwd.texas.gov/huntwild/hunt"], label: "tpwd.texas.gov" },
  oh: { urls: ["https://ohiodnr.gov/hunting"], label: "ohiodnr.gov" },
  il: { urls: ["https://www2.illinois.gov/dnr/hunting"], label: "illinois.gov/dnr" },
  ms: { urls: ["https://www.mdwfp.com/hunting"], label: "mdwfp.com" },
  ga: { urls: ["https://georgiawildlife.com/hunting"], label: "georgiawildlife.com" },
  sd: { urls: ["https://gfp.sd.gov/hunting/"], label: "gfp.sd.gov" },
  ks: { urls: ["https://ksoutdoors.com/Hunting"], label: "ksoutdoors.com" },
  ia: { urls: ["https://www.iowadnr.gov/Hunting"], label: "iowadnr.gov" },
};

// ── Types ─────────────────────────────────────────────────────────────────
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

// ── Dedupe ────────────────────────────────────────────────────────────────
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

// ── HTML → text ───────────────────────────────────────────────────────────
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/?(p|div|br|li|h[1-6]|tr|td|th|table)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

// ── Fetch pages for a state ───────────────────────────────────────────────
async function fetchStatePages(
  stateId: string,
): Promise<{ text: string; fetchedUrls: string[]; errors: string[] }> {
  const config = STATE_URL_CONFIG[stateId];
  if (!config) {
    return { text: "", fetchedUrls: [], errors: [`No URL config for state: ${stateId}`] };
  }

  const texts: string[] = [];
  const fetchedUrls: string[] = [];
  const errors: string[] = [];

  for (const url of config.urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": UA,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
      });

      if (!res.ok) {
        errors.push(`${url} → HTTP ${res.status}`);
        continue;
      }

      const html = await res.text();
      const stripped = htmlToText(html).trim();
      const truncated =
        stripped.length > MAX_CHARS_PER_PAGE
          ? stripped.slice(0, MAX_CHARS_PER_PAGE) + "\n[...truncated...]"
          : stripped;
      texts.push(`=== ${url} ===\n${truncated}\n=== END ===`);
      fetchedUrls.push(url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${url} → ${msg.slice(0, 100)}`);
    }
  }

  return { text: texts.join("\n\n"), fetchedUrls, errors };
}

// ── Build prompt ──────────────────────────────────────────────────────────
function buildPrompt(record: StateSeasonData, pageText: string): string {
  const stateName = STATE_NAMES[record.stateId.toUpperCase()] ?? record.stateName;
  const config = STATE_URL_CONFIG[record.stateId];
  const label = config?.label ?? "official state agency";

  return `You are verifying hunting application data for Tag Hunter.

State: ${stateName}
Species: ${record.species}
Source: ${label}

Page text from official state agency pages is included below. Extract the answers from the page text — do NOT guess or use prior knowledge. If the pages do not state something explicitly, return null for that field and set unable_to_verify: true.

FEE CONVENTION: feeNonresident represents the TOTAL nonresident cost to hunt this species — license + permit/tag + application fees combined. Do NOT report just the tag or just the application fee.

Find for the ${SEASON_YEAR} nonresident ${record.species} draw/application:
1. Application close date (month and day)
2. Total nonresident cost in USD (all fees combined)
3. Whether this species for nonresidents is OTC or draw-only

Stored values to compare against:
- Close date: ${record.appCloseMonth}/${record.appCloseDay}
- NR fee: $${record.feeNonresident}
- OTC for NR: ${record.hasOTC}

Return ONLY this JSON (no prose, no code fences):
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
  "source_url": "the URL from above where you found the key data",
  "source_label": "${label}",
  "discrepancies": "describe any mismatches or null",
  "notes": "any important caveats or null",
  "unable_to_verify": true or false,
  "unable_reason": "why if unable_to_verify is true or null"
}

${pageText}`;
}

// ── JSON extraction ───────────────────────────────────────────────────────
function extractJson(text: string): unknown | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
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

// ── Call Claude (no web_search — just text analysis) ──────────────────────
let lastFailureReason: string | null = null;

async function callClaude(prompt: string): Promise<ClaudeFindings | null> {
  lastFailureReason = null;

  let response: Anthropic.Message;
  try {
    response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: "user", content: prompt }],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = err instanceof Anthropic.APIError ? err.status : "no-status";
    lastFailureReason = `API error (${status}): ${msg.slice(0, 150)}`;
    return null;
  }

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map(b => b.text)
    .join("");

  if (!text || text.trim().length === 0) {
    lastFailureReason = `empty response (stop_reason: ${response.stop_reason})`;
    return null;
  }

  const parsed = extractJson(text);
  if (parsed === null) {
    lastFailureReason = `json parse failed (${text.length} chars)`;
    fs.appendFileSync(
      path.join(process.cwd(), "scripts", "verification-parse-failures.log"),
      `\n=== ${new Date().toISOString()} ===\n${text}\n`,
    );
    return null;
  }
  if (!isValidFindings(parsed)) {
    lastFailureReason = `invalid shape (keys: ${Object.keys(parsed as object).slice(0, 5).join(",")})`;
    return null;
  }
  return parsed;
}

// ── Auto-stamp in Supabase ────────────────────────────────────────────────
async function stampInSupabase(
  record: StateSeasonData,
  findings: ClaudeFindings,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) return { ok: false, error: "Supabase not configured" };

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
        notes: findings.notes ?? "AI-verified via HTML fetch",
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

  const stored = {
    close_month: record.appCloseMonth,
    close_day: record.appCloseDay,
    fee_nr: record.feeNonresident,
    hasOTC: record.hasOTC,
  };

  // 1. Fetch HTML pages
  const { text: pageText, fetchedUrls, errors: fetchErrors } =
    await fetchStatePages(record.stateId);

  if (fetchedUrls.length === 0) {
    const reason = fetchErrors.length > 0
      ? `All fetches failed: ${fetchErrors.join("; ")}`
      : "No URL config for this state";
    console.log(`${label} → ? UNABLE (fetch: ${reason.slice(0, 80)})`);
    return {
      stateId: record.stateId,
      species: record.species,
      stateName,
      stored,
      found: null,
      status: "unable",
      auto_stamped: false,
      supabase_error: null,
      discrepancies: reason,
    };
  }

  // Log fetch errors for partial successes
  if (fetchErrors.length > 0) {
    console.log(`  (${fetchErrors.length} fetch errors: ${fetchErrors.join("; ").slice(0, 80)})`);
  }

  // 2. Call Claude with page text
  const prompt = buildPrompt(record, pageText);
  const findings = await callClaude(prompt);

  if (!findings) {
    const reason = lastFailureReason ?? "unknown";
    console.log(`${label} → ? UNABLE (${reason.slice(0, 80)})`);
    return {
      stateId: record.stateId,
      species: record.species,
      stateName,
      stored,
      found: null,
      status: "unable",
      auto_stamped: false,
      supabase_error: null,
      discrepancies: reason,
    };
  }

  if (findings.unable_to_verify) {
    console.log(`${label} → ? UNABLE (${(findings.unable_reason ?? "no reason").slice(0, 80)})`);
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

  if (allMatch && isHighConfidence && findings.verified) {
    const stamp = await stampInSupabase(record, findings);
    const stampMsg = stamp.ok ? "stamped" : `stamp failed: ${(stamp as { error: string }).error}`;
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

  // Mismatches or low confidence
  const issues: string[] = [];
  if (!findings.date_matches)
    issues.push(
      `date: stored ${stored.close_month}/${stored.close_day}, found ${findings.found_close_month}/${findings.found_close_day}`,
    );
  if (!findings.fee_matches)
    issues.push(`fee: stored $${stored.fee_nr}, found $${findings.found_fee_nr}`);
  if (!findings.otc_matches)
    issues.push(`otc: stored ${stored.hasOTC}, found ${findings.found_is_otc_nr}`);
  if (findings.confidence !== "high")
    issues.push(`confidence: ${findings.confidence}`);
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
function buildMarkdownReport(results: ResultEntry[], runAt: string): string {
  const verified = results.filter(r => r.status === "verified");
  const mismatches = results.filter(r => r.status === "mismatch");
  const unable = results.filter(r => r.status === "unable");

  const lines: string[] = [];
  lines.push("# Tag Hunter Data Verification Report");
  lines.push(`Run: ${runAt} · Method: HTML fetch + Claude analysis`);
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
        if (!f.date_matches)
          lines.push(
            `- Close date: stored ${m.stored.close_month}/${m.stored.close_day}, found ${f.found_close_month}/${f.found_close_day} → **UPDATE**`,
          );
        if (!f.fee_matches)
          lines.push(
            `- NR fee: stored $${m.stored.fee_nr}, found $${f.found_fee_nr} → **UPDATE**`,
          );
        if (!f.otc_matches)
          lines.push(
            `- OTC for NR: stored ${m.stored.hasOTC}, found ${f.found_is_otc_nr} → **UPDATE**`,
          );
        if (f.confidence !== "high") lines.push(`- Confidence: ${f.confidence}`);
        if (f.notes) lines.push(`- Notes: ${f.notes}`);
        lines.push(`- Source: [${f.source_label}](${f.source_url})`);
      } else {
        lines.push(`- ${m.discrepancies}`);
      }
      lines.push("");
    }
  }

  if (unable.length > 0) {
    lines.push("## ? Unable to Verify — Manual Check or PDF Needed");
    lines.push("");
    for (const u of unable) {
      lines.push(`### ${u.stateName} · ${u.species}`);
      const reason = u.found?.unable_reason ?? u.discrepancies ?? "no reason given";
      lines.push(`- Reason: ${reason}`);
      const config = STATE_URL_CONFIG[u.stateId];
      if (config) lines.push(`- Check: [${config.label}](${config.urls[0]})`);
      lines.push("");
    }
  }

  if (verified.length > 0) {
    lines.push(`## ✓ Auto-Verified Records (${verified.length})`);
    lines.push("");
    for (const v of verified) {
      const src = v.found?.source_label ?? "unknown source";
      const stamped = v.auto_stamped ? "" : " *(stamp failed)*";
      lines.push(`- ${v.stateName} · ${v.species} · ${src}${stamped}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const allRecords = dedupedRecords();
  const limitArg = process.env.VERIFY_LIMIT
    ? parseInt(process.env.VERIFY_LIMIT, 10)
    : null;
  const records =
    limitArg && limitArg > 0 ? allRecords.slice(0, limitArg) : allRecords;
  const total = records.length;
  const startedAt = Date.now();
  const runAt = new Date().toISOString();

  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TAG HUNTER DATA VERIFICATION (v2 — fetch-based)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Records to verify: ${total}`);
  console.log(`Model: ${MODEL}`);
  console.log(`Method: HTML fetch → Claude analysis (no web_search)`);
  console.log(`Season year: ${SEASON_YEAR}`);
  console.log(`Supabase auto-stamp: ${HAS_SUPABASE ? "enabled" : "disabled"}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");

  // Preflight: verify Claude API key works
  console.log("→ Preflight: testing API key...");
  try {
    await anthropic.messages.create({
      model: MODEL,
      max_tokens: 50,
      messages: [{ role: "user", content: "Reply with OK" }],
    });
    console.log("  ✓ API key valid\n");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ API key failed: ${msg}`);
    process.exit(1);
  }

  const results: ResultEntry[] = [];

  for (let i = 0; i < records.length; i++) {
    const result = await processRecord(records[i], i, total);
    results.push(result);

    if (i === 4) {
      const elapsed = (Date.now() - startedAt) / 1000;
      const perRecord = elapsed / 5;
      const remainingSeconds = Math.round(perRecord * (total - 5));
      const mm = Math.floor(remainingSeconds / 60);
      const ss = remainingSeconds % 60;
      console.log(`    ⌛ ETA: ~${mm}m ${ss}s`);
    }

    if (i < records.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  // ── Write reports ──────────────────────────────────────────────────────
  const verifiedCount = results.filter(r => r.status === "verified").length;
  const mismatchCount = results.filter(r => r.status === "mismatch").length;
  const unableCount = results.filter(r => r.status === "unable").length;

  const report = {
    run_at: runAt,
    model: MODEL,
    method: "html-fetch",
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

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(0);

  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("VERIFICATION COMPLETE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✓ Auto-verified and stamped:  ${verifiedCount} records`);
  console.log(`⚠ Mismatches — fix required:  ${mismatchCount} records`);
  console.log(`? Unable to verify:           ${unableCount} records`);
  console.log(`⏱ Elapsed: ${elapsed}s`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("Reports:");
  console.log(`  ${mdPath}`);
  console.log(`  ${jsonPath}`);
  console.log("");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
