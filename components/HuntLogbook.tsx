"use client";
import { useState, useEffect } from "react";
import { HuntLog, loadLogbook, addHuntLog, deleteHuntLog } from "@/lib/tracker";
import { SPECIES_LABELS, SPECIES_EMOJI, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";

const ALL_SPECIES: SpeciesKey[] = [
  "elk","mule_deer","whitetail","pronghorn","black_bear",
  "bighorn_sheep","mountain_goat","moose","bison","mountain_lion",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

export default function HuntLogbook() {
  const [logs, setLogs] = useState<HuntLog[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    year: CURRENT_YEAR,
    stateId: "",
    species: "elk" as SpeciesKey,
    seasonType: "archery",
    unitOrArea: "",
    startDate: "",
    endDate: "",
    daysAfield: 1,
    harvested: false,
    animalNotes: "",
    huntNotes: "",
    companions: "",
    totalCost: 0,
  });

  const reload = () => setLogs(loadLogbook());
  useEffect(() => { reload(); }, []);

  const handleSubmit = () => {
    if (!form.stateId) return;
    addHuntLog({
      ...form,
      stateName: STATE_NAMES[form.stateId.toUpperCase()] ?? form.stateId,
    });
    reload();
    setShowAdd(false);
    setForm({ year: CURRENT_YEAR, stateId: "", species: "elk", seasonType: "archery",
      unitOrArea: "", startDate: "", endDate: "", daysAfield: 1,
      harvested: false, animalNotes: "", huntNotes: "", companions: "", totalCost: 0 });
  };

  const handleDelete = (id: string) => {
    deleteHuntLog(id);
    setConfirmDeleteId(null);
    reload();
  };

  const totalHarvests = logs.filter(l => l.harvested).length;
  const totalDays = logs.reduce((s, l) => s + l.daysAfield, 0);
  const totalSpent = logs.reduce((s, l) => s + l.totalCost, 0);

  const availableStates = [...new Set(
    Object.keys(STATE_NAMES).map(k => k.toLowerCase())
  )].sort();

  if (logs.length === 0 && !showAdd) {
    return (
      <div className="rounded-xl p-8 mb-5 text-center" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="text-4xl mb-3">📓</div>
        <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--text)" }}>Hunt Logbook</h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
          Log your hunts — dates, harvest, notes, and total cost. Build a record of every western adventure.
        </p>
        <button onClick={() => setShowAdd(true)}
          className="px-5 py-2.5 rounded-lg font-bold text-sm"
          style={{ backgroundColor: "var(--amber)", color: "var(--text-inv)" }}>
          + Log a Hunt
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-2)" }}>
          Hunt Logbook
        </h3>
        <button onClick={() => setShowAdd(v => !v)}
          className="px-3 py-1 rounded text-xs font-medium"
          style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
          + Log Hunt
        </button>
      </div>

      {/* Summary stats */}
      {logs.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Hunts Logged", value: logs.length },
            { label: "Tags Filled", value: totalHarvests },
            { label: "Days Afield", value: totalDays },
          ].map(s => (
            <div key={s.label} className="rounded-lg p-2.5 text-center"
              style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <div className="font-bold text-base" style={{ color: "var(--amber)" }}>{s.value}</div>
              <div className="text-xs" style={{ color: "var(--text-3)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-2)" }}>
            New Hunt Entry
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--text-2)" }}>Year</label>
              <select value={form.year} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--text-2)" }}>State *</label>
              <select value={form.stateId} onChange={e => setForm(f => ({ ...f, stateId: e.target.value }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
                <option value="">Select...</option>
                {availableStates.map(s => (
                  <option key={s} value={s}>{STATE_NAMES[s.toUpperCase()] ?? s.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--text-2)" }}>Species</label>
              <select value={form.species} onChange={e => setForm(f => ({ ...f, species: e.target.value as SpeciesKey }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
                {ALL_SPECIES.map(s => <option key={s} value={s}>{SPECIES_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--text-2)" }}>Method</label>
              <select value={form.seasonType} onChange={e => setForm(f => ({ ...f, seasonType: e.target.value }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
                {["archery","rifle","muzzleloader"].map(m => <option key={m} value={m} className="capitalize">{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--text-2)" }}>Unit / Area</label>
              <input type="text" value={form.unitOrArea} onChange={e => setForm(f => ({ ...f, unitOrArea: e.target.value }))}
                placeholder="e.g., GMU 12, Area 2"
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--text-2)" }}>Days Afield</label>
              <input type="number" min={1} max={30} value={form.daysAfield}
                onChange={e => setForm(f => ({ ...f, daysAfield: Number(e.target.value) }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--text-2)" }}>Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--text-2)" }}>End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--text-2)" }}>Total Cost ($)</label>
              <input type="number" min={0} value={form.totalCost}
                onChange={e => setForm(f => ({ ...f, totalCost: Number(e.target.value) }))}
                placeholder="Tag + travel + other"
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
          </div>

          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: "var(--text)" }}>
              <input type="checkbox" checked={form.harvested}
                onChange={e => setForm(f => ({ ...f, harvested: e.target.checked }))}
                className="accent-amber-500" />
              Tag filled / Animal harvested
            </label>
          </div>

          {form.harvested && (
            <div className="mb-3">
              <label className="text-xs block mb-1" style={{ color: "var(--text-2)" }}>Animal notes (score, weight, etc.)</label>
              <input type="text" value={form.animalNotes}
                onChange={e => setForm(f => ({ ...f, animalNotes: e.target.value }))}
                placeholder="e.g., 6x6 bull, 340 B&C, 740 lbs live weight"
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
          )}

          <div className="mb-3">
            <label className="text-xs block mb-1" style={{ color: "var(--text-2)" }}>Hunt notes</label>
            <textarea value={form.huntNotes} onChange={e => setForm(f => ({ ...f, huntNotes: e.target.value }))}
              placeholder="Conditions, lessons learned, what you'd do differently..."
              rows={3}
              className="w-full px-2 py-1.5 rounded text-xs resize-none"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
          </div>

          <div className="mb-4">
            <label className="text-xs block mb-1" style={{ color: "var(--text-2)" }}>Hunting companions</label>
            <input type="text" value={form.companions}
              onChange={e => setForm(f => ({ ...f, companions: e.target.value }))}
              placeholder="Who came with you?"
              className="w-full px-2 py-1.5 rounded text-xs"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
          </div>

          <div className="flex gap-2">
            <button onClick={handleSubmit} disabled={!form.stateId}
              className="btn-primary px-4 py-1.5 rounded text-xs font-bold">
              Save Entry
            </button>
            <button onClick={() => setShowAdd(false)}
              className="btn-ghost px-3 py-1.5 rounded text-xs">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Log entries */}
      <div className="space-y-2">
        {logs.map(log => {
          const isExpanded = expandedId === log.id;
          const isConfirmingDelete = confirmDeleteId === log.id;
          return (
            <div key={log.id} className="rounded-xl overflow-hidden"
              style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              {/* Summary row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : log.id)}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <span className="text-2xl flex-shrink-0">{SPECIES_EMOJI[log.species]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: "var(--text)" }}>{log.year}</span>
                    <span className="font-semibold text-sm" style={{ color: "var(--amber)" }}>{log.stateName}</span>
                    <span className="text-sm" style={{ color: "var(--text-2)" }}>{SPECIES_LABELS[log.species]}</span>
                    {log.harvested && (
                      <span className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success-border)" }}>
                        Tagged Out ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5 flex gap-3" style={{ color: "var(--text-3)" }}>
                    <span>{log.daysAfield} days afield</span>
                    {log.unitOrArea && <span>{log.unitOrArea}</span>}
                    {log.totalCost > 0 && <span>${log.totalCost.toLocaleString()} total</span>}
                  </div>
                </div>
                <span className="text-xs" style={{ color: "var(--text-3)" }}>{isExpanded ? "▲" : "▼"}</span>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: "var(--border)" }}>
                  <div className="mt-3 space-y-2 text-xs" style={{ color: "var(--text-2)" }}>
                    {log.startDate && (
                      <p><span style={{ color: "var(--text-3)" }}>Dates:</span> <span style={{ color: "var(--text-2)" }}>{log.startDate}{log.endDate ? ` → ${log.endDate}` : ""}</span></p>
                    )}
                    {log.animalNotes && (
                      <p><span style={{ color: "var(--text-3)" }}>Animal:</span> <span style={{ color: "var(--text-2)" }}>{log.animalNotes}</span></p>
                    )}
                    {log.companions && (
                      <p><span style={{ color: "var(--text-3)" }}>Companions:</span> <span style={{ color: "var(--text-2)" }}>{log.companions}</span></p>
                    )}
                    {log.huntNotes && (
                      <div>
                        <span style={{ color: "var(--text-3)" }}>Notes:</span>
                        <p className="mt-1 leading-relaxed" style={{ color: "var(--text-2)" }}>{log.huntNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    {isConfirmingDelete ? (
                      <>
                        <button onClick={() => handleDelete(log.id)}
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{ backgroundColor: "rgba(194,80,80,0.12)", color: "var(--danger)" }}>
                          Confirm Delete
                        </button>
                        <button onClick={() => setConfirmDeleteId(null)}
                          className="btn-ghost px-2 py-0.5 rounded text-xs">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(log.id)}
                        className="text-xs"
                        style={{ color: "var(--text-3)" }}>
                        Delete entry
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
