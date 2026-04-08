"use client";
import { useState, useEffect } from "react";
import { LicenseEntry, loadLicenses, addLicense, deleteLicense, getExpiringLicenses } from "@/lib/tracker";
import { STATE_NAMES } from "@/lib/huntingData";

const CURRENT_YEAR = new Date().getFullYear();

const COMMON_LICENSE_TYPES = [
  "Base Hunting License",
  "Conservation License",
  "Habitat Stamp",
  "Migratory Bird Stamp",
  "Fishing License",
  "Combination License",
  "Big Game License",
  "Other",
];

const STATE_IDS = Object.keys(STATE_NAMES).map(k => k.toLowerCase()).sort();

function daysBetween(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

export default function LicenseTracker() {
  const [licenses, setLicenses] = useState<LicenseEntry[]>([]);
  const [expiring, setExpiring] = useState<LicenseEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    stateId: "",
    licenseType: "Base Hunting License",
    purchaseDate: new Date().toISOString().slice(0, 10),
    expiryDate: `${CURRENT_YEAR}-12-31`,
    cost: 0,
    notes: "",
  });

  const reload = () => {
    setLicenses(loadLicenses());
    setExpiring(getExpiringLicenses(60));
  };

  useEffect(() => { reload(); }, []);

  const handleAdd = () => {
    if (!form.stateId) return;
    addLicense({
      ...form,
      stateName: STATE_NAMES[form.stateId.toUpperCase()] ?? form.stateId,
    });
    reload();
    setShowAdd(false);
    setForm({ stateId: "", licenseType: "Base Hunting License",
      purchaseDate: new Date().toISOString().slice(0, 10),
      expiryDate: `${CURRENT_YEAR}-12-31`, cost: 0, notes: "" });
  };

  const handleDelete = (id: string) => {
    deleteLicense(id);
    reload();
  };

  const active = licenses.filter(l => daysBetween(l.expiryDate) >= 0);
  const expired = licenses.filter(l => daysBetween(l.expiryDate) < 0);

  if (licenses.length === 0 && !showAdd) {
    return (
      <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-2)" }}>
            License Renewal Tracker
          </h3>
          <button onClick={() => setShowAdd(true)}
            className="btn-ghost px-3 py-1 rounded text-xs font-medium">
            + Add License
          </button>
        </div>
        <p className="text-xs" style={{ color: "var(--text-3)" }}>
          Track annual licenses (WY, MT, NV, etc. require a base license to apply for draws).
          Never lose your preference points by forgetting to renew.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-2)" }}>
          License Renewal Tracker
        </h3>
        <button onClick={() => setShowAdd(v => !v)}
          className="btn-ghost px-3 py-1 rounded text-xs font-medium">
          + Add
        </button>
      </div>

      {/* Expiring soon alert */}
      {expiring.length > 0 && (
        <div className="mb-4 p-3 rounded-lg flex items-start gap-2"
          style={{ backgroundColor: "#2a1a0a", border: "1px solid #8a4a10" }}>
          <span className="text-sm">⚠️</span>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--amber)" }}>Licenses expiring within 60 days</p>
            <ul className="text-xs mt-1 space-y-0.5" style={{ color: "var(--text-2)" }}>
              {expiring.map(l => (
                <li key={l.id}>
                  {l.stateName} {l.licenseType} — expires {l.expiryDate}
                  <span style={{ color: daysBetween(l.expiryDate) <= 14 ? "var(--danger)" : "var(--amber)" }}>
                    {" "}({daysBetween(l.expiryDate)}d)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-2)" }}>
            Add License
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="field-label text-xs block mb-1">State *</label>
              <select value={form.stateId} onChange={e => setForm(f => ({ ...f, stateId: e.target.value }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
                <option value="">Select...</option>
                {STATE_IDS.map(s => <option key={s} value={s}>{STATE_NAMES[s.toUpperCase()]} ({s.toUpperCase()})</option>)}
              </select>
            </div>
            <div>
              <label className="field-label text-xs block mb-1">License Type</label>
              <select value={form.licenseType} onChange={e => setForm(f => ({ ...f, licenseType: e.target.value }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
                {COMMON_LICENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label text-xs block mb-1">Cost ($)</label>
              <input type="number" min={0} value={form.cost}
                onChange={e => setForm(f => ({ ...f, cost: Number(e.target.value) }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="field-label text-xs block mb-1">Purchase Date</label>
              <input type="date" value={form.purchaseDate}
                onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="field-label text-xs block mb-1">Expiry Date</label>
              <input type="date" value={form.expiryDate}
                onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="field-label text-xs block mb-1">Notes</label>
              <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="e.g., required for elk draw"
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!form.stateId}
              className="btn-primary px-4 py-1.5 rounded text-xs font-bold">
              Save
            </button>
            <button onClick={() => setShowAdd(false)} className="btn-ghost px-3 py-1.5 rounded text-xs">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active licenses */}
      {active.length > 0 && (
        <div className="space-y-2">
          {active.map(l => {
            const days = daysBetween(l.expiryDate);
            return (
              <div key={l.id} className="flex items-center justify-between py-2 px-3 rounded-lg"
                style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                <div>
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{l.stateName}</span>
                  <span className="text-xs ml-2" style={{ color: "var(--text-2)" }}>{l.licenseType}</span>
                  {l.cost > 0 && <span className="text-xs ml-2" style={{ color: "var(--text-3)" }}>${l.cost}</span>}
                  {l.notes && <span className="text-xs ml-2 italic" style={{ color: "var(--text-3)" }}>{l.notes}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold" style={{ color: days <= 14 ? "var(--danger)" : days <= 60 ? "var(--amber)" : "var(--success)" }}>
                      {days}d
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-3)" }}>Expires {l.expiryDate}</div>
                  </div>
                  <button onClick={() => handleDelete(l.id)} className="text-xs" style={{ color: "var(--text-3)" }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {expired.length > 0 && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--bg-elevated)" }}>
          <p className="text-xs mb-2" style={{ color: "var(--text-3)" }}>Expired ({expired.length})</p>
          <div className="space-y-1">
            {expired.map(l => (
              <div key={l.id} className="flex items-center justify-between px-3 py-1.5 rounded opacity-50"
                style={{ backgroundColor: "var(--bg-elevated)" }}>
                <span className="text-xs" style={{ color: "var(--text-3)" }}>
                  {l.stateName} {l.licenseType} — expired {l.expiryDate}
                </span>
                <button onClick={() => handleDelete(l.id)} className="text-xs" style={{ color: "var(--text-3)" }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs mt-3" style={{ color: "var(--text-3)" }}>
        Wyoming, Montana, Nevada and others require an active license to apply for draws. Letting it lapse can cost preference points.
      </p>
    </div>
  );
}
