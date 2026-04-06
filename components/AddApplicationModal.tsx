"use client";
import { useState } from "react";
import { SpeciesKey } from "@/lib/types";
import { SPECIES_LABELS, STATE_NAMES, huntingData } from "@/lib/huntingData";
import {
  Application, AppStatus, STATUS_LABELS,
  CURRENT_YEAR, YEARS, addApplication,
} from "@/lib/tracker";

const ALL_SPECIES: SpeciesKey[] = [
  "elk", "mule_deer", "whitetail", "pronghorn",
  "bighorn_sheep", "mountain_goat", "moose", "black_bear", "bison",
];

interface Props {
  onClose: () => void;
  onAdded: (app: Application) => void;
}

export default function AddApplicationModal({ onClose, onAdded }: Props) {
  const [form, setForm] = useState({
    year: CURRENT_YEAR,
    stateId: '',
    species: '' as SpeciesKey | '',
    seasonType: 'archery',
    status: 'applied' as AppStatus,
    pointsBefore: 0,
    pointsAfter: 0,
    feeSpent: 0,
    appliedDate: new Date().toISOString().slice(0, 10),
    resultDate: '',
    notes: '',
  });

  const set = (k: string, v: string | number) =>
    setForm(prev => ({ ...prev, [k]: v }));

  // Get unique state IDs from huntingData
  const stateIds = [...new Set(huntingData.map(d => d.stateId))].sort();
  const stateName = form.stateId
    ? STATE_NAMES[form.stateId.toUpperCase()] ?? form.stateId
    : '';

  const valid = form.stateId && form.species && form.year;

  const handleSubmit = () => {
    if (!valid) return;
    const app = addApplication({
      year: form.year,
      stateId: form.stateId,
      stateName: STATE_NAMES[form.stateId.toUpperCase()] ?? form.stateId,
      species: form.species as SpeciesKey,
      seasonType: form.seasonType,
      status: form.status,
      pointsBefore: Number(form.pointsBefore),
      pointsAfter: Number(form.pointsAfter),
      feeSpent: Number(form.feeSpent),
      appliedDate: form.appliedDate,
      resultDate: form.resultDate,
      notes: form.notes,
    });
    onAdded(app);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#162016', border: '1px solid #2a3a2a' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: '#f59e0b' }}>Log Application</h2>
          <button onClick={onClose} style={{ color: '#8a9e8a' }} className="text-xl">✕</button>
        </div>

        {/* Year + State + Species row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Year</label>
            <select value={form.year} onChange={e => set('year', Number(e.target.value))} className="input w-full">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="label">State</label>
            <select value={form.stateId} onChange={e => set('stateId', e.target.value)} className="input w-full">
              <option value="">Select...</option>
              {stateIds.map(s => (
                <option key={s} value={s}>{STATE_NAMES[s.toUpperCase()] ?? s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Species</label>
            <select value={form.species} onChange={e => set('species', e.target.value)} className="input w-full">
              <option value="">Select...</option>
              {ALL_SPECIES.map(s => (
                <option key={s} value={s}>{SPECIES_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Method</label>
            <select value={form.seasonType} onChange={e => set('seasonType', e.target.value)} className="input w-full">
              <option value="archery">Archery</option>
              <option value="rifle">Rifle</option>
              <option value="muzzleloader">Muzzleloader</option>
              <option value="any">Any</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="label">Status</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {(Object.keys(STATUS_LABELS) as AppStatus[]).map(s => (
              <button
                key={s}
                onClick={() => set('status', s)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: form.status === s ? '#f59e0b22' : '#1a2a1a',
                  border: form.status === s ? '1px solid #f59e0b' : '1px solid #2a3a2a',
                  color: form.status === s ? '#f59e0b' : '#c8d8c8',
                }}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Points */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Points Before Applying</label>
            <input
              type="number" min={0} max={30}
              value={form.pointsBefore}
              onChange={e => set('pointsBefore', e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="label">Points After Result</label>
            <input
              type="number" min={0} max={30}
              value={form.pointsAfter}
              onChange={e => set('pointsAfter', e.target.value)}
              className="input w-full"
              placeholder={form.status === 'drawn' ? '0 (reset)' : `${Number(form.pointsBefore) + 1}`}
            />
            <p className="text-xs mt-1" style={{ color: '#6a7e6a' }}>
              {form.status === 'drawn' ? 'Usually resets to 0 when drawn' : 'Usually +1 if not drawn'}
            </p>
          </div>
        </div>

        {/* Fee + Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">App Fee Spent ($)</label>
            <input
              type="number" min={0}
              value={form.feeSpent}
              onChange={e => set('feeSpent', e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="label">Applied Date</label>
            <input
              type="date"
              value={form.appliedDate}
              onChange={e => set('appliedDate', e.target.value)}
              className="input w-full"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="label">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={2}
            className="input w-full resize-none"
            placeholder={`e.g. ${stateName || 'CO'} unit 12, applied with buddy...`}
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#1a2a1a', border: '1px solid #2a3a2a', color: '#c8d8c8' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!valid}
            className="flex-[2] py-2.5 rounded-lg text-sm font-bold"
            style={{
              backgroundColor: valid ? '#f59e0b' : '#2a3a2a',
              color: valid ? '#0f1a0f' : '#8a9e8a',
              cursor: valid ? 'pointer' : 'not-allowed',
            }}
          >
            Save Application
          </button>
        </div>
      </div>

      <style>{`
        .label { display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #8a9e8a; margin-bottom: 0.35rem; }
        .input { background-color: #1a2a1a; border: 1px solid #2a3a2a; color: #e8f0e8; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; }
        .input:focus { outline: none; border-color: #f59e0b; }
        select.input option { background-color: #1a2a1a; }
      `}</style>
    </div>
  );
}
