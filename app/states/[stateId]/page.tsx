import Link from "next/link";
import { huntingData, SPECIES_LABELS, SPECIES_EMOJI, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";
import { getOTCDetails } from "@/lib/otcDetails";
import { notFound } from "next/navigation";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const OFFICIAL_SITES: Record<string, { url: string; name: string }> = {
  co: { url: "https://cpw.state.co.us", name: "cpw.state.co.us" },
  wy: { url: "https://wgfd.wyo.gov", name: "wgfd.wyo.gov" },
  mt: { url: "https://fwp.mt.gov", name: "fwp.mt.gov" },
  id: { url: "https://idfg.idaho.gov", name: "idfg.idaho.gov" },
  ut: { url: "https://wildlife.utah.gov", name: "wildlife.utah.gov" },
  nv: { url: "https://ndow.org", name: "ndow.org" },
  az: { url: "https://azgfd.com", name: "azgfd.com" },
  nm: { url: "https://wildlife.state.nm.us", name: "wildlife.state.nm.us" },
  or: { url: "https://dfw.state.or.us", name: "dfw.state.or.us" },
  wa: { url: "https://wdfw.wa.gov", name: "wdfw.wa.gov" },
  ca: { url: "https://wildlife.ca.gov", name: "wildlife.ca.gov" },
  sd: { url: "https://gfp.sd.gov", name: "gfp.sd.gov" },
  tx: { url: "https://tpwd.texas.gov", name: "tpwd.texas.gov" },
  ks: { url: "https://ksoutdoors.com", name: "ksoutdoors.com" },
  ia: { url: "https://iowadnr.gov", name: "iowadnr.gov" },
  oh: { url: "https://ohiodnr.gov", name: "ohiodnr.gov" },
  il: { url: "https://dnr.illinois.gov", name: "dnr.illinois.gov" },
  ms: { url: "https://mdwfp.com", name: "mdwfp.com" },
  ga: { url: "https://georgiawildlife.com", name: "georgiawildlife.com" },
  pa: { url: "https://pgc.pa.gov", name: "pgc.pa.gov" },
  mi: { url: "https://michigan.gov/dnr", name: "michigan.gov/dnr" },
  wi: { url: "https://dnr.wisconsin.gov", name: "dnr.wisconsin.gov" },
  ky: { url: "https://fw.ky.gov", name: "fw.ky.gov" },
  mn: { url: "https://dnr.state.mn.us", name: "dnr.state.mn.us" },
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
  very_hard: "Very Hard",
  nearly_impossible: "Bucket List",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#4ade80",
  moderate: "#86efac",
  hard: "#f59e0b",
  very_hard: "#f97316",
  nearly_impossible: "#f87171",
};

const POINT_SYSTEM_LABELS: Record<string, string> = {
  preference: "Preference Points",
  bonus: "Bonus Points",
  weighted: "Weighted Points",
  none: "Random Lottery",
  otc: "Over-the-Counter",
};

export async function generateStaticParams() {
  const ids = [...new Set(huntingData.map(d => d.stateId))];
  return ids.map(id => ({ stateId: id }));
}

export async function generateMetadata({ params }: { params: Promise<{ stateId: string }> }) {
  const { stateId } = await params;
  const stateName = STATE_NAMES[stateId.toUpperCase()] ?? stateId.toUpperCase();
  return {
    title: `${stateName} Hunting — Draw Tags, OTC, Fees & Deadlines | Tag Hunter`,
    description: `Complete guide to hunting tags in ${stateName}. Non-resident fees, draw odds, application deadlines, preference points, and OTC options for elk, deer, pronghorn, and more.`,
  };
}

export default async function StateProfilePage({ params }: { params: Promise<{ stateId: string }> }) {
  const { stateId } = await params;
  const entries = huntingData.filter(d => d.stateId === stateId);

  if (entries.length === 0) notFound();

  const stateName = entries[0].stateName;
  const site = OFFICIAL_SITES[stateId];

  // Deduplicate by species (take first entry per species for summary)
  const bySpecies = new Map<SpeciesKey, typeof entries[0][]>();
  for (const e of entries) {
    const existing = bySpecies.get(e.species as SpeciesKey) ?? [];
    existing.push(e);
    bySpecies.set(e.species as SpeciesKey, existing);
  }

  const hasOTC = entries.some(e => e.hasOTC);
  const otcSpecies = entries.filter(e => e.hasOTC);
  const minFee = Math.min(...entries.map(e => e.feeNonresident));
  const maxFee = Math.max(...entries.map(e => e.feeNonresident));

  // Point systems present
  const pointSystems = [...new Set(entries.map(e => e.pointSystem))];

  // Upcoming deadlines (next occurrence)
  const now = new Date();
  const deadlines = entries
    .filter((e, i, arr) => arr.findIndex(x => x.species === e.species) === i)
    .map(e => {
      let year = now.getFullYear();
      let d = new Date(year, e.appCloseMonth - 1, e.appCloseDay);
      if (d < now) { year += 1; d = new Date(year, e.appCloseMonth - 1, e.appCloseDay); }
      return { ...e, closeDate: d, year, daysUntil: Math.ceil((d.getTime() - now.getTime()) / 86400000) };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <main className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold" style={{ color: "#f59e0b" }}>🎯 Tag Hunter</Link>
          <span style={{ color: "#2a3a2a" }}>|</span>
          <span className="text-base font-semibold" style={{ color: "#e8f0e8" }}>{stateName}</span>
        </div>
        <div className="flex gap-2">
          <Link href="/states" className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#c8d8c8" }}>
            ← All States
          </Link>
          <Link href="/plan" className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ backgroundColor: "#f59e0b", color: "#0f1a0f" }}>
            Build Plan →
          </Link>
        </div>
      </div>

      {/* State overview */}
      <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#f59e0b" }}>{stateName}</h1>
        <p className="text-sm mb-1" style={{ color: "#8a9e8a" }}>
          Non-resident hunting — draw tags, OTC options, fees & deadlines
        </p>
        <p className="text-xs mb-4" style={{ color: "#4a5a4a" }}>
          Data last updated: April 2026
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Species Available", value: bySpecies.size },
            { label: "NR OTC Tags", value: hasOTC ? `${otcSpecies.length} species` : "Draw only" },
            { label: "NR Fee Range", value: minFee === maxFee ? `$${minFee.toLocaleString()}` : `$${minFee.toLocaleString()}–$${maxFee.toLocaleString()}` },
            { label: "Point System", value: pointSystems.map(p => POINT_SYSTEM_LABELS[p] ?? p).join(", ") },
          ].map(s => (
            <div key={s.label} className="rounded-lg p-3 text-center"
              style={{ backgroundColor: "#1a2a1a", border: "1px solid #2a3a2a" }}>
              <div className="font-bold text-sm" style={{ color: "#f59e0b" }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "#6a7e6a" }}>{s.label}</div>
            </div>
          ))}
        </div>
        {site && (
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "#6a7e6a" }}>Official website:</span>
            <a href={site.url} target="_blank" rel="noopener noreferrer"
              className="text-xs font-medium underline" style={{ color: "#f59e0b" }}>
              {site.name} ↗
            </a>
          </div>
        )}
      </div>

      {/* Upcoming deadlines */}
      <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#8a9e8a" }}>
          Application Deadlines
        </h2>
        <div className="space-y-2">
          {deadlines.map(d => (
            <div key={`${d.stateId}-${d.species}`}
              className="flex items-center justify-between py-2 border-b last:border-0"
              style={{ borderColor: "#1a2a1a" }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{SPECIES_EMOJI[d.species as SpeciesKey]}</span>
                <div>
                  <span className="text-sm font-medium" style={{ color: "#e8f0e8" }}>
                    {SPECIES_LABELS[d.species as SpeciesKey]}
                  </span>
                  {d.hasOTC && (
                    <span
                      className="ml-2 text-xs px-1.5 py-0.5 rounded"
                      title="Over-the-counter tag available for non-residents — no draw required"
                      style={{ backgroundColor: "#1a3a1a", color: "#4ade80", border: "1px solid #2a5a2a" }}
                    >
                      NR OTC
                    </span>
                  )}
                  <div className="text-xs" style={{ color: "#6a7e6a" }}>
                    Opens {MONTH_NAMES[d.appOpenMonth - 1]} · Closes {MONTH_NAMES[d.appCloseMonth - 1]} {d.appCloseDay}, {d.year}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold" style={{
                  color: d.daysUntil <= 14 ? "#f87171" : d.daysUntil <= 45 ? "#f59e0b" : "#4ade80"
                }}>
                  {d.daysUntil}d
                </div>
                <div className="text-xs" style={{ color: "#8a9e8a" }}>
                  NR ${d.feeNonresident.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Species breakdown */}
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#8a9e8a" }}>
        Species Details
      </h2>
      <div className="space-y-3 mb-6">
        {[...bySpecies.entries()].map(([species, entries]) => {
          const primary = entries[0];
          const diffColor = DIFFICULTY_COLORS[primary.difficulty] ?? "#8a9e8a";
          const otcDetails = entries.some(e => e.hasOTC) ? getOTCDetails(stateId, species) : undefined;
          return (
            <div key={species} className="rounded-xl p-4"
              style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{SPECIES_EMOJI[species]}</span>
                  <div>
                    <span className="font-bold text-sm" style={{ color: "#e8f0e8" }}>
                      {SPECIES_LABELS[species]}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-2 py-0.5 rounded font-medium"
                        style={{ backgroundColor: "#1a2a1a", color: "#8a9e8a", border: "1px solid #2a3a2a" }}>
                        {POINT_SYSTEM_LABELS[primary.pointSystem] ?? primary.pointSystem}
                      </span>
                      <span className="text-xs font-medium" style={{ color: diffColor }}>
                        {DIFFICULTY_LABELS[primary.difficulty] ?? primary.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold" style={{ color: "#f59e0b" }}>
                    ${primary.feeNonresident.toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ color: "#6a7e6a" }}>NR fee</div>
                </div>
              </div>

              {/* Odds bar */}
              {primary.pointSystem !== "otc" && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1" style={{ color: "#6a7e6a" }}>
                    <span>Draw odds by points</span>
                    <span>{Math.round(primary.oddsAtZeroPts * 100)}% at 0 pts → {Math.round(primary.oddsAt20Pts * 100)}% at 20 pts</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[primary.oddsAtZeroPts, primary.oddsAt5Pts, primary.oddsAt10Pts, primary.oddsAt15Pts, primary.oddsAt20Pts].map((odds, i) => (
                      <div key={i} className="flex-1 rounded-sm flex flex-col items-center gap-0.5">
                        <div className="w-full h-6 rounded-sm overflow-hidden" style={{ backgroundColor: "#2a3a2a" }}>
                          <div className="w-full rounded-sm transition-all"
                            style={{ height: `${Math.max(odds * 100, 2)}%`, backgroundColor: diffColor, marginTop: `${100 - Math.max(odds * 100, 2)}%` }} />
                        </div>
                        <span className="text-xs" style={{ color: "#4a5a4a" }}>{[0,5,10,15,20][i]}p</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs leading-relaxed" style={{ color: "#6a7e6a" }}>
                {primary.notes?.replace(/\s*\/\/\s*VERIFY:.*$/i, "")}
              </p>

              {entries.length > 1 && (
                <div className="mt-2 pt-2 border-t" style={{ borderColor: "#1a2a1a" }}>
                  <span className="text-xs" style={{ color: "#4a5a4a" }}>
                    Also: {entries.slice(1).map(e => e.seasonType).join(", ")} seasons available
                  </span>
                </div>
              )}

              {otcDetails && (
                <details className="mt-3 pt-3 border-t" style={{ borderColor: "#1a2a1a" }}>
                  <summary
                    className="cursor-pointer text-xs font-semibold uppercase tracking-wider select-none"
                    style={{ color: "#f59e0b" }}
                  >
                    OTC tag details, valid units & fees
                  </summary>
                  <div className="mt-3 space-y-3 text-xs" style={{ color: "#8a9e8a" }}>
                    {otcDetails.seasonDates && otcDetails.seasonDates.length > 0 && (
                      <div>
                        <div className="font-semibold mb-1" style={{ color: "#e8f0e8" }}>Season dates</div>
                        <ul className="space-y-0.5">
                          {otcDetails.seasonDates.map(s => (
                            <li key={s.name}>
                              <span style={{ color: "#6a7e6a" }}>{s.name}:</span>{" "}
                              <span style={{ color: "#e8f0e8" }}>{s.dates}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {otcDetails.feeBreakdown && (
                      <div>
                        <div className="font-semibold mb-1" style={{ color: "#e8f0e8" }}>NR fee breakdown</div>
                        <ul className="space-y-0.5">
                          {otcDetails.feeBreakdown.parts.map(p => (
                            <li key={p.label}>
                              <span style={{ color: "#6a7e6a" }}>{p.label}:</span>{" "}
                              <span style={{ color: "#e8f0e8" }}>~${p.amount.toLocaleString()}</span>
                            </li>
                          ))}
                          <li className="pt-1 mt-1" style={{ borderTop: "1px solid #1a2a1a" }}>
                            <span style={{ color: "#8a9e8a" }}>Total:</span>{" "}
                            <span className="font-bold" style={{ color: "#f59e0b" }}>
                              ~${otcDetails.feeBreakdown.total.toLocaleString()}
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}

                    {otcDetails.validGmus && otcDetails.validGmus.length > 0 && (
                      <div>
                        <div className="font-semibold mb-1" style={{ color: "#e8f0e8" }}>
                          Valid GMUs ({otcDetails.validGmus.length})
                        </div>
                        <div
                          className="font-mono text-xs leading-relaxed p-2 rounded"
                          style={{
                            backgroundColor: "#0f1a0f",
                            border: "1px solid #2a3a2a",
                            color: "#e8f0e8",
                          }}
                        >
                          {otcDetails.validGmus.join(", ")}
                        </div>
                        {otcDetails.validGmusNote && (
                          <p className="mt-2 text-xs leading-relaxed" style={{ color: "#6a7e6a" }}>
                            {otcDetails.validGmusNote}
                          </p>
                        )}
                      </div>
                    )}

                    {otcDetails.buyInfo && (
                      <p className="leading-relaxed" style={{ color: "#6a7e6a" }}>
                        {otcDetails.buyInfo}
                      </p>
                    )}

                    {otcDetails.officialUrl && (
                      <a
                        href={otcDetails.officialUrl.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block font-medium underline"
                        style={{ color: "#f59e0b" }}
                      >
                        {otcDetails.officialUrl.label}
                      </a>
                    )}
                  </div>
                </details>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="rounded-xl p-5 text-center" style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
        <p className="text-sm font-semibold mb-2" style={{ color: "#e8f0e8" }}>
          Ready to build your {stateName} strategy?
        </p>
        <p className="text-xs mb-4" style={{ color: "#8a9e8a" }}>
          Get a personalized multi-year plan with exact dates, fees, and point-building recommendations.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/plan" className="px-5 py-2.5 rounded-lg text-sm font-bold"
            style={{ backgroundColor: "#f59e0b", color: "#0f1a0f" }}>
            Build My Plan →
          </Link>
          <Link href={`/odds`} className="px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: "#1a2a1a", border: "1px solid #2a3a2a", color: "#c8d8c8" }}>
            Draw Odds Calculator
          </Link>
        </div>
      </div>

      <footer className="text-center text-xs mt-8 pb-6" style={{ color: "#4a5a4a" }}>
        Always verify fees and deadlines at {site ? <a href={site.url} target="_blank" rel="noopener noreferrer" style={{ color: "#f59e0b" }}>{site.name}</a> : "the official state wildlife agency website"} before applying.
      </footer>
    </main>
  );
}
