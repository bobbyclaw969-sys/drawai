"use client";
import { useState, useEffect } from "react";
import { Application, ManualPointsEntry, loadManualPoints, saveManualPoint, deleteManualPoint, deriveCurrentPoints, getMergedPoints } from "@/lib/tracker";
import { huntingData, SPECIES_LABELS, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";

interface Props {
  apps: Application[];
}

export default function PointsTracker({ apps }: Props) {
  const [manualPoints, setManualPoints] = useState<ManualPointsEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addState, setAddState] = useState('');
  const [addSpecies, setAddSpecies] = useState<SpeciesKey>('elk');
  const [addPoints, setAddPoints] = useState(0);
  const [addYear, setAddYear] = useState(new Date().getFullYear());
  const [addNotes, setAddNotes] = useState('');

  useEffect(() => { setManualPoints(loadManualPoints()); }, []);

  const reload = () => setManualPoints(loadManualPoints());

  const handleSave = () => {
    if (!addState) return;
    saveManualPoint({
      stateId: addState.toLowerCase(),
      stateName: STATE_NAMES[addState.toUpperCase()] ?? addState,
      species: addSpecies,
      points: addPoints,
      updatedYear: addYear,
      notes: addNotes,
    });
    reload();
    setShowAdd(false);
    setAddState('');
    setAddPoints(0);
    setAddNotes('');
  };

  const handleDelete = (id: string) => {
    deleteManualPoint(id);
    reload();
  };

  // Build merged view: derived + manual
  const merged = getMergedPoints(apps, manualPoints);
  const derived = deriveCurrentPoints(apps);

  // Get all unique states we're tracking points in
  const allTrackedKeys: { stateId: string; species: string }[] = [];
  const seen = new Set<string>();
  for (const [stateId, speciesMap] of Object.entries(merged)) {
    for (const species of Object.keys(speciesMap)) {
      const key = `${stateId}-${species}`;
      if (!seen.has(key)) {
        seen.add(key);
        allTrackedKeys.push({ stateId, species });
      }
    }
  }

  // States available for selection from huntingData
  const availableStates = [...new Set(huntingData.map(d => d.stateId))].sort();
  const speciesForState = addState
    ? [...new Set(huntingData.filter(d => d.stateId === addState.toLowerCase()).map(d => d.species as SpeciesKey))]
    : [];

  const CURRENT_YEAR = new Date().getFullYear();

  if (allTrackedKeys.length === 0 && manualPoints.length === 0) {
    return (
      <div className="rounded-xl p-6 mb-5 text-center" style={{ backgroundColor: '#162016', border: '1px solid #2a3a2a' }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: '#8a9e8a' }}>Points Tracker</h3>
        <p className="text-sm mb-4" style={{ color: '#6a7e6a' }}>
          Track preference and bonus points by state — even if you haven&apos;t logged applications yet.
        </p>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-lg text-sm font-bold"
          style={{ backgroundColor: '#f59e0b', color: '#0f1a0f' }}
        >
          + Add Points
        </button>
        {showAdd && <AddForm />}
      </div>
    );
  }

  function AddForm() {
    return (
      <div className="mt-4 p-4 rounded-xl text-left" style={{ backgroundColor: '#1a2a1a', border: '1px solid #2a3a2a' }}>
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8a9e8a' }}>Add / Update Points</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="text-xs block mb-1" style={{ color: '#8a9e8a' }}>State</label>
            <select
              value={addState}
              onChange={e => { setAddState(e.target.value); setAddSpecies('elk'); }}
              className="w-full px-2 py-1.5 rounded text-xs"
              style={{ backgroundColor: '#162016', border: '1px solid #2a3a2a', color: '#e8f0e8' }}
            >
              <option value="">Select...</option>
              {availableStates.map(s => (
                <option key={s} value={s.toUpperCase()}>{STATE_NAMES[s.toUpperCase()] ?? s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: '#8a9e8a' }}>Species</label>
            <select
              value={addSpecies}
              onChange={e => setAddSpecies(e.target.value as SpeciesKey)}
              className="w-full px-2 py-1.5 rounded text-xs"
              style={{ backgroundColor: '#162016', border: '1px solid #2a3a2a', color: '#e8f0e8' }}
              disabled={!addState}
            >
              {speciesForState.map(s => (
                <option key={s} value={s}>{SPECIES_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: '#8a9e8a' }}>Points</label>
            <input
              type="number"
              min={0}
              max={50}
              value={addPoints}
              onChange={e => setAddPoints(Number(e.target.value))}
              className="w-full px-2 py-1.5 rounded text-xs"
              style={{ backgroundColor: '#162016', border: '1px solid #2a3a2a', color: '#e8f0e8' }}
            />
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: '#8a9e8a' }}>As of Year</label>
            <input
              type="number"
              min={2000}
              max={CURRENT_YEAR}
              value={addYear}
              onChange={e => setAddYear(Number(e.target.value))}
              className="w-full px-2 py-1.5 rounded text-xs"
              style={{ backgroundColor: '#162016', border: '1px solid #2a3a2a', color: '#e8f0e8' }}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="text-xs block mb-1" style={{ color: '#8a9e8a' }}>Notes (optional)</label>
          <input
            type="text"
            value={addNotes}
            onChange={e => setAddNotes(e.target.value)}
            placeholder="e.g., verified on WGFD website"
            className="w-full px-2 py-1.5 rounded text-xs"
            style={{ backgroundColor: '#162016', border: '1px solid #2a3a2a', color: '#e8f0e8' }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!addState}
            className="px-4 py-1.5 rounded text-xs font-bold"
            style={{ backgroundColor: addState ? '#f59e0b' : '#2a3a2a', color: addState ? '#0f1a0f' : '#8a9e8a' }}
          >
            Save
          </button>
          <button
            onClick={() => setShowAdd(false)}
            className="px-3 py-1.5 rounded text-xs"
            style={{ color: '#8a9e8a' }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: '#162016', border: '1px solid #2a3a2a' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#8a9e8a' }}>
          Points Tracker
        </h3>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="px-3 py-1 rounded text-xs font-medium"
          style={{ backgroundColor: '#1a2a1a', border: '1px solid #2a3a2a', color: '#c8d8c8' }}
        >
          + Add / Update
        </button>
      </div>

      {showAdd && <AddForm />}

      <div className="flex flex-wrap gap-2 mt-3">
        {allTrackedKeys
          .sort((a, b) => (merged[b.stateId]?.[b.species] ?? 0) - (merged[a.stateId]?.[a.species] ?? 0))
          .map(({ stateId, species }) => {
            const pts = merged[stateId]?.[species] ?? 0;
            const isManual = manualPoints.some(m => m.stateId === stateId && m.species === species);
            const isDerived = !!derived[stateId]?.[species];
            const manualEntry = manualPoints.find(m => m.stateId === stateId && m.species === species);

            return (
              <div
                key={`${stateId}-${species}`}
                className="px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2"
                style={{ backgroundColor: '#1a2a1a', border: '1px solid #2a3a2a' }}
              >
                <div>
                  <span style={{ color: '#e8f0e8' }}>{STATE_NAMES[stateId.toUpperCase()] ?? stateId}</span>
                  <span style={{ color: '#6a7e6a' }}> · {SPECIES_LABELS[species as SpeciesKey]}</span>
                  <span className="ml-2 font-bold" style={{ color: '#f59e0b' }}>{pts} pts</span>
                  {isManual && !isDerived && (
                    <span className="ml-1 text-xs" style={{ color: '#4a5a4a' }}>(manual)</span>
                  )}
                  {isDerived && isManual && (
                    <span className="ml-1 text-xs" style={{ color: '#4a5a4a' }}>(merged)</span>
                  )}
                </div>
                {isManual && manualEntry && (
                  <button
                    onClick={() => handleDelete(manualEntry.id)}
                    className="text-xs"
                    style={{ color: '#4a5a4a' }}
                    title="Remove manual entry"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
      </div>

      <p className="text-xs mt-3" style={{ color: '#4a5a4a' }}>
        Points derived from your application log. Add manual entries for states where you haven&apos;t logged apps yet.
        Use these on the <a href="/odds" style={{ color: '#f59e0b' }}>Draw Odds Calculator</a> to see your estimated draw timeline.
      </p>
    </div>
  );
}
