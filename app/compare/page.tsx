"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { huntingData, SPECIES_LABELS, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";
import DataDisclaimer from "@/components/DataDisclaimer";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const ALL_SPECIES: SpeciesKey[] = [
  "elk","mule_deer","pronghorn","whitetail","black_bear",
  "bighorn_sheep","mountain_goat","moose","bison",
];

const POINT_SYSTEM_LABELS: Record<string, string> = {
  preference: "Preference",
  bonus: "Bonus",
  weighted: "Weighted",
  none: "Random Lottery",
  otc: "OTC",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#4ade80",
  moderate: "#86efac",
  hard: "#f59e0b",
  very_hard: "#f97316",
  nearly_impossible: "#f87171",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
  very_hard: "Very Hard",
  nearly_impossible: "Bucket List",
};

export default function ComparePage() {
  const [species, setSpecies] = useState<SpeciesKey>("elk");
  const [stateA, setStateA] = useState<string>("wy");
  const [stateB, setStateB] = useState<string>("co");
  const [stateC, setStateC] = useState<string>("");

  const availableStates = useMemo(() => {
    const ids = [...new Set(huntingData.filter(d => d.species === species).map(d => d.stateId))];
    return ids.sort((a, b) => (STATE_NAMES[a.toUpperCase()] ?? a).localeCompare(STATE_NAMES[b.toUpperCase()] ?? b));
  }, [species]);

  const getEntry = (stateId: string) =>
    huntingData.find(d => d.stateId === stateId && d.species === species);

  const entryA = getEntry(stateA);
  const entryB = getEntry(stateB);
  const entryC = stateC ? getEntry(stateC) : undefined;

  const columns = [entryA, entryB, entryC].filter(Boolean) as typeof entryA[];

  // Reset states when species changes
  const handleSpeciesChange = (s: SpeciesKey) => {
    setSpecies(s);
    const ids = [...new Set(huntingData.filter(d => d.species === s).map(d => d.stateId))];
    setStateA(ids[0] ?? "");
    setStateB(ids[1] ?? "");
    setStateC("");
  };

  const rows: { label: string; values: (e: NonNullable<typeof entryA>) => React.ReactNode }[] = [
    {
      label: "NR Tag Fee",
      values: e => <span className="font-bold" style={{ color: "#f59e0b" }}>${e.feeNonresident.toLocaleString()}</span>,
    },
    {
      label: "Resident Fee",
      values: e => <span style={{ color: "#c8d8c8" }}>${e.feeResident.toLocaleString()}</span>,
    },
    {
      label: "Point System",
      values: e => <span style={{ color: "#c8d8c8" }}>{POINT_SYSTEM_LABELS[e.pointSystem] ?? e.pointSystem}</span>,
    },
    {
      label: "OTC Available",
      values: e => <span style={{ color: e.hasOTC ? "#4ade80" : "#f87171" }}>{e.hasOTC ? "Yes ✓" : "Draw only"}</span>,
    },
    {
      label: "Difficulty",
      values: e => <span style={{ color: DIFFICULTY_COLORS[e.difficulty] ?? "#e8f0e8" }}>{DIFFICULTY_LABELS[e.difficulty] ?? e.difficulty}</span>,
    },
    {
      label: "NR Quota",
      values: e => <span style={{ color: "#c8d8c8" }}>{e.nrQuotaPct}%</span>,
    },
    {
      label: "App Window",
      values: e => <span style={{ color: "#c8d8c8" }}>{MONTH_NAMES[e.appOpenMonth - 1]} – {MONTH_NAMES[e.appCloseMonth - 1]} {e.appCloseDay}</span>,
    },
    {
      label: "Odds @ 0 pts",
      values: e => <OddsBar value={e.oddsAtZeroPts} />,
    },
    {
      label: "Odds @ 5 pts",
      values: e => <OddsBar value={e.oddsAt5Pts} />,
    },
    {
      label: "Odds @ 10 pts",
      values: e => <OddsBar value={e.oddsAt10Pts} />,
    },
    {
      label: "Odds @ 15 pts",
      values: e => <OddsBar value={e.oddsAt15Pts} />,
    },
    {
      label: "Odds @ 20 pts",
      values: e => <OddsBar value={e.oddsAt20Pts} />,
    },
    {
      label: "Max Pts Est.",
      values: e => <span style={{ color: "#c8d8c8" }}>{e.maxPointsEst > 0 ? `~${e.maxPointsEst}` : "N/A"}</span>,
    },
  ];

  return (
    <div className="page">
      <AppNav />
      <div className="page-inner-wide">
      <DataDisclaimer />
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Compare States</h1>
        <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>Side-by-side odds, fees, and draw system comparison</p>
      </div>

      {/* Species selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_SPECIES.filter(s => huntingData.some(d => d.species === s)).map(s => (
          <button key={s} onClick={() => handleSpeciesChange(s)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: species === s ? "#f59e0b" : "#162016",
              border: species === s ? "none" : "1px solid #2a3a2a",
              color: species === s ? "#0f1a0f" : "#c8d8c8",
            }}>
            {SPECIES_LABELS[s]}
          </button>
        ))}
      </div>

      {/* State selectors */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: "State A", value: stateA, set: setStateA },
          { label: "State B", value: stateB, set: setStateB },
          { label: "State C (optional)", value: stateC, set: setStateC },
        ].map(col => (
          <div key={col.label}>
            <label className="text-xs block mb-1" style={{ color: "#8a9e8a" }}>{col.label}</label>
            <select
              value={col.value}
              onChange={e => col.set(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#e8f0e8" }}
            >
              {col.label.includes("optional") && <option value="">None</option>}
              {availableStates.map(id => (
                <option key={id} value={id}>{STATE_NAMES[id.toUpperCase()] ?? id.toUpperCase()}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      {columns.length >= 2 && (
        <div className="compare-scroll mb-6">
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #2a3a2a" }}>
          {/* Column headers */}
          <div className="grid gap-0" style={{
            gridTemplateColumns: `200px repeat(${columns.length}, 1fr)`,
            backgroundColor: "#162016",
            borderBottom: "1px solid #2a3a2a",
          }}>
            <div className="p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6a7e6a" }}>
              Metric
            </div>
            {columns.map((e, i) => (
              <div key={i} className="p-4 text-center border-l" style={{ borderColor: "#2a3a2a" }}>
                <div className="font-bold text-sm" style={{ color: "#f59e0b" }}>{e!.stateName}</div>
                <div className="text-xs mt-0.5" style={{ color: "#6a7e6a" }}>
                  {SPECIES_LABELS[e!.species as SpeciesKey]}
                </div>
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, ri) => (
            <div key={ri} className="grid" style={{
              gridTemplateColumns: `200px repeat(${columns.length}, 1fr)`,
              backgroundColor: ri % 2 === 0 ? "#0f1a0f" : "#162016",
              borderBottom: ri < rows.length - 1 ? "1px solid #1a2a1a" : "none",
            }}>
              <div className="p-3 text-xs font-medium" style={{ color: "#8a9e8a" }}>
                {row.label}
              </div>
              {columns.map((e, ci) => (
                <div key={ci} className="p-3 text-center text-xs border-l flex items-center justify-center"
                  style={{ borderColor: "#1a2a1a" }}>
                  {row.values(e!)}
                </div>
              ))}
            </div>
          ))}
        </div>
        </div>
      )}

      {/* Notes comparison */}
      {columns.length >= 2 && (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
          {columns.map((e, i) => (
            <div key={i} className="rounded-xl p-4" style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
              <h3 className="font-semibold text-sm mb-2" style={{ color: "#f59e0b" }}>{e!.stateName} Notes</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#8a9e8a" }}>{e!.notes}</p>
              <Link href={`/states/${e!.stateId}`}
                className="text-xs mt-3 block" style={{ color: "#f59e0b" }}>
                Full state profile →
              </Link>
            </div>
          ))}
        </div>
      )}

      {columns.length < 2 && (
        <div className="text-center py-12" style={{ color: "#8a9e8a" }}>
          <p className="text-sm">Select at least two states above to compare.</p>
        </div>
      )}

      <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 32 }}>
        Fees and odds are estimates. Always verify at your state&apos;s official wildlife agency.
      </p>
      </div>
    </div>
  );
}

function OddsBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = value >= 0.7 ? "#4ade80" : value >= 0.4 ? "#f59e0b" : value >= 0.15 ? "#f97316" : "#f87171";
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#2a3a2a" }}>
        <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-xs w-8 text-right" style={{ color }}>{pct}%</span>
    </div>
  );
}
