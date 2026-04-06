"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { huntingData, SPECIES_LABELS, SPECIES_EMOJI } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CURRENT_MONTH = new Date().getMonth() + 1;
const CURRENT_YEAR = new Date().getFullYear();

const ALL_SPECIES: SpeciesKey[] = [
  "elk","mule_deer","whitetail","pronghorn","black_bear",
  "bighorn_sheep","mountain_goat","moose","bison","mountain_lion",
];

const METHOD_LABELS: Record<string, string> = {
  any: "Any Method",
  archery: "Archery Only",
  rifle: "Rifle Only",
  muzzleloader: "Muzzleloader",
};

interface OTCEntry {
  stateId: string;
  stateName: string;
  species: SpeciesKey;
  seasonType: string;
  feeNonresident: number;
  feeResident: number;
  appOpenMonth: number;
  appCloseMonth: number;
  appCloseDay: number;
  notes: string;
  difficulty: string;
  isOpenNow: boolean;
  daysToClose: number;
}

export default function OTCPage() {
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesKey | "all">("all");
  const [methodFilter, setMethodFilter] = useState<string>("any");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"fee" | "state" | "closing">("closing");

  const entries = useMemo<OTCEntry[]>(() => {
    const now = new Date();
    const seen = new Set<string>();
    return huntingData
      .filter(d => d.hasOTC)
      .filter(d => speciesFilter === "all" || d.species === speciesFilter)
      .filter(d => methodFilter === "any" || d.seasonType === methodFilter || d.seasonType === "any")
      .filter(d => {
        const key = `${d.stateId}-${d.species}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(d => {
        let year = CURRENT_YEAR;
        let closeDate = new Date(year, d.appCloseMonth - 1, d.appCloseDay);
        if (closeDate < now) {
          year += 1;
          closeDate = new Date(year, d.appCloseMonth - 1, d.appCloseDay);
        }
        const daysToClose = Math.ceil((closeDate.getTime() - now.getTime()) / 86400000);
        const isOpenNow =
          CURRENT_MONTH >= d.appOpenMonth && CURRENT_MONTH <= d.appCloseMonth && daysToClose > 0;
        return {
          stateId: d.stateId,
          stateName: d.stateName,
          species: d.species as SpeciesKey,
          seasonType: d.seasonType,
          feeNonresident: d.feeNonresident,
          feeResident: d.feeResident,
          appOpenMonth: d.appOpenMonth,
          appCloseMonth: d.appCloseMonth,
          appCloseDay: d.appCloseDay,
          notes: d.notes,
          difficulty: d.difficulty,
          isOpenNow,
          daysToClose,
        };
      })
      .filter(d => !showOpenOnly || d.isOpenNow);
  }, [speciesFilter, methodFilter, showOpenOnly]);

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => {
      if (sortBy === "fee") return a.feeNonresident - b.feeNonresident;
      if (sortBy === "state") return a.stateName.localeCompare(b.stateName);
      if (sortBy === "closing") {
        if (a.isOpenNow && !b.isOpenNow) return -1;
        if (!a.isOpenNow && b.isOpenNow) return 1;
        if (a.isOpenNow && b.isOpenNow) return a.daysToClose - b.daysToClose;
        return a.appOpenMonth - b.appOpenMonth;
      }
      return 0;
    });
  }, [entries, sortBy]);

  const openNow = sorted.filter(e => e.isOpenNow);
  const upcoming = sorted.filter(e => !e.isOpenNow);

  return (
    <div className="page">
      <AppNav />
      <div className="page-inner">
      {/* Page title */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>OTC Tag Finder</h1>
        <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>
          Hunt this year — no draw required. Buy a license and go.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Species */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSpeciesFilter("all")}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: speciesFilter === "all" ? "#f59e0b" : "#162016",
              border: speciesFilter === "all" ? "none" : "1px solid #2a3a2a",
              color: speciesFilter === "all" ? "#0f1a0f" : "#c8d8c8",
            }}
          >All Species</button>
          {ALL_SPECIES.filter(s => huntingData.some(d => d.species === s && d.hasOTC)).map(s => (
            <button key={s} onClick={() => setSpeciesFilter(s)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: speciesFilter === s ? "#f59e0b" : "#162016",
                border: speciesFilter === s ? "none" : "1px solid #2a3a2a",
                color: speciesFilter === s ? "#0f1a0f" : "#c8d8c8",
              }}
            >
              {SPECIES_EMOJI[s]} {SPECIES_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-xs" style={{ color: "#8a9e8a" }}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOpenOnly}
            onChange={e => setShowOpenOnly(e.target.checked)}
            className="accent-amber-500"
          />
          <span>Show open now only</span>
        </label>
        <div className="flex items-center gap-2 ml-auto">
          <span>Sort:</span>
          {(["closing","fee","state"] as const).map(k => (
            <button key={k} onClick={() => setSortBy(k)}
              className="px-2 py-1 rounded capitalize"
              style={{
                backgroundColor: sortBy === k ? "#f59e0b22" : "transparent",
                color: sortBy === k ? "#f59e0b" : "#8a9e8a",
                border: sortBy === k ? "1px solid #f59e0b44" : "1px solid transparent",
              }}
            >
              {k === "closing" ? "Availability" : k === "fee" ? "NR Fee" : "State"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "OTC Tags Available", value: entries.length },
          { label: "Open Right Now", value: openNow.length },
          { label: "Lowest NR Fee", value: entries.length ? `$${Math.min(...entries.map(e => e.feeNonresident)).toLocaleString()}` : "—" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center"
            style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
            <div className="text-xl font-bold" style={{ color: "#f59e0b" }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "#8a9e8a" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Open Now */}
      {openNow.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#4ade80" }}>
            ✅ Buy a Tag Right Now ({openNow.length})
          </h2>
          <div className="space-y-3">
            {openNow.map(e => <OTCCard key={`${e.stateId}-${e.species}`} entry={e} open />)}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && !showOpenOnly && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#8a9e8a" }}>
            Coming Up This Season ({upcoming.length})
          </h2>
          <div className="space-y-3">
            {upcoming.map(e => <OTCCard key={`${e.stateId}-${e.species}`} entry={e} open={false} />)}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center py-12" style={{ color: "#8a9e8a" }}>
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm">No OTC tags match your filters.</p>
        </div>
      )}

      <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 32 }}>
        Always verify tag availability and regulations at your state&apos;s official wildlife agency website.
      </p>
      </div>
    </div>
  );
}

function OTCCard({ entry, open }: { entry: OTCEntry; open: boolean }) {
  return (
    <div className="rounded-xl p-4" style={{
      backgroundColor: open ? "#162a16" : "#162016",
      border: open ? "1px solid #2a5a2a" : "1px solid #2a3a2a",
    }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xl">{SPECIES_EMOJI[entry.species]}</span>
            <span className="font-bold text-sm" style={{ color: "#e8f0e8" }}>{entry.stateName}</span>
            <span className="text-sm" style={{ color: "#f59e0b" }}>{SPECIES_LABELS[entry.species]}</span>
            {entry.seasonType !== "any" && (
              <span className="text-xs px-2 py-0.5 rounded capitalize"
                style={{ backgroundColor: "#1a2a1a", color: "#8a9e8a", border: "1px solid #2a3a2a" }}>
                {entry.seasonType}
              </span>
            )}
            {open && (
              <span className="text-xs px-2 py-0.5 rounded font-semibold"
                style={{ backgroundColor: "#1a3a1a", color: "#4ade80", border: "1px solid #2a5a2a" }}>
                OPEN
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-xs mb-2">
            <span style={{ color: "#8a9e8a" }}>
              NR: <span className="font-bold" style={{ color: "#f59e0b" }}>${entry.feeNonresident.toLocaleString()}</span>
            </span>
            <span style={{ color: "#8a9e8a" }}>
              Resident: <span style={{ color: "#c8d8c8" }}>${entry.feeResident.toLocaleString()}</span>
            </span>
            <span style={{ color: "#8a9e8a" }}>
              Window:{" "}
              <span style={{ color: "#c8d8c8" }}>
                {MONTH_NAMES[entry.appOpenMonth - 1]}–{MONTH_NAMES[entry.appCloseMonth - 1]} {entry.appCloseDay}
              </span>
            </span>
            {open && (
              <span style={{ color: "#f87171" }}>
                Closes in <span className="font-bold">{entry.daysToClose}d</span>
              </span>
            )}
          </div>

          <p className="text-xs leading-relaxed" style={{ color: "#6a7e6a" }}>
            {entry.notes.length > 200 ? entry.notes.slice(0, 200) + "…" : entry.notes}
          </p>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0 items-end">
          <Link
            href={`/plan`}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
            style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#c8d8c8" }}
          >
            Add to Plan
          </Link>
          <Link
            href={`/states/${entry.stateId}`}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
            style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#c8d8c8" }}
          >
            State Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
