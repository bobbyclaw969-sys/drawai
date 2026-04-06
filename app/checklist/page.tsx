"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { huntingData, SPECIES_LABELS, SPECIES_EMOJI, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";
import { loadTracker, loadManualPoints, getMergedPoints, CURRENT_YEAR } from "@/lib/tracker";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CHECKLIST_KEY = "taghunter_checklist";

interface ChecklistItem {
  id: string;
  stateId: string;
  stateName: string;
  species: SpeciesKey;
  seasonType: string;
  closeMonth: number;
  closeDay: number;
  feeNonresident: number;
  hasOTC: boolean;
  pointSystem: string;
  myPoints: number;
  daysUntil: number;
  checked: boolean;
  custom: boolean;
  notes: string;
}

function getDaysUntil(month: number, day: number): number {
  const now = new Date();
  let year = now.getFullYear();
  let d = new Date(year, month - 1, day);
  if (d < now) { year += 1; d = new Date(year, month - 1, day); }
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

function loadChecked(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CHECKLIST_KEY) ?? "{}") as Record<string, boolean>;
  } catch { return {}; }
}

function saveChecked(checked: Record<string, boolean>) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checked));
  }
}

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);

  const buildChecklist = useCallback(() => {
    const { applications } = loadTracker();
    const manual = loadManualPoints();
    const merged = getMergedPoints(applications, manual);
    const savedChecked = loadChecked();

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Find what's already been applied for this year
    const appliedThisYear = new Set(
      applications
        .filter(a => a.year === CURRENT_YEAR)
        .map(a => `${a.stateId}-${a.species}`)
    );

    const seen = new Set<string>();
    const result: ChecklistItem[] = [];

    for (const d of huntingData) {
      const key = `${d.stateId}-${d.species}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const daysUntil = getDaysUntil(d.appCloseMonth, d.appCloseDay);
      if (daysUntil > 365) continue; // Skip if more than a year out

      // Only show windows that haven't passed this year
      let closeDate = new Date(currentYear, d.appCloseMonth - 1, d.appCloseDay);
      if (closeDate < now) continue; // already passed this year, skip

      const myPoints = merged[d.stateId]?.[d.species as SpeciesKey] ?? 0;
      const isAlreadyApplied = appliedThisYear.has(key);

      result.push({
        id: key,
        stateId: d.stateId,
        stateName: d.stateName,
        species: d.species as SpeciesKey,
        seasonType: d.seasonType,
        closeMonth: d.appCloseMonth,
        closeDay: d.appCloseDay,
        feeNonresident: d.feeNonresident,
        hasOTC: d.hasOTC,
        pointSystem: d.pointSystem,
        myPoints,
        daysUntil,
        checked: isAlreadyApplied || (savedChecked[key] ?? false),
        custom: false,
        notes: isAlreadyApplied ? "Logged in tracker" : "",
      });
    }

    result.sort((a, b) => a.daysUntil - b.daysUntil);
    setItems(result);
    setChecked(savedChecked);
  }, []);

  useEffect(() => { buildChecklist(); }, [buildChecklist]);

  const toggleCheck = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    saveChecked(next);
    setItems(prev => prev.map(it => it.id === id ? { ...it, checked: !it.checked } : it));
  };

  const pending = items.filter(it => !it.checked);
  const done = items.filter(it => it.checked);
  const totalPending = pending.reduce((s, it) => s + it.feeNonresident, 0);
  const displayed = showAll ? items : items.filter(it => !it.checked || it.notes === "Logged in tracker");

  const urgentCount = pending.filter(it => it.daysUntil <= 30).length;

  return (
    <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold" style={{ color: "#f59e0b" }}>🎯 Tag Hunter</Link>
          <span style={{ color: "#2a3a2a" }}>|</span>
          <span className="text-base font-semibold" style={{ color: "#e8f0e8" }}>{CURRENT_YEAR} Checklist</span>
        </div>
        <Link href="/tracker" className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#c8d8c8" }}>
          My Tracker →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Still Pending", value: pending.length, color: urgentCount > 0 ? "#f87171" : "#f59e0b" },
          { label: "Urgent (<30d)", value: urgentCount, color: urgentCount > 0 ? "#f87171" : "#4a5a4a" },
          { label: "Pending Fees", value: `$${totalPending.toLocaleString()}`, color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center"
            style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "#8a9e8a" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {urgentCount > 0 && (
        <div className="rounded-xl p-4 mb-5 flex items-center gap-3"
          style={{ backgroundColor: "#2a1010", border: "1px solid #5a1010" }}>
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-semibold" style={{ color: "#f87171" }}>
            {urgentCount} application{urgentCount > 1 ? "s" : ""} closing within 30 days
          </p>
        </div>
      )}

      {/* Note about checklist */}
      <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
        <p className="text-xs" style={{ color: "#6a7e6a" }}>
          This checklist shows every upcoming {CURRENT_YEAR} application window.
          Check off what you&apos;ve applied for — or log it in the <Link href="/tracker" style={{ color: "#f59e0b" }}>Application Tracker</Link> for full record keeping.
          Your points from the tracker are shown next to each entry.
        </p>
      </div>

      {/* Pending items */}
      {pending.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#f59e0b" }}>
            Still To Do ({pending.length})
          </h2>
          <div className="space-y-2">
            {pending.map(item => (
              <ChecklistCard key={item.id} item={item} onToggle={() => toggleCheck(item.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {done.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowAll(v => !v)}
            className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
            style={{ color: "#4ade80" }}
          >
            ✅ Applied ({done.length}) {showAll ? "▲" : "▼"}
          </button>
          {showAll && (
            <div className="space-y-2">
              {done.map(item => (
                <ChecklistCard key={item.id} item={item} onToggle={() => toggleCheck(item.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-16" style={{ color: "#8a9e8a" }}>
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm">No applications to show for {CURRENT_YEAR}.</p>
          <p className="text-xs mt-2" style={{ color: "#4a5a4a" }}>
            All current-year windows may have passed.
          </p>
        </div>
      )}

      <footer className="text-center text-xs mt-8 pb-6" style={{ color: "#4a5a4a" }}>
        Always verify deadlines at your state&apos;s official wildlife agency website before applying.
      </footer>
    </main>
  );
}

function ChecklistCard({ item, onToggle }: { item: ChecklistItem; onToggle: () => void }) {
  const urgent = item.daysUntil <= 14;
  const soonish = item.daysUntil <= 30;

  return (
    <div
      className="rounded-xl p-4 flex items-center gap-3 transition-all"
      style={{
        backgroundColor: item.checked ? "#121e12" : "#162016",
        border: `1px solid ${item.checked ? "#1a2a1a" : urgent ? "#5a2020" : "#2a3a2a"}`,
        opacity: item.checked ? 0.6 : 1,
      }}
    >
      <button
        onClick={onToggle}
        className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center text-sm transition-all"
        style={{
          backgroundColor: item.checked ? "#1a3a1a" : "#1a2a1a",
          border: item.checked ? "2px solid #4ade80" : "2px solid #2a3a2a",
          color: item.checked ? "#4ade80" : "transparent",
        }}
      >
        {item.checked ? "✓" : ""}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="text-lg">{SPECIES_EMOJI[item.species]}</span>
          <span className="font-bold text-sm" style={{ color: item.checked ? "#4a5a4a" : "#e8f0e8" }}>
            {item.stateName}
          </span>
          <span className="text-sm" style={{ color: item.checked ? "#4a5a4a" : "#f59e0b" }}>
            {SPECIES_LABELS[item.species]}
          </span>
          {item.hasOTC && (
            <span className="text-xs px-1.5 py-0.5 rounded"
              style={{ backgroundColor: "#1a3a1a", color: "#4ade80", border: "1px solid #2a5a2a" }}>
              OTC
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs" style={{ color: "#6a7e6a" }}>
          <span>Closes {MONTH_NAMES[item.closeMonth - 1]} {item.closeDay}</span>
          <span>NR ${item.feeNonresident.toLocaleString()}</span>
          {item.myPoints > 0 && (
            <span style={{ color: "#f59e0b" }}>{item.myPoints} pts</span>
          )}
          {item.notes && <span style={{ color: "#4ade80" }}>{item.notes}</span>}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="font-bold text-sm" style={{
          color: item.checked ? "#4a5a4a" : urgent ? "#f87171" : soonish ? "#f59e0b" : "#4ade80"
        }}>
          {item.daysUntil}d
        </div>
        <Link href={`/states/${item.stateId}`}
          className="text-xs" style={{ color: "#4a5a4a" }}>
          details →
        </Link>
      </div>
    </div>
  );
}
