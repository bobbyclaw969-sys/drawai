"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { huntingData, SPECIES_LABELS, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";
import DataDisclaimer from "@/components/DataDisclaimer";
import DataFreshnessWarning from "@/components/DataFreshnessWarning";

const ALL_SPECIES: SpeciesKey[] = [
  "elk", "mule_deer", "pronghorn", "whitetail",
  "bighorn_sheep", "mountain_goat", "moose", "black_bear", "bison",
];

interface StateOddsRow {
  stateId: string;
  stateName: string;
  species: SpeciesKey;
  pointSystem: string;
  hasOTC: boolean;
  feeNonresident: number;
  difficulty: string;
  // Draw probabilities at each point level
  oddsAtZeroPts: number;
  oddsAt5Pts: number;
  oddsAt10Pts: number;
  oddsAt15Pts: number;
  oddsAt20Pts: number;
}

// Interpolate odds at a specific point level
function getOddsAtPoints(row: StateOddsRow, pts: number): number {
  if (row.pointSystem === 'none' || row.pointSystem === 'otc') {
    return row.oddsAtZeroPts;
  }
  if (pts <= 0) return row.oddsAtZeroPts;
  if (pts <= 5) return row.oddsAtZeroPts + (row.oddsAt5Pts - row.oddsAtZeroPts) * (pts / 5);
  if (pts <= 10) return row.oddsAt5Pts + (row.oddsAt10Pts - row.oddsAt5Pts) * ((pts - 5) / 5);
  if (pts <= 15) return row.oddsAt10Pts + (row.oddsAt15Pts - row.oddsAt10Pts) * ((pts - 10) / 5);
  if (pts <= 20) return row.oddsAt15Pts + (row.oddsAt20Pts - row.oddsAt15Pts) * ((pts - 15) / 5);
  return row.oddsAt20Pts;
}

// Year by year simulation: returns cumulative probability of having drawn by year N
function simulateDrawTimeline(row: StateOddsRow, startingPts: number, years: number): number[] {
  const cumulative: number[] = [];
  let probNotDrawn = 1;
  for (let yr = 1; yr <= years; yr++) {
    const pts = startingPts + (yr - 1); // earn 1 point per year of applying
    const annualOdds = Math.min(getOddsAtPoints(row, pts), 0.99);
    probNotDrawn *= (1 - annualOdds);
    cumulative.push(Math.min(1 - probNotDrawn, 0.999));
  }
  return cumulative;
}

function yearToDrawEstimate(timeline: number[], threshold = 0.5): number | null {
  for (let i = 0; i < timeline.length; i++) {
    if (timeline[i] >= threshold) return i + 1;
  }
  return null;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'var(--success)',
  moderate: 'var(--success)',
  hard: 'var(--amber)',
  very_hard: 'var(--warning)',
  nearly_impossible: 'var(--danger)',
};

const POINT_SYSTEM_LABELS: Record<string, string> = {
  preference: 'Pref.',
  bonus: 'Bonus',
  weighted: 'Weighted',
  none: 'Lottery',
  otc: 'OTC',
  lottery: 'Lottery',
};

export default function OddsPage() {
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesKey>("elk");
  const [myPoints, setMyPoints] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<'state' | 'odds' | 'year50' | 'fee'>('year50');

  const rows: StateOddsRow[] = useMemo(() => {
    const seen = new Set<string>();
    return huntingData
      .filter(d => d.species === selectedSpecies)
      .filter(d => {
        const key = `${d.stateId}-${d.species}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(d => ({
        stateId: d.stateId,
        stateName: d.stateName,
        species: d.species as SpeciesKey,
        pointSystem: d.pointSystem,
        hasOTC: d.hasOTC,
        feeNonresident: d.feeNonresident,
        difficulty: d.difficulty,
        oddsAtZeroPts: d.oddsAtZeroPts,
        oddsAt5Pts: d.oddsAt5Pts,
        oddsAt10Pts: d.oddsAt10Pts,
        oddsAt15Pts: d.oddsAt15Pts,
        oddsAt20Pts: d.oddsAt20Pts,
      }));
  }, [selectedSpecies]);

  const rowsWithTimeline = useMemo(() => {
    return rows.map(r => {
      const pts = myPoints[r.stateId] ?? 0;
      const timeline = simulateDrawTimeline(r, pts, 20);
      const yr50 = yearToDrawEstimate(timeline, 0.5);
      const yr75 = yearToDrawEstimate(timeline, 0.75);
      const currentOdds = getOddsAtPoints(r, pts);
      return { ...r, pts, timeline, yr50, yr75, currentOdds };
    });
  }, [rows, myPoints]);

  const sorted = useMemo(() => {
    return [...rowsWithTimeline].sort((a, b) => {
      if (sortBy === 'state') return a.stateName.localeCompare(b.stateName);
      if (sortBy === 'odds') return b.currentOdds - a.currentOdds;
      if (sortBy === 'fee') return a.feeNonresident - b.feeNonresident;
      if (sortBy === 'year50') {
        const ay = a.yr50 ?? 99;
        const by_ = b.yr50 ?? 99;
        return ay - by_;
      }
      return 0;
    });
  }, [rowsWithTimeline, sortBy]);

  return (
    <div className="page">
      <AppNav />
      <div className="page-inner-wide">
      <DataFreshnessWarning />
      {/* Page title */}
      <DataDisclaimer />
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Draw Odds Calculator</h1>
        <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>
          Enter your points — see your estimated year to draw at 50% and 75% probability.
        </p>
      </div>

      {/* Species selector */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {ALL_SPECIES.map(s => (
          <button
            key={s}
            onClick={() => setSelectedSpecies(s)}
            className={`pill-btn${selectedSpecies === s ? " selected" : ""}`}
            style={{ fontSize: 12, padding: "6px 14px" }}
          >
            {SPECIES_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Sort controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 12, color: "var(--text-3)" }}>
        <span>Sort:</span>
        {([
          { key: "year50", label: "Yr to Draw" },
          { key: "odds",   label: "Odds" },
          { key: "fee",    label: "NR Fee" },
          { key: "state",  label: "State" },
        ] as { key: typeof sortBy; label: string }[]).map(opt => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: sortBy === opt.key ? 700 : 500,
              background: sortBy === opt.key ? "var(--amber-glow)" : "transparent",
              color: sortBy === opt.key ? "var(--amber)" : "var(--text-3)",
              border: sortBy === opt.key ? "1px solid var(--amber-glow-strong)" : "1px solid transparent",
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map(row => {
          const barWidth = Math.min(row.currentOdds * 100, 100);
          const noPoints = row.pointSystem === "none" || row.pointSystem === "otc";
          const diffColor = DIFFICULTY_COLORS[row.difficulty] ?? "var(--amber)";

          return (
            <div key={`${row.stateId}-${row.species}`} className="card" style={{ padding: 16 }}>
              {/* Header */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>{row.stateName}</span>
                <span className="badge badge-muted">{POINT_SYSTEM_LABELS[row.pointSystem]}</span>
                {row.hasOTC && <span className="badge badge-green">OTC</span>}
                <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: "var(--amber)" }}>
                  NR ${row.feeNonresident.toLocaleString()}
                </span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
                {/* Points stepper */}
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>My Points</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button
                      onClick={() => setMyPoints(p => ({ ...p, [row.stateId]: Math.max(0, (p[row.stateId] ?? 0) - 1) }))}
                      disabled={noPoints}
                      style={{ width: 26, height: 26, borderRadius: 6, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, fontWeight: 700, cursor: noPoints ? "not-allowed" : "pointer", opacity: noPoints ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >−</button>
                    <span style={{ minWidth: 28, textAlign: "center", fontWeight: 800, fontSize: 15, color: noPoints ? "var(--text-3)" : "var(--text)" }}>
                      {noPoints ? "—" : (myPoints[row.stateId] ?? 0)}
                    </span>
                    <button
                      onClick={() => setMyPoints(p => ({ ...p, [row.stateId]: (p[row.stateId] ?? 0) + 1 }))}
                      disabled={noPoints}
                      style={{ width: 26, height: 26, borderRadius: 6, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, fontWeight: 700, cursor: noPoints ? "not-allowed" : "pointer", opacity: noPoints ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >+</button>
                  </div>
                </div>

                {/* Odds bar */}
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 11 }}>This Year</span>
                    <span style={{ color: diffColor, fontWeight: 800 }}>{Math.round(row.currentOdds * 100)}%</span>
                  </div>
                  <div className="odds-bar-track">
                    <div className="odds-bar-fill" style={{ width: `${barWidth}%`, background: diffColor }} />
                  </div>
                </div>

                {/* Draw estimates */}
                <div style={{ display: "flex", gap: 16, textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>50% by yr</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: row.yr50 ? (row.yr50 <= 3 ? "var(--success)" : row.yr50 <= 7 ? "var(--amber)" : "var(--danger)") : "var(--text-3)" }}>
                      {row.yr50 ? `${row.yr50}` : "20+"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>75% by yr</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "var(--text-2)" }}>
                      {row.yr75 ? `${row.yr75}` : "20+"}
                    </div>
                  </div>
                </div>
              </div>

              {/* 20-year timeline bar */}
              {!noPoints && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {row.timeline.map((prob, i) => {
                      const prev = i === 0 ? 0 : row.timeline[i - 1];
                      const intensity = Math.min((prob - prev) * 8, 1);
                      return (
                        <div
                          key={i}
                          title={`Year ${i + 1}: ${Math.round(prob * 100)}% cumulative`}
                          style={{
                            flex: 1,
                            height: 5,
                            borderRadius: 2,
                            background: prob >= 0.5
                              ? `var(--success-border)`
                              : `var(--amber-glow-strong)`,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-3)", marginTop: 4 }}>
                    <span>Yr 1</span><span>Yr 20</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="card" style={{ padding: 16, marginTop: 32 }}>
        <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--text-2)" }}>How this works:</strong> Draw probability is estimated based on historic odds at each point level.
          The timeline assumes you gain 1 point per year of applying. Actual results vary by unit, tag type, and annual quota changes.
          Always verify current odds and deadlines at your state&apos;s official wildlife agency website.
        </p>
      </div>
      </div>
    </div>
  );
}
