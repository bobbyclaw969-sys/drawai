"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { huntingData, SPECIES_LABELS, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";
import { toggleReminder, loadReminders, getUpcomingReminders, DeadlineReminder } from "@/lib/tracker";
import DataDisclaimer from "@/components/DataDisclaimer";
import DataFreshnessWarning from "@/components/DataFreshnessWarning";

const ALL_SPECIES: SpeciesKey[] = [
  "elk", "mule_deer", "whitetail", "pronghorn",
  "bighorn_sheep", "mountain_goat", "moose", "black_bear", "bison",
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface Deadline {
  stateId: string;
  stateName: string;
  species: SpeciesKey;
  closeMonth: number;
  closeDay: number;
  closeYear: number;
  openMonth: number;
  feeNonresident: number;
  hasOTC: boolean;
  pointSystem: string;
  daysUntil: number;
  isOpenNow: boolean;
}

function getDeadlines(speciesFilter: SpeciesKey | "all"): Deadline[] {
  const now = new Date();
  const today = now.getTime();
  const currentMonth = now.getMonth() + 1;

  const seen = new Set<string>();
  const deadlines: Deadline[] = [];

  for (const d of huntingData) {
    if (speciesFilter !== "all" && d.species !== speciesFilter) continue;

    const key = `${d.stateId}-${d.species}`;
    if (seen.has(key)) continue;
    seen.add(key);

    let year = now.getFullYear();
    let closeDate = new Date(year, d.appCloseMonth - 1, d.appCloseDay);
    if (closeDate.getTime() < today) {
      year += 1;
      closeDate = new Date(year, d.appCloseMonth - 1, d.appCloseDay);
    }

    const daysUntil = Math.ceil((closeDate.getTime() - today) / 86400000);

    // Is the application window currently open?
    let isOpenNow = false;
    if (year === now.getFullYear()) {
      if (d.appOpenMonth <= d.appCloseMonth) {
        isOpenNow = currentMonth >= d.appOpenMonth && currentMonth <= d.appCloseMonth
          && closeDate.getTime() > today;
      }
    } else {
      // Window spans year boundary or next year
      isOpenNow = currentMonth >= d.appOpenMonth;
    }

    deadlines.push({
      stateId: d.stateId,
      stateName: d.stateName,
      species: d.species as SpeciesKey,
      closeMonth: d.appCloseMonth,
      closeDay: d.appCloseDay,
      closeYear: year,
      openMonth: d.appOpenMonth,
      feeNonresident: d.feeNonresident,
      hasOTC: d.hasOTC,
      pointSystem: d.pointSystem,
      daysUntil,
      isOpenNow,
    });
  }

  return deadlines.sort((a, b) => a.daysUntil - b.daysUntil);
}

function urgencyStyle(days: number): { color: string; label: string } {
  if (days <= 14) return { color: "var(--danger)", label: "Closing soon" };
  if (days <= 45) return { color: "var(--amber)", label: "Coming up" };
  return { color: "var(--success)", label: "Upcoming" };
}

const POINT_SYSTEM_LABELS: Record<string, string> = {
  preference: 'Preference pts',
  bonus: 'Bonus pts',
  weighted: 'Weighted pts',
  none: 'Random lottery',
  otc: 'OTC',
};

export default function DeadlinesPage() {
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesKey | "all">("elk");
  const [watchedKeys, setWatchedKeys] = useState<Set<string>>(new Set());
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [upcomingReminders, setUpcomingReminders] = useState<DeadlineReminder[]>([]);

  useEffect(() => {
    const reminders = loadReminders();
    setWatchedKeys(new Set(reminders.map(r => r.key)));
    setUpcomingReminders(getUpcomingReminders(14));
  }, []);

  const deadlines = getDeadlines(speciesFilter);
  const openNow = deadlines.filter(d => d.isOpenNow);
  const upcoming = deadlines.filter(d => !d.isOpenNow && d.daysUntil <= 60);
  const later = deadlines.filter(d => !d.isOpenNow && d.daysUntil > 60);

  const handleToggleReminder = (d: Deadline) => {
    const key = `${d.stateId}-${d.species}`;
    const reminder: DeadlineReminder = {
      key,
      stateName: d.stateName,
      species: d.species,
      closeMonth: d.closeMonth,
      closeDay: d.closeDay,
    };
    const nowWatching = toggleReminder(reminder);
    setWatchedKeys(prev => {
      const next = new Set(prev);
      if (nowWatching) next.add(key);
      else next.delete(key);
      return next;
    });
    setUpcomingReminders(getUpcomingReminders(14));
  };

  const handleExportIcal = () => {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Tag Hunter//Hunt Application Deadlines//EN",
      "CALSCALE:GREGORIAN",
    ];

    for (const d of deadlines) {
      const dt = `${d.closeYear}${String(d.closeMonth).padStart(2, "0")}${String(d.closeDay).padStart(2, "0")}`;
      const uid = `taghunter-${d.stateId}-${d.species}-${d.closeYear}@taghunter.app`;
      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTART;VALUE=DATE:${dt}`,
        `DTEND;VALUE=DATE:${dt}`,
        `SUMMARY:${d.stateName} ${SPECIES_LABELS[d.species]} Application Closes`,
        `DESCRIPTION:NR Fee: $${d.feeNonresident} | ${d.hasOTC ? "OTC available" : "Draw only"} | ${d.pointSystem} points | Verify at official state wildlife agency`,
        "END:VEVENT"
      );
    }

    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taghunter-hunting-deadlines.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <AppNav />
      <div className="page-inner">
      <DataFreshnessWarning />
      {/* Page title row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Application Deadlines</h1>
          <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>Never miss an application window</p>
        </div>
        <button onClick={handleExportIcal} className="btn-ghost" style={{ fontSize: 12 }}>
          📅 Export .ics
        </button>
      </div>

      <DataDisclaimer />

      {/* Reminder alerts */}
      {!alertDismissed && upcomingReminders.length > 0 && (
        <div className="card" style={{
          padding: 16,
          marginBottom: 20,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          background: "var(--warning-bg)",
          borderColor: "var(--warning-border)",
        }}>
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>🔔</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: "var(--warning)", marginBottom: 6 }}>
              Upcoming deadline reminders
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
              {upcomingReminders.map(r => {
                const now = new Date();
                let year = now.getFullYear();
                let d = new Date(year, r.closeMonth - 1, r.closeDay);
                if (d < now) { year += 1; d = new Date(year, r.closeMonth - 1, r.closeDay); }
                const days = Math.ceil((d.getTime() - now.getTime()) / 86400000);
                return (
                  <li key={r.key} style={{ fontSize: 12, color: "var(--text-2)" }}>
                    {r.stateName} {SPECIES_LABELS[r.species]} — closes {MONTH_NAMES[r.closeMonth - 1]} {r.closeDay}
                    <span style={{ color: days <= 7 ? "var(--danger)" : "var(--amber)", fontWeight: 700 }}> ({days}d)</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <button onClick={() => setAlertDismissed(true)} style={{ fontSize: 14, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* Species filter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
        {(["all", ...ALL_SPECIES] as (SpeciesKey | "all")[]).map(s => (
          <button
            key={s}
            onClick={() => setSpeciesFilter(s)}
            className={`pill-btn${speciesFilter === s ? " selected" : ""}`}
            style={{ fontSize: 12, padding: "6px 14px" }}
          >
            {s === "all" ? "All Species" : SPECIES_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Open NOW section */}
      {openNow.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <p className="section-label" style={{ color: "var(--success)" }}>✅ Apply Right Now</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {openNow.map(d => {
              const key = `${d.stateId}-${d.species}`;
              return <DeadlineCard key={key} d={d} watched={watchedKeys.has(key)} onToggle={() => handleToggleReminder(d)} highlight />;
            })}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <p className="section-label" style={{ color: "var(--warning)" }}>⚡ Next 60 Days</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcoming.map(d => {
              const key = `${d.stateId}-${d.species}`;
              return <DeadlineCard key={key} d={d} watched={watchedKeys.has(key)} onToggle={() => handleToggleReminder(d)} />;
            })}
          </div>
        </div>
      )}

      {later.length > 0 && (
        <div>
          <p className="section-label">Later This Season</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {later.map(d => {
              const key = `${d.stateId}-${d.species}`;
              return <DeadlineCard key={key} d={d} watched={watchedKeys.has(key)} onToggle={() => handleToggleReminder(d)} />;
            })}
          </div>
        </div>
      )}

      <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 32 }}>
        Always verify deadlines at your state&apos;s official wildlife agency website before applying.
      </p>
      </div>
    </div>
  );
}

interface CardProps {
  d: Deadline;
  watched: boolean;
  onToggle: () => void;
  highlight?: boolean;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function urgencyColor(days: number) {
  if (days <= 14) return "var(--danger)";
  if (days <= 45) return "var(--warning)";
  return "var(--success)";
}

function DeadlineCard({ d, watched, onToggle, highlight }: CardProps) {
  const color = urgencyColor(d.daysUntil);
  return (
    <div
      className="card"
      style={{
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        borderColor: highlight ? "var(--success-border)" : undefined,
        background: highlight ? "var(--success-bg)" : undefined,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>{d.stateName}</span>
          <span style={{ fontSize: 13, color: "var(--text-2)" }}>{SPECIES_LABELS[d.species]}</span>
          {d.isOpenNow && <span className="badge badge-green">OPEN NOW</span>}
          {d.hasOTC && <span className="badge badge-muted">OTC</span>}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 12, color: "var(--text-3)" }}>
          <span>Closes {MONTHS[d.closeMonth - 1]} {d.closeDay}, {d.closeYear}</span>
          <span>·</span>
          <span>NR ${d.feeNonresident.toLocaleString()}</span>
          <span>·</span>
          <span>{POINT_SYSTEM_LABELS[d.pointSystem] ?? d.pointSystem}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button
          onClick={onToggle}
          title={watched ? "Remove reminder" : "Set reminder"}
          style={{ fontSize: "1.1rem", color: watched ? "var(--amber)" : "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}
        >
          {watched ? "🔔" : "🔕"}
        </button>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color, lineHeight: 1 }}>{d.daysUntil}d</div>
          <div style={{ fontSize: 11, color, marginTop: 2 }}>
            {d.daysUntil <= 14 ? "Closing soon" : d.daysUntil <= 45 ? "Coming up" : "Upcoming"}
          </div>
        </div>
      </div>
    </div>
  );
}
