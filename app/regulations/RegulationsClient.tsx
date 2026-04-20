"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { allRegulations } from "@/lib/regulations";
import {
  DRAW_SYSTEM_LABELS,
  SEASON_LABELS,
  type StateRegulations,
  type SpeciesRegulations,
  type FeeSide,
  type DateRange,
} from "@/lib/regulationsTypes";

const DASH = "—";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return DASH;
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return DASH;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatRange(r: DateRange | undefined): string {
  if (!r || (!r.start && !r.end)) return DASH;
  const s = r.start ? formatDate(r.start) : DASH;
  const e = r.end ? formatDate(r.end) : DASH;
  return `${s} – ${e}`;
}

function formatMoney(n: number | null | undefined): string {
  if (n === null || n === undefined) return DASH;
  return n % 1 === 0
    ? `$${n.toLocaleString()}`
    : `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

type WindowStatus =
  | { kind: "open"; daysUntilClose: number; closeLabel: string }
  | { kind: "upcoming"; daysUntilOpen: number; openLabel: string }
  | { kind: "closed"; closedSince: string };

function computeStatus(opens: string | null, closes: string | null, now: Date): WindowStatus | null {
  if (!opens && !closes) return null;
  const o = opens ? new Date(opens + "T00:00:00") : null;
  const c = closes ? new Date(closes + "T23:59:59") : null;
  if (c && now > c) return { kind: "closed", closedSince: formatDate(closes) };
  if (o && now < o) {
    return {
      kind: "upcoming",
      daysUntilOpen: Math.max(0, Math.ceil((o.getTime() - now.getTime()) / 86_400_000)),
      openLabel: formatDate(opens),
    };
  }
  if (c) {
    return {
      kind: "open",
      daysUntilClose: Math.max(0, Math.ceil((c.getTime() - now.getTime()) / 86_400_000)),
      closeLabel: formatDate(closes),
    };
  }
  return null;
}

const FEE_LINES: { key: keyof FeeSide; label: string }[] = [
  { key: "qualifyingLicense", label: "Qualifying license" },
  { key: "habitatStamp", label: "Habitat stamp" },
  { key: "applicationFee", label: "Application fee" },
  { key: "tagIfDrawn", label: "Tag (if drawn)" },
];

function FeeBlock({ fees, side }: { fees: FeeSide; side: "nr" | "resident" }) {
  const lines = FEE_LINES
    .map(l => ({ ...l, value: fees[l.key] as number | null | undefined }))
    .filter(l => l.value !== undefined);

  return (
    <div>
      <ul className="space-y-1 text-xs">
        {lines.map(l => (
          <li key={l.key} className="flex justify-between">
            <span style={{ color: "var(--text-3)" }}>{l.label}</span>
            <span style={{ color: "var(--text)" }}>{formatMoney(l.value)}</span>
          </li>
        ))}
        {fees.preferencePointOnly !== undefined && fees.preferencePointOnly !== null && (
          <li className="flex justify-between pt-1" style={{ borderTop: "1px dashed var(--border)" }}>
            <span style={{ color: "var(--text-3)" }}>Point only (no tag)</span>
            <span style={{ color: "var(--text)" }}>{formatMoney(fees.preferencePointOnly)}</span>
          </li>
        )}
        <li className="flex justify-between pt-2 mt-1 text-sm" style={{ borderTop: "1px solid var(--border)" }}>
          <span className="font-semibold" style={{ color: "var(--text)" }}>
            {side === "nr" ? "NR total estimate" : "Resident total estimate"}
          </span>
          <span className="font-bold" style={{ color: "var(--amber)" }}>
            {formatMoney(fees.totalEstimate)}
          </span>
        </li>
      </ul>
      {fees.notes && (
        <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
          {fees.notes}
        </p>
      )}
    </div>
  );
}

function GMUList({ gmus }: { gmus: number[] }) {
  const [expanded, setExpanded] = useState(false);
  const limit = 10;
  const showAll = expanded || gmus.length <= limit;
  const visible = showAll ? gmus : gmus.slice(0, limit);
  return (
    <div>
      <div
        className="font-mono text-xs leading-relaxed p-2 rounded"
        style={{
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        }}
      >
        {visible.join(", ")}
        {!showAll && <span style={{ color: "var(--text-3)" }}>, …</span>}
      </div>
      {gmus.length > limit && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="mt-2 text-xs font-medium underline"
          style={{ color: "var(--amber)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          {expanded ? "Show fewer" : `Show all ${gmus.length} units`}
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: WindowStatus | null }) {
  if (!status) {
    return (
      <span className="badge" style={{ background: "var(--bg-elevated)", color: "var(--text-3)", border: "1px solid var(--border)" }}>
        DATES TBD
      </span>
    );
  }
  if (status.kind === "open") {
    return <span className="badge badge-green">OPEN</span>;
  }
  if (status.kind === "upcoming") {
    return (
      <span
        className="badge"
        style={{
          background: "var(--amber-glow)",
          color: "var(--amber)",
          border: "1px solid var(--amber-glow-strong)",
        }}
      >
        UPCOMING
      </span>
    );
  }
  return <span className="badge badge-red">CLOSED</span>;
}

function ResultCard({
  state,
  species,
  side,
  now,
}: {
  state: StateRegulations;
  species: SpeciesRegulations;
  side: "nr" | "resident";
  now: Date;
}) {
  const status = computeStatus(species.applicationWindow.opens, species.applicationWindow.closes, now);
  const fees = side === "nr" ? species.fees.nr : species.fees.resident;
  const drawLabel = DRAW_SYSTEM_LABELS[species.drawSystem] ?? species.drawSystem;
  const seasonEntries = species.seasons ? Object.entries(species.seasons) : [];

  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
    >
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            {state.state} {species.name}
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>
            {state.abbreviation} · {state.officialUrl.replace(/^https?:\/\//, "")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-1 rounded uppercase tracking-wider"
            style={{
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-2)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-dm-mono), monospace",
            }}
          >
            {drawLabel}
          </span>
        </div>
      </div>

      {/* SECTION 1 — APPLICATION WINDOW */}
      <section className="mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-2)" }}>
          Application Window
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />
          <div className="text-sm" style={{ color: "var(--text)" }}>
            {status?.kind === "open" && (
              <>
                Closes in <span className="font-bold" style={{ color: "var(--danger)" }}>{status.daysUntilClose}d</span>{" "}
                <span style={{ color: "var(--text-2)" }}>({status.closeLabel})</span>
              </>
            )}
            {status?.kind === "upcoming" && (
              <>
                Opens in <span className="font-bold" style={{ color: "var(--amber)" }}>{status.daysUntilOpen}d</span>{" "}
                <span style={{ color: "var(--text-2)" }}>({status.openLabel})</span>
              </>
            )}
            {status?.kind === "closed" && (
              <>
                Closed <span style={{ color: "var(--text-2)" }}>({status.closedSince})</span> — next window typically opens around the same dates next year.
              </>
            )}
            {!status && <span style={{ color: "var(--text-3)" }}>Dates not yet published.</span>}
          </div>
        </div>
        <div className="mt-2 text-xs" style={{ color: "var(--text-2)" }}>
          Window: {formatDate(species.applicationWindow.opens)} → {formatDate(species.applicationWindow.closes)}
          {species.applicationWindow.timezone && (
            <span style={{ color: "var(--text-3)" }}> · {species.applicationWindow.timezone}</span>
          )}
        </div>
        {species.applicationWindow.notes && (
          <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
            {species.applicationWindow.notes}
          </p>
        )}
        {species.secondaryDraw && (
          <p className="mt-2 text-xs" style={{ color: "var(--text-2)" }}>
            <span style={{ color: "var(--text-3)" }}>Secondary draw closes:</span> {formatDate(species.secondaryDraw.closes)}
            {species.secondaryDraw.notes && (
              <span style={{ color: "var(--text-3)" }}> · {species.secondaryDraw.notes}</span>
            )}
          </p>
        )}
        {(species.resultsDate || species.paymentDeadline) && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "var(--text-2)" }}>
            {species.resultsDate && (
              <span><span style={{ color: "var(--text-3)" }}>Results:</span> {formatDate(species.resultsDate)}</span>
            )}
            {species.paymentDeadline && (
              <span><span style={{ color: "var(--text-3)" }}>Payment due:</span> {formatDate(species.paymentDeadline)}</span>
            )}
          </div>
        )}
        {state.applicationPortal && (
          <a
            href={state.applicationPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm font-medium underline"
            style={{ color: "var(--amber)" }}
          >
            Apply at {state.applicationPortal.replace(/^https?:\/\//, "")} →
          </a>
        )}
      </section>

      {/* SECTION 2 — FEES */}
      <section className="mb-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-2)" }}>
          Fees ({side === "nr" ? "Non-Resident" : "Resident"})
        </h3>
        <FeeBlock fees={fees} side={side} />
      </section>

      {/* SECTION 3 — POINT SYSTEM */}
      <section className="mb-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-2)" }}>
          Point System
        </h3>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span
            className="text-xs px-2 py-1 rounded"
            style={{
              backgroundColor: "var(--amber-glow)",
              color: "var(--amber)",
              border: "1px solid var(--amber-glow-strong)",
              fontFamily: "var(--font-dm-mono), monospace",
            }}
          >
            {DRAW_SYSTEM_LABELS[species.pointSystem.type] ?? species.pointSystem.type}
          </span>
          {species.pointSystem.costPerPoint && (
            <span className="text-xs" style={{ color: "var(--text-2)" }}>
              Point cost — NR {formatMoney(species.pointSystem.costPerPoint.nr)} / Res {formatMoney(species.pointSystem.costPerPoint.resident)}
            </span>
          )}
          {species.pointSystem.expirationYears && (
            <span className="text-xs" style={{ color: "var(--text-2)" }}>
              Expires after {species.pointSystem.expirationYears} years inactive
            </span>
          )}
          {species.pointSystem.maxPoints !== undefined && species.pointSystem.maxPoints !== null && (
            <span className="text-xs" style={{ color: "var(--text-2)" }}>
              Max {species.pointSystem.maxPoints} pts
            </span>
          )}
        </div>
        {species.pointSystem.notes && (
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
            {species.pointSystem.notes}
          </p>
        )}
      </section>

      {/* SECTION 4 — OTC */}
      {species.otc && (
        <section className="mb-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-2)" }}>
            OTC Availability
          </h3>
          {!species.otc.available ? (
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
              No OTC tags available for non-residents.
              {species.otc.notes && <span> {species.otc.notes}</span>}
            </p>
          ) : (
            <div className="space-y-3 text-xs" style={{ color: "var(--text-2)" }}>
              {species.otc.seasons && species.otc.seasons.length > 0 && (
                <div>
                  <span style={{ color: "var(--text-3)" }}>OTC seasons:</span>{" "}
                  <span style={{ color: "var(--text)" }}>{species.otc.seasons.join(", ")}</span>
                </div>
              )}
              {species.otc.seasonDates && (
                <ul className="space-y-0.5">
                  {Object.entries(species.otc.seasonDates).map(([k, r]) => (
                    <li key={k}>
                      <span style={{ color: "var(--text-3)" }}>{SEASON_LABELS[k] ?? k}:</span>{" "}
                      <span style={{ color: "var(--text)" }}>{formatRange(r)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {species.otc.onSaleDate && (
                <div>
                  <span style={{ color: "var(--text-3)" }}>On sale:</span>{" "}
                  <span style={{ color: "var(--text)" }}>{formatDate(species.otc.onSaleDate)}</span>
                </div>
              )}
              {species.otc.nrFee !== undefined && species.otc.nrFee !== null && (
                <div>
                  <span style={{ color: "var(--text-3)" }}>NR OTC fee:</span>{" "}
                  <span style={{ color: "var(--text)" }}>{formatMoney(species.otc.nrFee)}</span>
                </div>
              )}
              {species.otc.restrictions && (
                <p className="leading-relaxed" style={{ color: "var(--text-3)" }}>
                  {species.otc.restrictions}
                </p>
              )}
              {species.otc.validGMUs && species.otc.validGMUs.length > 0 && (
                <div>
                  <div className="font-semibold mb-1" style={{ color: "var(--text)" }}>
                    Valid GMUs ({species.otc.validGMUs.length})
                  </div>
                  <GMUList gmus={species.otc.validGMUs} />
                </div>
              )}
              {species.otc.excludedGMUs && species.otc.excludedGMUs.length > 0 && (
                <div>
                  <span style={{ color: "var(--text-3)" }}>Excluded (now draw):</span>{" "}
                  <span style={{ color: "var(--danger)" }}>{species.otc.excludedGMUs.join(", ")}</span>
                </div>
              )}
              {species.otc.notes && (
                <p className="leading-relaxed" style={{ color: "var(--text-3)" }}>
                  {species.otc.notes}
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {/* SECTION 5 — ALL SEASON DATES */}
      {seasonEntries.length > 0 && (
        <section className="mb-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-2)" }}>
            Season Dates
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: "var(--text-3)" }}>
                  <th className="text-left py-1 pr-3 font-medium">Season</th>
                  <th className="text-left py-1 pr-3 font-medium">Dates</th>
                  <th className="text-left py-1 pr-3 font-medium">Draw?</th>
                  <th className="text-left py-1 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {seasonEntries.map(([k, r]) => {
                  const isOTC = species.otc?.seasonDates && k in species.otc.seasonDates;
                  const drawRequired = !isOTC && /draw only/i.test(r?.notes ?? "");
                  return (
                    <tr key={k} style={{ borderTop: "1px solid var(--border)" }}>
                      <td className="py-1.5 pr-3" style={{ color: "var(--text)" }}>{SEASON_LABELS[k] ?? k}</td>
                      <td className="py-1.5 pr-3" style={{ color: "var(--text-2)" }}>{formatRange(r)}</td>
                      <td className="py-1.5 pr-3" style={{ color: drawRequired ? "var(--danger)" : "var(--success)" }}>
                        {isOTC ? "OTC" : drawRequired ? "Yes" : "—"}
                      </td>
                      <td className="py-1.5" style={{ color: "var(--text-3)" }}>{r?.notes ?? ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="pt-4 mt-2 flex flex-wrap items-center justify-between gap-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="text-xs" style={{ color: "var(--text-3)" }}>
          Data last updated {state.lastUpdated ?? "April 2026"}. Always verify at{" "}
          <a href={state.officialUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--amber)" }}>
            {state.officialUrl.replace(/^https?:\/\//, "")}
          </a>
          .
        </div>
        <div className="flex gap-2">
          <Link
            href={`/states/${state.abbreviation.toLowerCase()}`}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text-2)" }}
          >
            {state.state} profile →
          </Link>
          <Link
            href={`/plan?species=${species.name.toLowerCase().replace(/\s+/g, "_")}`}
            className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ backgroundColor: "var(--amber)", color: "var(--text-inv)" }}
          >
            Build a strategy →
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default function RegulationsClient() {
  const [stateAbbr, setStateAbbr] = useState<string>(allRegulations[0].abbreviation);
  const state = useMemo(
    () => allRegulations.find(s => s.abbreviation === stateAbbr) ?? allRegulations[0],
    [stateAbbr],
  );
  const [speciesName, setSpeciesName] = useState<string>(state.species[0]?.name ?? "");

  // The selected species may not exist in the newly chosen state (e.g. switch
  // CO -> WY when Mule Deer is selected). Derive the effective species rather
  // than syncing in an effect — avoids the setState-in-effect cascade.
  const species = useMemo(
    () => state.species.find(sp => sp.name === speciesName) ?? state.species[0],
    [state, speciesName],
  );
  const effectiveSpeciesName = species?.name ?? "";

  const [side, setSide] = useState<"nr" | "resident">("nr");

  // Re-render countdowns once on mount + once per minute.
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="page-inner">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          State Regulations Lookup
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>
          Application deadlines, fees, draw systems, and OTC availability for non-resident hunters.
        </p>
      </div>

      {/* Controls */}
      <div
        className="rounded-xl p-4 mb-5"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label htmlFor="reg-state" className="text-xs uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
              State
            </label>
            <select
              id="reg-state"
              value={stateAbbr}
              onChange={e => setStateAbbr(e.target.value)}
              className="px-3 py-2 rounded text-sm"
              style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              {allRegulations.map(s => (
                <option key={s.abbreviation} value={s.abbreviation}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label htmlFor="reg-species" className="text-xs uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
              Species
            </label>
            <select
              id="reg-species"
              value={effectiveSpeciesName}
              onChange={e => setSpeciesName(e.target.value)}
              className="px-3 py-2 rounded text-sm"
              style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              {state.species.map(sp => (
                <option key={sp.name} value={sp.name}>
                  {sp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-3)" }}>Show fees as</span>
            <div className="flex">
              {(["nr", "resident"] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSide(s)}
                  className="px-3 py-2 text-xs font-medium uppercase tracking-wider"
                  style={{
                    backgroundColor: side === s ? "var(--amber-glow)" : "var(--bg-elevated)",
                    color: side === s ? "var(--amber)" : "var(--text-2)",
                    border: side === s ? "1px solid var(--amber-glow-strong)" : "1px solid var(--border)",
                    borderRadius: 0,
                    fontFamily: "var(--font-dm-mono), monospace",
                  }}
                >
                  {s === "nr" ? "Non-Resident" : "Resident"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      {species ? (
        <ResultCard state={state} species={species} side={side} now={now} />
      ) : (
        <div className="text-center py-12" style={{ color: "var(--text-2)" }}>
          <p className="text-sm">No regulations data for this state yet.</p>
        </div>
      )}

      <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 32 }}>
        Regulations change. Always verify at the state agency website before applying or buying tags.
      </p>
    </div>
  );
}
