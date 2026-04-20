// Regenerates DATA_STATUS.md from data/regulations/*.json.
// Run: `npm run data-status`
//
// Output is checked in. Regenerate after every verification pass (or whenever
// a state's data changes) so the priority queue stays accurate.

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { StateRegulations, SpeciesRegulations } from "../lib/regulationsTypes";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REG_DIR = join(ROOT, "data/regulations");
const OUT = join(ROOT, "DATA_STATUS.md");

const URGENT_DAYS = 60;
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

interface NextDeadline {
  iso: string;
  days: number;
  label: string;
  speciesName: string;
}

function loadStates(): StateRegulations[] {
  return readdirSync(REG_DIR)
    .filter(f => f.endsWith(".json"))
    .map(f => JSON.parse(readFileSync(join(REG_DIR, f), "utf-8")) as StateRegulations);
}

function daysFromToday(iso: string): number {
  const d = new Date(iso + "T00:00:00");
  return Math.ceil((d.getTime() - TODAY.getTime()) / 86_400_000);
}

function fmtDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function nextDeadlineFor(species: SpeciesRegulations): NextDeadline | null {
  const candidates: { iso: string; label: string }[] = [];
  if (species.applicationWindow.closes) {
    candidates.push({ iso: species.applicationWindow.closes, label: "primary draw closes" });
  }
  if (species.secondaryDraw?.closes) {
    candidates.push({ iso: species.secondaryDraw.closes, label: "secondary draw closes" });
  }
  if (species.paymentDeadline) {
    candidates.push({ iso: species.paymentDeadline, label: "payment due" });
  }
  if (species.otc?.onSaleDate) {
    candidates.push({ iso: species.otc.onSaleDate, label: "OTC on sale" });
  }
  const future = candidates
    .map(c => ({ ...c, days: daysFromToday(c.iso) }))
    .filter(c => c.days >= 0)
    .sort((a, b) => a.days - b.days);
  if (future.length === 0) return null;
  const top = future[0];
  return { iso: top.iso, days: top.days, label: top.label, speciesName: species.name };
}

function stateNextDeadline(state: StateRegulations): NextDeadline | null {
  const all = state.species
    .map(sp => nextDeadlineFor(sp))
    .filter((d): d is NextDeadline => d !== null)
    .sort((a, b) => a.days - b.days);
  return all[0] ?? null;
}

function isVerified(sp: SpeciesRegulations): boolean {
  return !!sp.verifiedDate;
}

function statusBadge(sp: SpeciesRegulations): string {
  return isVerified(sp) ? "✓ VERIFIED" : "⚠ ESTIMATED";
}

function urgencyBucket(days: number | null): string {
  if (days === null) return "—";
  if (days < 0) return "passed";
  if (days <= 14) return "🔥🔥 this week";
  if (days <= 30) return "🔥 < 30d";
  if (days <= 60) return "⚠️ < 60d";
  if (days <= 90) return "< 90d";
  return `${days}d`;
}

function main(): void {
  const states = loadStates().sort((a, b) => a.state.localeCompare(b.state));
  const totalSpecies = states.reduce((s, st) => s + st.species.length, 0);
  const verifiedSpecies = states.reduce(
    (s, st) => s + st.species.filter(isVerified).length,
    0,
  );

  const stateRows = states.map(st => {
    const nd = stateNextDeadline(st);
    const verifiedCount = st.species.filter(isVerified).length;
    return {
      state: st.state,
      abbr: st.abbreviation,
      total: st.species.length,
      verified: verifiedCount,
      nextDeadline: nd,
      lastUpdated: st.lastUpdated ?? "—",
    };
  });

  const priority = stateRows
    .filter(r => r.nextDeadline && r.nextDeadline.days <= URGENT_DAYS && r.verified < r.total)
    .sort((a, b) => (a.nextDeadline!.days - b.nextDeadline!.days));

  const today = TODAY.toISOString().slice(0, 10);
  const lines: string[] = [];

  lines.push(`# Tag Hunter Regulations Data Status`);
  lines.push("");
  lines.push(`Generated: ${today}  ·  Source: \`data/regulations/*.json\`  ·  Regenerate: \`npm run data-status\``);
  lines.push("");
  lines.push(`## Summary`);
  lines.push("");
  lines.push(`- States covered: **${states.length}**`);
  lines.push(`- Species entries: **${totalSpecies}**`);
  lines.push(`- ✓ Verified: **${verifiedSpecies}** (${Math.round(100 * verifiedSpecies / totalSpecies)}%)`);
  lines.push(`- ⚠ Estimated: **${totalSpecies - verifiedSpecies}** (${Math.round(100 * (totalSpecies - verifiedSpecies) / totalSpecies)}%)`);
  lines.push(`- States with an ESTIMATED entry whose next deadline is within ${URGENT_DAYS} days: **${priority.length}**`);
  lines.push("");

  lines.push(`## 🔥 Priority Queue`);
  lines.push("");
  lines.push(
    `States with an upcoming application deadline within ${URGENT_DAYS} days that still have ESTIMATED entries. Verify these first — a hunter making a financial decision off stale data here is the highest-blast-radius failure.`,
  );
  lines.push("");
  if (priority.length === 0) {
    lines.push(`_No urgent states. All states with deadlines in the next ${URGENT_DAYS} days are fully verified._`);
  } else {
    lines.push(`| Rank | State | Verified / Total | Next deadline | Days | What's due |`);
    lines.push(`| ---: | --- | :---: | --- | ---: | --- |`);
    priority.forEach((r, i) => {
      const nd = r.nextDeadline!;
      lines.push(
        `| ${i + 1} | ${r.state} | ${r.verified}/${r.total} | ${fmtDate(nd.iso)} | ${nd.days} | ${nd.speciesName} ${nd.label} |`,
      );
    });
  }
  lines.push("");

  lines.push(`## All States`);
  lines.push("");
  lines.push(`| State | Species | Verified | Last touched | Next deadline | Urgency |`);
  lines.push(`| --- | ---: | :---: | --- | --- | --- |`);
  for (const r of stateRows) {
    const nd = r.nextDeadline;
    const dl = nd ? `${fmtDate(nd.iso)} (${nd.speciesName})` : "—";
    const urg = nd ? urgencyBucket(nd.days) : "—";
    lines.push(
      `| ${r.state} | ${r.total} | ${r.verified}/${r.total} | ${r.lastUpdated} | ${dl} | ${urg} |`,
    );
  }
  lines.push("");

  lines.push(`## Per-Species Detail`);
  lines.push("");
  lines.push(`Every species, every state. Sorted by state, then by next deadline (soonest first within each state).`);
  lines.push("");
  lines.push(`| State | Species | Status | Verified date | Source | Next deadline | Days |`);
  lines.push(`| --- | --- | :---: | --- | --- | --- | ---: |`);
  for (const st of states) {
    const sortedSpecies = [...st.species].sort((a, b) => {
      const da = nextDeadlineFor(a);
      const db = nextDeadlineFor(b);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da.days - db.days;
    });
    for (const sp of sortedSpecies) {
      const nd = nextDeadlineFor(sp);
      const dl = nd ? `${fmtDate(nd.iso)} · ${nd.label}` : "—";
      const days = nd ? `${nd.days}` : "—";
      const src = sp.sourceUrl ? `[link](${sp.sourceUrl})` : "—";
      lines.push(
        `| ${st.state} | ${sp.name} | ${statusBadge(sp)} | ${sp.verifiedDate ?? "—"} | ${src} | ${dl} | ${days} |`,
      );
    }
  }
  lines.push("");

  lines.push(`## What "Verified" Means`);
  lines.push("");
  lines.push(`A species entry is **VERIFIED** when its JSON has both \`verifiedDate\` (ISO date) and \`sourceUrl\` (link to the official agency page or PDF) populated. This means every fee, deadline, and rule on that species card was cross-checked against the official source on that date.`);
  lines.push("");
  lines.push(`A species entry is **ESTIMATED** otherwise — compiled from secondary sources (huntingData.ts, hunting media, prior-year brochures) and may have errors. Hunters making financial decisions should always confirm against the state agency.`);
  lines.push("");
  lines.push(`## Verification Workflow`);
  lines.push("");
  lines.push(`1. Pick the top entry from the **Priority Queue** above.`);
  lines.push(`2. Open that state's official big-game brochure PDF.`);
  lines.push(`3. Cross-check every fee, deadline, point-system rule, and OTC detail in the species's JSON entry against the brochure. Paste the relevant section into chat with Claude — it'll flag discrepancies and propose edits.`);
  lines.push(`4. Update the JSON file with corrections. Add \`verifiedDate\` (today's ISO date) and \`sourceUrl\` (link to the brochure or the official big-game page).`);
  lines.push(`5. Run \`npm run data-status\` to regenerate this file.`);
  lines.push(`6. Commit: \`data(regulations): verify <state> <species> against <agency>\`.`);
  lines.push("");

  writeFileSync(OUT, lines.join("\n") + "\n", "utf-8");
  console.log(`Wrote ${OUT}`);
  console.log(`Summary: ${verifiedSpecies}/${totalSpecies} species verified across ${states.length} states.`);
  console.log(`Priority queue: ${priority.length} state(s) with ESTIMATED entries due within ${URGENT_DAYS} days.`);
}

main();
