"use client";

/**
 * Multi-state preference-point portfolio optimizer.
 *
 * Hunter inputs current point balances + budget + horizon → we run pure
 * math against the full hunting dataset and recommend a portfolio split
 * into "apply this year", "build points", and "skip".
 *
 * This is the defensive moat feature: TINE / DHG / GoHUNT can't replicate
 * this without years of regulatory data ingestion across all 25+ states.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { huntingData, SPECIES_LABELS, ALL_STATES, STATE_NAMES } from "@/lib/huntingData";
import { runOptimizer, type OptimizerPick } from "@/lib/portfolio";
import type { SpeciesKey } from "@/lib/types";
import { track } from "@/lib/posthog";

const SOIL = "#0F0D0A";
const BARK = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const GLOW = "#F0A040";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";
const SUCCESS = "#3DA86A";
const WARNING = "#D4A12A";

const POINTS_STORAGE = "taghunter_optimizer_points";

const ALL_SPECIES: SpeciesKey[] = [
  "elk", "mule_deer", "whitetail", "pronghorn",
  "bighorn_sheep", "mountain_goat", "moose", "black_bear", "bison",
];

const SPECIES_FOR_POINTS: SpeciesKey[] = [
  "elk", "mule_deer", "pronghorn", "bighorn_sheep", "mountain_goat", "moose",
];

// States with meaningful point systems for the input grid
const POINT_STATES = ["co", "wy", "nm", "az", "ut", "nv", "or", "mt"];

const mono: React.CSSProperties = { fontFamily: "var(--font-dm-mono), monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-display), Georgia, serif" };

export default function OptimizerPage() {
  const [points, setPoints] = useState<Record<string, number>>({});
  const [residency, setResidency] = useState("CA");
  const [budget, setBudget] = useState(1500);
  const [horizonYears, setHorizonYears] = useState(10);
  const [speciesSelected, setSpeciesSelected] = useState<SpeciesKey[]>([
    "elk", "mule_deer", "pronghorn",
  ]);
  const [goal, setGoal] = useState<"hunt_often" | "balance" | "one_trophy">("balance");
  const [computed, setComputed] = useState(false);
  const inputsStartedRef = useRef(false);

  // Fire optimizer_viewed once per mount.
  useEffect(() => {
    track("optimizer_viewed", {
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });
  }, []);

  // Restore persisted inputs
  useEffect(() => {
    try {
      const raw = localStorage.getItem(POINTS_STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, number>;
        // Reading persisted state on mount is the documented Next.js pattern
        // for SSR-safe hydration of client-only state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed && typeof parsed === "object") setPoints(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // Persist inputs as they change
  useEffect(() => {
    try { localStorage.setItem(POINTS_STORAGE, JSON.stringify(points)); } catch { /* ignore */ }
  }, [points]);

  /** Fire optimizer_inputs_started at most once per page load. */
  const noteInputChange = (field_name: string) => {
    if (inputsStartedRef.current) return;
    inputsStartedRef.current = true;
    track("optimizer_inputs_started", { field_name });
  };

  const result = useMemo(
    () => runOptimizer(huntingData, {
      points,
      residency,
      budget,
      horizonYears,
      speciesFilter: speciesSelected.length > 0 ? speciesSelected : undefined,
      goal,
    }),
    [points, residency, budget, horizonYears, speciesSelected, goal],
  );

  const setPointFor = (stateId: string, species: SpeciesKey, n: number) => {
    noteInputChange("points");
    const key = `${stateId.toLowerCase()}:${species}`;
    setPoints(prev => {
      const next = { ...prev };
      if (!n) delete next[key];
      else next[key] = n;
      return next;
    });
  };

  const toggleSpecies = (s: SpeciesKey) => {
    noteInputChange("species");
    setSpeciesSelected(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s],
    );
  };

  const compute = () => {
    setComputed(true);
    track("optimizer_run_clicked", {
      points_count: Object.keys(points).length,
      budget,
      state_count: Object.keys(points).reduce((acc, k) => {
        const state = k.split(":")[0];
        return acc.includes(state) ? acc : [...acc, state];
      }, [] as string[]).length,
      species: speciesSelected,
      years_horizon: horizonYears,
      goal,
    });

    // Re-run the solver against the same dataset for timing — useMemo
    // ran during render and we want a clean wall-clock figure for the
    // results_returned event, plus an error path if the solver throws.
    const t0 = (typeof performance !== "undefined" ? performance : Date).now();
    try {
      const fresh = runOptimizer(huntingData, {
        points,
        residency,
        budget,
        horizonYears,
        speciesFilter: speciesSelected.length > 0 ? speciesSelected : undefined,
        goal,
      });
      const runtime_ms =
        Math.round(((typeof performance !== "undefined" ? performance : Date).now() - t0) * 100) /
        100;

      if (fresh.picks.length === 0) {
        track("optimizer_error", {
          error_type: "no_results",
          error_message: "Solver returned zero candidate picks",
        });
        return;
      }

      track("optimizer_results_returned", {
        runtime_ms,
        result_count: fresh.picks.length,
        apply_count: fresh.applyNow.length,
        build_count: fresh.buildPoints.length,
        total_ev: Math.round(fresh.totalExpectedValue),
        annual_spend: fresh.annualSpend,
      });
    } catch (err) {
      track("optimizer_error", {
        error_type: "exception",
        error_message: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const onResultClick = (pick: OptimizerPick, rank: number, bucket: "apply" | "build" | "skip") => {
    track("optimizer_result_clicked", {
      rank,
      bucket,
      state: pick.stateId,
      species: pick.species,
      year_one_odds: Math.round(pick.yearOneOdds * 1000) / 1000,
      ev_value: Math.round(pick.expectedValue),
    });
  };

  return (
    <div style={{ background: SOIL, color: BONE, minHeight: "100vh", ...mono }}>
      <AppNav />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 96px" }}>
        <header style={{ marginBottom: 40 }}>
          <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
            Multi-state portfolio optimizer
          </p>
          <h1 style={{
            ...display,
            fontWeight: 900,
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: BONE,
            marginBottom: 12,
          }}>
            Your points.<br />Your budget.<br />The optimal split.
          </h1>
          <p style={{ color: DUST, fontSize: 15, lineHeight: 1.6, maxWidth: 640 }}>
            Plug in your current preference points across all the states you&apos;ve been
            applying in. We&apos;ll run the math against {horizonYears} years of draw odds
            and tell you exactly where to spend this year&apos;s ${budget.toLocaleString()}.
          </p>
        </header>

        {/* ── INPUTS ────────────────────────────────────────────────── */}
        <section style={{ background: BARK, border: `1px solid ${FENCE}`, padding: 28, marginBottom: 32 }}>
          <h2 style={{ ...mono, fontSize: 13, letterSpacing: "0.16em", color: AMBER, textTransform: "uppercase", marginBottom: 24 }}>
            1. Your setup
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 28 }}>
            <FieldBlock label="Residency">
              <select
                value={residency}
                onChange={e => { noteInputChange("residency"); setResidency(e.target.value); }}
                style={selectStyle}
              >
                {ALL_STATES.map(s => (
                  <option key={s} value={s}>{STATE_NAMES[s]} ({s})</option>
                ))}
              </select>
            </FieldBlock>
            <FieldBlock label="Annual budget">
              <input
                type="number"
                min={0}
                max={20000}
                step={100}
                value={budget}
                onChange={e => { noteInputChange("budget"); setBudget(Math.max(0, Number(e.target.value) || 0)); }}
                style={inputStyle}
              />
            </FieldBlock>
            <FieldBlock label="Planning horizon">
              <select
                value={horizonYears}
                onChange={e => { noteInputChange("horizon_years"); setHorizonYears(Number(e.target.value)); }}
                style={selectStyle}
              >
                <option value={5}>5 years</option>
                <option value={10}>10 years</option>
                <option value={15}>15 years</option>
                <option value={20}>20 years</option>
              </select>
            </FieldBlock>
            <FieldBlock label="Goal">
              <select
                value={goal}
                onChange={e => { noteInputChange("goal"); setGoal(e.target.value as typeof goal); }}
                style={selectStyle}
              >
                <option value="hunt_often">Hunt often</option>
                <option value="balance">Balance</option>
                <option value="one_trophy">One trophy</option>
              </select>
            </FieldBlock>
          </div>

          <h3 style={{ ...mono, fontSize: 11, letterSpacing: "0.16em", color: DUST, textTransform: "uppercase", marginBottom: 14 }}>
            Species I care about
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {ALL_SPECIES.map(s => {
              const sel = speciesSelected.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSpecies(s)}
                  style={{
                    background: sel ? AMBER : "transparent",
                    color: sel ? SOIL : BONE,
                    border: `1px solid ${sel ? AMBER : FENCE}`,
                    padding: "8px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                    borderRadius: 0,
                    ...mono,
                  }}
                >
                  {SPECIES_LABELS[s]}
                </button>
              );
            })}
          </div>

          <h3 style={{ ...mono, fontSize: 11, letterSpacing: "0.16em", color: DUST, textTransform: "uppercase", marginBottom: 14 }}>
            Your current points (leave blank if 0)
          </h3>
          <div style={{ overflowX: "auto", marginBottom: 24 }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 600, fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={th}>State</th>
                  {SPECIES_FOR_POINTS.map(sp => (
                    <th key={sp} style={th}>{SPECIES_LABELS[sp]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {POINT_STATES.map(stateId => (
                  <tr key={stateId}>
                    <td style={{ ...td, color: BONE, fontWeight: 500 }}>{STATE_NAMES[stateId.toUpperCase()]}</td>
                    {SPECIES_FOR_POINTS.map(sp => {
                      const key = `${stateId}:${sp}`;
                      const val = points[key] ?? 0;
                      return (
                        <td key={sp} style={td}>
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={val === 0 ? "" : val}
                            onChange={e => setPointFor(stateId, sp, Math.max(0, Number(e.target.value) || 0))}
                            placeholder="0"
                            style={pointInputStyle}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={compute}
            style={{
              background: AMBER,
              color: SOIL,
              border: "none",
              padding: "14px 28px",
              ...mono,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.04em",
              cursor: "pointer",
              borderRadius: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = GLOW)}
            onMouseLeave={e => (e.currentTarget.style.background = AMBER)}
          >
            Run the optimizer →
          </button>
        </section>

        {/* ── RESULTS ──────────────────────────────────────────────── */}
        {computed && (
          <>
            <SectionHeader number="2" title="Apply this year" subtitle={`${result.applyNow.length} pick(s) · $${result.annualSpend.toLocaleString()} of $${budget.toLocaleString()} budget`} />
            {result.applyNow.length === 0 ? (
              <EmptyHint>
                Nothing pencils out at this year&apos;s odds within your $${budget.toLocaleString()} budget. Move to <strong>Build points</strong> below — the long game is where the EV is.
              </EmptyHint>
            ) : (
              <ResultGrid picks={result.applyNow} accent={SUCCESS} bucket="apply" onClick={onResultClick} />
            )}

            <div style={{ height: 32 }} />

            <SectionHeader number="3" title="Build points" subtitle={`${result.buildPoints.length} high-EV opportunities locked behind a point gap`} />
            {result.buildPoints.length === 0 ? (
              <EmptyHint>
                No long-term picks surfaced. Try broadening species selection or extending the horizon to 15+ years.
              </EmptyHint>
            ) : (
              <ResultGrid picks={result.buildPoints.slice(0, 8)} accent={WARNING} bucket="build" onClick={onResultClick} />
            )}

            <div style={{ height: 32 }} />

            <SectionHeader number="4" title="Skip" subtitle={`${result.skip.length} states where the math doesn't pencil`} />
            {result.skip.length > 0 && (
              <details style={{ background: BARK, border: `1px solid ${FENCE}`, padding: 16 }}>
                <summary style={{ color: DUST, fontSize: 13, cursor: "pointer", ...mono }}>
                  Show {result.skip.length} skipped pick(s)
                </summary>
                <div style={{ marginTop: 16 }}>
                  <ResultGrid picks={result.skip.slice(0, 12)} accent={DUST} compact bucket="skip" onClick={onResultClick} />
                </div>
              </details>
            )}

            <div style={{
              marginTop: 48,
              padding: 20,
              background: BARK,
              border: `1px solid ${FENCE}`,
              ...mono,
              fontSize: 12,
              color: DUST,
              lineHeight: 1.7,
            }}>
              <strong style={{ color: BONE }}>How this works.</strong> The optimizer interpolates
              draw odds at your current point balance plus point velocity (+1/yr for
              preference states), projects cumulative draw probability over your{" "}
              {horizonYears}-year horizon, scores each (state, species) by EV/$,
              then greedily packs the highest-scoring picks into your budget. Trophy hunts
              count more in &quot;one trophy&quot; goal; common hunts count more in &quot;hunt often&quot;.
              Data is from the same verified per-state regulations the rest of Tag Hunter uses.
              Skipped picks aren&apos;t bad — they just don&apos;t beat your other options for this year&apos;s dollars.
            </div>

            <div style={{ marginTop: 28, fontSize: 13, color: DUST }}>
              Want to dig deeper? <Link href="/find" style={{ color: AMBER }}>Run AI Find →</Link>
              <span style={{ margin: "0 12px" }}>·</span>
              <Link href="/plan" style={{ color: AMBER }}>Build a multi-year plan →</Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ ...mono, fontSize: 11, letterSpacing: "0.12em", color: DUST, textTransform: "uppercase", marginBottom: 8, display: "block" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ color: AMBER, fontSize: 14, ...mono, fontWeight: 700 }}>{number}.</span>
        <h2 style={{ ...display, fontWeight: 900, fontSize: 24, color: BONE, margin: 0 }}>{title}</h2>
      </div>
      <p style={{ ...mono, color: DUST, fontSize: 12 }}>{subtitle}</p>
    </div>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: BARK, border: `1px solid ${FENCE}`, padding: 20, color: DUST, fontSize: 14, lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

function ResultGrid({
  picks,
  accent,
  compact,
  bucket,
  onClick,
}: {
  picks: OptimizerPick[];
  accent: string;
  compact?: boolean;
  bucket: "apply" | "build" | "skip";
  onClick: (pick: OptimizerPick, rank: number, bucket: "apply" | "build" | "skip") => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr 1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
      {picks.map((p, i) => (
        <Link
          key={p.key}
          href={`/states/${p.stateId.toLowerCase()}`}
          onClick={() => onClick(p, i, bucket)}
          style={{
            background: BARK,
            border: `1px solid ${FENCE}`,
            borderLeft: `3px solid ${accent}`,
            padding: 18,
            textDecoration: "none",
            color: "inherit",
            display: "block",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = AMBER)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = FENCE)}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ ...display, fontSize: 18, fontWeight: 700, color: BONE }}>
              {p.stateName}
            </span>
            <span style={{ ...mono, fontSize: 11, color: DUST, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {p.seasonType}
            </span>
          </div>
          <div style={{ ...mono, fontSize: 14, color: AMBER, marginBottom: 12 }}>
            {SPECIES_LABELS[p.species]}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 }}>
            <Stat label="Yr-1 odds" value={`${Math.round(p.yearOneOdds * 100)}%`} />
            <Stat label={`${Math.ceil(p.expectedYearsToDraw)}-yr draw`} value={`${Math.round(p.cumulativeDrawProb * 100)}%`} />
            <Stat label="Cost/yr" value={`$${p.annualCost}`} />
          </div>
          <p style={{ ...mono, fontSize: 12, color: DUST, lineHeight: 1.5, marginBottom: 0 }}>
            {p.rationale} <span style={{ color: BONE }}>· {p.currentPoints} pts held</span>
          </p>
        </Link>
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ ...mono, fontSize: 10, color: DUST, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ ...mono, fontSize: 16, fontWeight: 600, color: BONE }}>{value}</div>
    </div>
  );
}

// ── Shared styles ────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  background: SOIL,
  border: `1px solid ${FENCE}`,
  color: BONE,
  ...mono,
  fontSize: 14,
  padding: "10px 14px",
  height: 44,
  width: "100%",
  borderRadius: 0,
  outline: "none",
};

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer", appearance: "none" };

const pointInputStyle: React.CSSProperties = {
  background: SOIL,
  border: `1px solid ${FENCE}`,
  color: BONE,
  ...mono,
  fontSize: 13,
  padding: "6px 8px",
  width: 56,
  textAlign: "center",
  borderRadius: 0,
  outline: "none",
};

const th: React.CSSProperties = {
  ...mono,
  fontSize: 10,
  color: DUST,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: `1px solid ${FENCE}`,
};

const td: React.CSSProperties = {
  padding: "10px 10px",
  borderBottom: `1px solid ${FENCE}`,
  textAlign: "left",
};
