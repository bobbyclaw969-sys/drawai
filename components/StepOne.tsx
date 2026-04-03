"use client";
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
  const toggleSpecies = (s: SpeciesKey) => {
    const cur = profile.species ?? [];
    onChange({
      species: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s],
    });
  };

  const valid =
    (profile.species?.length ?? 0) > 0 &&
    profile.huntType &&
    profile.residency &&
    profile.goal;

  return (
    <div className="space-y-8">
      {/* Species */}
      <div>
        <label className="block text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#8a9e8a" }}>
          Target Species (select all that apply)
        </label>
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
                  border: selected ? "1px solid #f59e0b" : "1px solid #2a3a2a",
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
      <div>
        <label className="block text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#8a9e8a" }}>
          Preferred Method
        </label>
        <div className="flex flex-wrap gap-2">
          {(["archery", "rifle", "muzzleloader", "any"] as HuntType[]).map(ht => (
            <button
              key={ht}
              onClick={() => onChange({ huntType: ht })}
              className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
              style={{
                backgroundColor: profile.huntType === ht ? "#f59e0b" : "#162016",
                border: profile.huntType === ht ? "1px solid #f59e0b" : "1px solid #2a3a2a",
                color: profile.huntType === ht ? "#0f1a0f" : "#c8d8c8",
              }}
            >
              {ht === "any" ? "Any / All" : ht.charAt(0).toUpperCase() + ht.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Residency */}
      <div>
        <label className="block text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#8a9e8a" }}>
          Your State of Residency
        </label>
        <select
          value={profile.residency ?? ""}
          onChange={e => onChange({ residency: e.target.value })}
          className="w-full sm:w-64 px-3 py-2.5 rounded-lg text-sm"
          style={{
            backgroundColor: "#1a2a1a",
            border: "1px solid #2a3a2a",
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
        <label className="block text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#8a9e8a" }}>
          Annual Application Budget:{" "}
          <span style={{ color: "#f59e0b" }}>${(profile.budget ?? 500).toLocaleString()}</span>
        </label>
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
      <div>
        <label className="block text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#8a9e8a" }}>
          My Hunting Goal
        </label>
        <div className="space-y-2">
          {GOALS.map(g => (
            <button
              key={g.value}
              onClick={() => onChange({ goal: g.value })}
              className="w-full text-left px-4 py-3 rounded-lg transition-all"
              style={{
                backgroundColor: profile.goal === g.value ? "#f59e0b22" : "#162016",
                border: profile.goal === g.value ? "1px solid #f59e0b" : "1px solid #2a3a2a",
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

      <button
        onClick={onNext}
        disabled={!valid}
        className="w-full py-3 rounded-lg font-bold text-base transition-all"
        style={{
          backgroundColor: valid ? "#f59e0b" : "#2a3a2a",
          color: valid ? "#0f1a0f" : "#8a9e8a",
          cursor: valid ? "pointer" : "not-allowed",
        }}
      >
        Next: Enter Your Points →
      </button>
    </div>
  );
}
