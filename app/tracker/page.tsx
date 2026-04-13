"use client";
import { useState, useEffect, useCallback } from "react";
import { SPECIES_LABELS, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";
import {
  Application, AppStatus,
  STATUS_LABELS, STATUS_COLORS,
  loadTracker, updateApplication, deleteApplication,
  deriveCurrentPoints, exportToCSV, CURRENT_YEAR,
} from "@/lib/tracker";
import AddApplicationModal from "@/components/AddApplicationModal";
import BudgetDashboard from "@/components/BudgetDashboard";
import PointsTracker from "@/components/PointsTracker";
import HuntLogbook from "@/components/HuntLogbook";
import LicenseTracker from "@/components/LicenseTracker";
import AppNav from "@/components/AppNav";

type SortKey = 'year' | 'state' | 'species' | 'status';

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [filterYear, setFilterYear] = useState<number | 'all'>('all');
  const [filterSpecies, setFilterSpecies] = useState<SpeciesKey | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<AppStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('year');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const reload = useCallback(() => {
    const data = loadTracker();
    setApps(data.applications);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reload(); }, []);

  const handleStatusChange = (id: string, status: AppStatus) => {
    updateApplication(id, { status });
    reload();
  };

  const handleDelete = (id: string) => {
    deleteApplication(id);
    setConfirmDeleteId(null);
    reload();
  };

  const totalFees = apps.reduce((s, a) => s + (a.feeSpent || 0), 0);
  const drawn = apps.filter(a => a.status === 'drawn').length;
  const thisYear = apps.filter(a => a.year === CURRENT_YEAR);
  const pending = apps.filter(a => a.status === 'applied' || a.status === 'pending');
  const currentPoints = deriveCurrentPoints(apps);
  const years = [...new Set(apps.map(a => a.year))].sort((a, b) => b - a);
  const allSpecies = [...new Set(apps.map(a => a.species))] as SpeciesKey[];

  const filtered = apps
    .filter(a => filterYear === 'all' || a.year === filterYear)
    .filter(a => filterSpecies === 'all' || a.species === filterSpecies)
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .sort((a, b) => {
      if (sortKey === 'year') return b.year - a.year;
      if (sortKey === 'state') return a.stateName.localeCompare(b.stateName);
      if (sortKey === 'species') return a.species.localeCompare(b.species);
      if (sortKey === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

  return (
    <div className="page">
      <AppNav />
      <div className="page-inner">

        {/* Page title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              My Applications
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>
              Track points, draws, and licenses — stored in your browser
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {apps.length > 0 && (
              <button onClick={() => exportToCSV(apps)} className="btn-ghost" style={{ fontSize: 12 }}>
                ↓ CSV
              </button>
            )}
            <button
              onClick={() => setShowAdd(true)}
              className="btn-primary"
              style={{ fontSize: 13, padding: "8px 16px" }}
            >
              + Log Application
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total Applications", value: apps.length },
            { label: "Tags Drawn",          value: `${drawn} / ${apps.length}` },
            { label: `${CURRENT_YEAR} Apps`, value: thisYear.length },
            { label: "Fees (All Time)",      value: `$${totalFees.toLocaleString()}` },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pending alert */}
        {pending.length > 0 && (
          <div className="card" style={{
            padding: 16,
            marginBottom: 20,
            background: "var(--warning-bg)",
            borderColor: "var(--warning-border)",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}>
            <span style={{ fontSize: "1.1rem" }}>⏳</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: 13, color: "var(--warning)" }}>
                {pending.length} application{pending.length > 1 ? "s" : ""} awaiting results
              </p>
              <p style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>
                {pending.map(a => `${a.stateName} ${SPECIES_LABELS[a.species as SpeciesKey]}`).join(" · ")}
              </p>
            </div>
          </div>
        )}

        <BudgetDashboard apps={apps} />
        <PointsTracker apps={apps} />
        <LicenseTracker />
        <HuntLogbook />

        {/* Derived points summary */}
        {Object.keys(currentPoints).length > 0 && (
          <div className="card" style={{ padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-3)", marginBottom: 14 }}>
              Current Points (derived from history)
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(currentPoints).flatMap(([stateId, speciesMap]) =>
                Object.entries(speciesMap).map(([species, pts]) => (
                  <div
                    key={`${stateId}-${species}`}
                    className="badge badge-muted"
                    style={{ padding: "4px 10px", borderRadius: 6 }}
                  >
                    <span style={{ color: "var(--text)" }}>
                      {STATE_NAMES[stateId.toUpperCase()] ?? stateId}
                    </span>
                    <span style={{ color: "var(--text-3)", margin: "0 4px" }}>·</span>
                    <span style={{ color: "var(--text-2)" }}>{SPECIES_LABELS[species as SpeciesKey]}</span>
                    <span style={{ color: "var(--amber)", fontWeight: 800, marginLeft: 6 }}>{pts}pt</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Filters + sort */}
        {apps.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, alignItems: "center" }}>
            <select
              value={filterYear}
              onChange={e => setFilterYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="input"
              style={{ width: "auto", fontSize: 12, padding: "6px 10px" }}
            >
              <option value="all">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select
              value={filterSpecies}
              onChange={e => setFilterSpecies(e.target.value as SpeciesKey | 'all')}
              className="input"
              style={{ width: "auto", fontSize: 12, padding: "6px 10px" }}
            >
              <option value="all">All Species</option>
              {allSpecies.map(s => <option key={s} value={s}>{SPECIES_LABELS[s]}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as AppStatus | 'all')}
              className="input"
              style={{ width: "auto", fontSize: 12, padding: "6px 10px" }}
            >
              <option value="all">All Statuses</option>
              {(Object.keys(STATUS_LABELS) as AppStatus[]).map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-3)" }}>
              Sort:
              {(['year', 'state', 'species', 'status'] as SortKey[]).map(k => (
                <button
                  key={k}
                  onClick={() => setSortKey(k)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: sortKey === k ? 700 : 500,
                    background: sortKey === k ? "var(--amber-glow)" : "transparent",
                    color: sortKey === k ? "var(--amber)" : "var(--text-3)",
                    border: sortKey === k ? "1px solid rgba(232,150,15,0.3)" : "1px solid transparent",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Application list */}
        {apps.length === 0 ? (
          <div className="card" style={{ padding: 56, textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>📋</div>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>No applications logged yet</p>
            <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
              Track every state application, watch your points grow, and never miss a deadline.
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="btn-primary"
            >
              Log Your First Application
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.length === 0 && (
              <p style={{ textAlign: "center", padding: "32px 0", fontSize: 13, color: "var(--text-3)" }}>
                No applications match the current filters.
              </p>
            )}
            {filtered.map(app => {
              const colors = STATUS_COLORS[app.status];
              const isConfirmingDelete = confirmDeleteId === app.id;
              return (
                <div key={app.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    {/* Left */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>{app.year}</span>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--amber)" }}>{app.stateName}</span>
                        <span style={{ fontSize: 14, color: "var(--text-2)" }}>{SPECIES_LABELS[app.species as SpeciesKey]}</span>
                        <span style={{ fontSize: 12, color: "var(--text-3)", textTransform: "capitalize" }}>{app.seasonType}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: "var(--text-3)" }}>
                        {app.pointsBefore >= 0 && (
                          <span>
                            Points: <span style={{ color: "var(--text)" }}>{app.pointsBefore}</span>
                            {app.pointsAfter !== app.pointsBefore && (
                              <span> → <span style={{ color: app.status === 'drawn' ? "var(--danger)" : "var(--success)" }}>{app.pointsAfter}</span></span>
                            )}
                          </span>
                        )}
                        {app.feeSpent > 0 && <span>Fee: <span style={{ color: "var(--text)" }}>${app.feeSpent}</span></span>}
                        {app.appliedDate && <span>Applied: {app.appliedDate}</span>}
                        {app.notes && <span style={{ fontStyle: "italic" }}>&quot;{app.notes}&quot;</span>}
                      </div>
                    </div>

                    {/* Right */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                      <span
                        className="badge"
                        style={{
                          background: colors.bg,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                          borderRadius: 6,
                          padding: "3px 10px",
                        }}
                      >
                        {STATUS_LABELS[app.status]}
                      </span>

                      {(app.status === 'applied' || app.status === 'pending') && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => handleStatusChange(app.id, 'drawn')}
                            className="badge badge-green"
                            style={{ cursor: "pointer", padding: "3px 10px", borderRadius: 6 }}
                          >
                            Drawn ✓
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, 'not_drawn')}
                            className="badge badge-red"
                            style={{ cursor: "pointer", padding: "3px 10px", borderRadius: 6 }}
                          >
                            Not Drawn
                          </button>
                        </div>
                      )}

                      {isConfirmingDelete ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => handleDelete(app.id)}
                            style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "var(--danger-bg)", color: "var(--danger)", border: "1px solid var(--danger-border)", cursor: "pointer" }}
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            style={{ fontSize: 11, color: "var(--text-3)", cursor: "pointer", background: "none", border: "none" }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(app.id)}
                          style={{ fontSize: 11, color: "var(--text-3)", cursor: "pointer", background: "none", border: "none" }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 32 }}>
          Data stored locally in your browser. Use Export CSV to back up your records.
        </p>
      </div>

      {showAdd && (
        <AddApplicationModal
          onClose={() => setShowAdd(false)}
          onAdded={() => { reload(); setShowAdd(false); }}
        />
      )}
    </div>
  );
}
