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
      <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#8a9e8a" }}>
            License Renewal Tracker
          </h3>
          <button onClick={() => setShowAdd(true)}
            className="px-3 py-1 rounded text-xs font-medium"
            style={{ backgroundColor: "#1a2a1a", border: "1px solid #2a3a2a", color: "#c8d8c8" }}>
            + Add License
          </button>
        </div>
        <p className="text-xs" style={{ color: "#6a7e6a" }}>
          Track annual licenses (WY, MT, NV, etc. require a base license to apply for draws).
          Never lose your preference points by forgetting to renew.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#8a9e8a" }}>
          License Renewal Tracker
        </h3>
        <button onClick={() => setShowAdd(v => !v)}
          className="px-3 py-1 rounded text-xs font-medium"
          style={{ backgroundColor: "#1a2a1a", border: "1px solid #2a3a2a", color: "#c8d8c8" }}>
          + Add
        </button>
      </div>

      {/* Expiring soon alert */}
      {expiring.length > 0 && (
        <div className="mb-4 p-3 rounded-lg flex items-start gap-2"
          style={{ backgroundColor: "#2a1a0a", border: "1px solid #8a4a10" }}>
          <span className="text-sm">⚠️</span>
          <div>
            <p className="text-xs font-semibold" style={{ color: "#f59e0b" }}>Licenses expiring within 60 days</p>
            <ul className="text-xs mt-1 space-y-0.5" style={{ color: "#c8d8c8" }}>
              {expiring.map(l => (
                <li key={l.id}>
                  {l.stateName} {l.licenseType} — expires {l.expiryDate}
                  <span style={{ color: daysBetween(l.expiryDate) <= 14 ? "#f87171" : "#f59e0b" }}>
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
        <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: "#1a2a1a", border: "1px solid #2a3a2a" }}>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#8a9e8a" }}>
            Add License
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: "#8a9e8a" }}>State *</label>
              <select value={form.stateId} onChange={e => setForm(f => ({ ...f, stateId: e.target.value }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#e8f0e8" }}>
                <option value="">Select...</option>
                {STATE_IDS.map(s => <option key={s} value={s}>{STATE_NAMES[s.toUpperCase()]} ({s.toUpperCase()})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "#8a9e8a" }}>License Type</label>
              <select value={form.licenseType} onChange={e => setForm(f => ({ ...f, licenseType: e.target.value }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#e8f0e8" }}>
                {COMMON_LICENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "#8a9e8a" }}>Cost ($)</label>
              <input type="number" min={0} value={form.cost}
                onChange={e => setForm(f => ({ ...f, cost: Number(e.target.value) }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#e8f0e8" }} />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "#8a9e8a" }}>Purchase Date</label>
              <input type="date" value={form.purchaseDate}
                onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#e8f0e8" }} />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "#8a9e8a" }}>Expiry Date</label>
              <input type="date" value={form.expiryDate}
                onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#e8f0e8" }} />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "#8a9e8a" }}>Notes</label>
              <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="e.g., required for elk draw"
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#e8f0e8" }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!form.stateId}
              className="px-4 py-1.5 rounded text-xs font-bold"
              style={{ backgroundColor: form.stateId ? "#f59e0b" : "#2a3a2a", color: form.stateId ? "#0f1a0f" : "#8a9e8a" }}>
              Save
            </button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded text-xs" style={{ color: "#8a9e8a" }}>
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
                style={{ backgroundColor: "#1a2a1a", border: "1px solid #2a3a2a" }}>
                <div>
                  <span className="text-sm font-medium" style={{ color: "#e8f0e8" }}>{l.stateName}</span>
                  <span className="text-xs ml-2" style={{ color: "#8a9e8a" }}>{l.licenseType}</span>
                  {l.cost > 0 && <span className="text-xs ml-2" style={{ color: "#6a7e6a" }}>${l.cost}</span>}
                  {l.notes && <span className="text-xs ml-2 italic" style={{ color: "#4a5a4a" }}>{l.notes}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold" style={{ color: days <= 14 ? "#f87171" : days <= 60 ? "#f59e0b" : "#4ade80" }}>
                      {days}d
                    </div>
                    <div className="text-xs" style={{ color: "#4a5a4a" }}>Expires {l.expiryDate}</div>
                  </div>
                  <button onClick={() => handleDelete(l.id)} className="text-xs" style={{ color: "#4a5a4a" }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {expired.length > 0 && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "#1a2a1a" }}>
          <p className="text-xs mb-2" style={{ color: "#4a5a4a" }}>Expired ({expired.length})</p>
          <div className="space-y-1">
            {expired.map(l => (
              <div key={l.id} className="flex items-center justify-between px-3 py-1.5 rounded opacity-50"
                style={{ backgroundColor: "#1a2a1a" }}>
                <span className="text-xs" style={{ color: "#6a7e6a" }}>
                  {l.stateName} {l.licenseType} — expired {l.expiryDate}
                </span>
                <button onClick={() => handleDelete(l.id)} className="text-xs" style={{ color: "#4a5a4a" }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs mt-3" style={{ color: "#4a5a4a" }}>
        Wyoming, Montana, Nevada and others require an active license to apply for draws. Letting it lapse can cost preference points.
      </p>
    </div>
  );
}
