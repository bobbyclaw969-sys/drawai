"use client";
import { useState } from "react";
import { HunterProfile, SpeciesKey, HuntType, Goal, PlanningYears } from "@/lib/types";
import { SPECIES_LABELS, SPECIES_EMOJI, ALL_STATES, STATE_NAMES } from "@/lib/huntingData";

const ALL_SPECIES: SpeciesKey[] = [
  "elk", "mule_deer", "whitetail", "pronghorn",
  "bighorn_sheep", "mountain_goat", "moose", "black_bear", "bison", "mountain_lion",
];

const GOALS: { value: Goal; label: string; desc: string }[] = [
  { value: "hunt_often", label: "Hunt as often as possible", desc: "I'll take any quality tag I can get. Quantity over rarity." },
  { value: "one_trophy", label: "One trophy hunt", desc: "I'll wait years for a premium unit. I want the best." },
  { value: "balance", label: "Balance", desc: "Decent hunts now while building toward something special." },
];

interface Props {
  profile: Partial<HunterProfile>;
  onChange: (updates: Partial<HunterProfile>) => void;
  onNext: () => void;
}

export default function StepOne({ profile, onChange, onNext }: Props) {
  const [attempted, setAttempted] = useState(false);

  const toggleSpecies = (s: SpeciesKey) => {
    const cur = profile.species ?? [];
    onChange({
      species: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s],
    });
  };

  const errors = {
    species: (profile.species?.length ?? 0) === 0,
    huntType: !profile.huntType,
    residency: !profile.residency,
    goal: !profile.goal,
  };

  const valid = !Object.values(errors).some(Boolean);

  const handleNext = () => {
    if (!valid) {
      setAttempted(true);
      // Scroll to first error
      const firstError = document.querySelector("[data-error]");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onNext();
  };

  const fieldError = (key: keyof typeof errors) =>
    attempted && errors[key];

  return (
    <div className="space-y-8">
      {/* Species */}
      <div data-error={fieldError("species") ? "true" : undefined}>
        <label className="block text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: "#8a9e8a" }}>
          Target Species <span style={{ color: "#f87171" }}>*</span>
        </label>
        {fieldError("species") && (
          <p className="text-xs mb-3" style={{ color: "#f87171" }}>Select at least one species to continue.</p>
        )}
        {!fieldError("species") && (
          <p className="text-xs mb-3" style={{ color: "#6a7e6a" }}>Select all that apply</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALL_SPECIES.map(s => {
            const selected = profile.species?.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSpecies(s)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
                style={{
                  backgroundColor: selected ? "#f59e0b22" : "#162016",
                  border: selected
                    ? "1px solid #f59e0b"
                    : fieldError("species")
                    ? "1px solid #5a2020"
                    : "1px solid #2a3a2a",
                  color: selected ? "#f59e0b" : "#c8d8c8",
                }}
              >
                <span>{SPECIES_EMOJI[s]}</span>
                <span>{SPECIES_LABELS[s]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hunt Type */}
      <div data-error={fieldError("huntType") ? "true" : undefined}>
        <label className="block text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: "#8a9e8a" }}>
          Preferred Method <span style={{ color: "#f87171" }}>*</span>
        </label>
        {fieldError("huntType") && (
          <p className="text-xs mb-3" style={{ color: "#f87171" }}>Select a hunt method.</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {(["archery", "rifle", "muzzleloader", "any"] as HuntType[]).map(ht => (
            <button
              key={ht}
              onClick={() => onChange({ huntType: ht })}
              className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
              style={{
                backgroundColor: profile.huntType === ht ? "#f59e0b" : "#162016",
                border: profile.huntType === ht
                  ? "1px solid #f59e0b"
                  : fieldError("huntType")
                  ? "1px solid #5a2020"
                  : "1px solid #2a3a2a",
                color: profile.huntType === ht ? "#0f1a0f" : "#c8d8c8",
              }}
            >
              {ht === "any" ? "Any / All" : ht.charAt(0).toUpperCase() + ht.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Residency */}
      <div data-error={fieldError("residency") ? "true" : undefined}>
        <label className="block text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: "#8a9e8a" }}>
          Your State of Residency <span style={{ color: "#f87171" }}>*</span>
        </label>
        {fieldError("residency") && (
          <p className="text-xs mb-2" style={{ color: "#f87171" }}>Select your home state.</p>
        )}
        <select
          value={profile.residency ?? ""}
          onChange={e => onChange({ residency: e.target.value })}
          className="w-full sm:w-64 px-3 py-2.5 rounded-lg text-sm mt-1"
          style={{
            backgroundColor: "#1a2a1a",
            border: fieldError("residency") ? "1px solid #5a2020" : "1px solid #2a3a2a",
            color: "#e8f0e8",
          }}
        >
          <option value="">Select your state...</option>
          {ALL_STATES.map(s => (
            <option key={s} value={s}>{STATE_NAMES[s]} ({s})</option>
          ))}
        </select>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: "#8a9e8a" }}>
          Annual Application Budget:{" "}
          <span style={{ color: "#f59e0b" }}>${(profile.budget ?? 500).toLocaleString()}</span>
        </label>
        <p className="text-xs mb-3" style={{ color: "#6a7e6a" }}>
          Total fees across all applications per year
        </p>
        <input
          type="range"
          min={100}
          max={5000}
          step={50}
          value={profile.budget ?? 500}
          onChange={e => onChange({ budget: Number(e.target.value) })}
          className="w-full accent-amber-500"
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: "#8a9e8a" }}>
          <span>$100</span>
          <span>$5,000</span>
        </div>
      </div>

      {/* Goal */}
      <div data-error={fieldError("goal") ? "true" : undefined}>
        <label className="block text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: "#8a9e8a" }}>
          My Hunting Goal <span style={{ color: "#f87171" }}>*</span>
        </label>
        {fieldError("goal") && (
          <p className="text-xs mb-2" style={{ color: "#f87171" }}>Choose a goal to continue.</p>
        )}
        <div className="space-y-2 mt-2">
          {GOALS.map(g => (
            <button
              key={g.value}
              onClick={() => onChange({ goal: g.value })}
              className="w-full text-left px-4 py-3 rounded-lg transition-all"
              style={{
                backgroundColor: profile.goal === g.value ? "#f59e0b22" : "#162016",
                border: profile.goal === g.value
                  ? "1px solid #f59e0b"
                  : fieldError("goal")
                  ? "1px solid #5a2020"
                  : "1px solid #2a3a2a",
              }}
            >
              <div className="font-semibold text-sm" style={{ color: profile.goal === g.value ? "#f59e0b" : "#e8f0e8" }}>
                {g.label}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#8a9e8a" }}>{g.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Planning years */}
      <div>
        <label className="block text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#8a9e8a" }}>
          Planning Horizon
        </label>
        <div className="flex gap-2">
          {([5, 10, 15] as PlanningYears[]).map(y => (
            <button
              key={y}
              onClick={() => onChange({ planningYears: y })}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: profile.planningYears === y ? "#f59e0b" : "#162016",
                border: profile.planningYears === y ? "1px solid #f59e0b" : "1px solid #2a3a2a",
                color: profile.planningYears === y ? "#0f1a0f" : "#c8d8c8",
              }}
            >
              {y} years
            </button>
          ))}
        </div>
      </div>

      {attempted && !valid && (
        <div
          className="px-4 py-3 rounded-lg text-sm"
          style={{ backgroundColor: "#2a1010", border: "1px solid #5a1010", color: "#f87171" }}
        >
          Please fill in the required fields above before continuing.
        </div>
      )}

      <button
        onClick={handleNext}
        className="w-full py-3 rounded-lg font-bold text-base transition-all"
        style={{
          backgroundColor: valid ? "#f59e0b" : attempted ? "#5a2020" : "#2a3a2a",
          color: valid ? "#0f1a0f" : "#8a9e8a",
          cursor: "pointer",
        }}
      >
        Next: Enter Your Points →
      </button>
    </div>
  );
}
