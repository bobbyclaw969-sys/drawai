"use client";
import { useState } from "react";
import { HunterProfile, SpeciesKey, HuntType, Goal, PlanningYears } from "@/lib/types";
import { SPECIES_LABELS, SPECIES_EMOJI, ALL_STATES, STATE_NAMES } from "@/lib/huntingData";

const ALL_SPECIES: SpeciesKey[] = [
  "elk", "mule_deer", "whitetail", "pronghorn",
  "bighorn_sheep", "mountain_goat", "moose", "black_bear", "bison", "mountain_lion",
];

const HUNT_TYPES: { value: HuntType; label: string; emoji: string }[] = [
  { value: "archery",      label: "Archery",      emoji: "🏹" },
  { value: "rifle",        label: "Rifle",        emoji: "🎯" },
  { value: "muzzleloader", label: "Muzzleloader", emoji: "💨" },
  { value: "any",          label: "Any / All",    emoji: "✓" },
];

const GOALS: { value: Goal; label: string; desc: string; emoji: string }[] = [
  { value: "hunt_often",  label: "Hunt as often as possible", emoji: "📅", desc: "Quantity over rarity — I'll take any quality tag I can get." },
  { value: "one_trophy",  label: "One trophy hunt",           emoji: "🏆", desc: "I'll wait years for a premium unit. I want the absolute best." },
  { value: "balance",     label: "Balance",                   emoji: "⚖️", desc: "Decent hunts now while building toward something special." },
];

const PLANNING_YEARS: PlanningYears[] = [5, 10, 15];

interface Props {
  profile: Partial<HunterProfile>;
  onChange: (updates: Partial<HunterProfile>) => void;
  onNext: () => void;
}

export default function StepOne({ profile, onChange, onNext }: Props) {
  const [attempted, setAttempted] = useState(false);

  const toggleSpecies = (s: SpeciesKey) => {
    const cur = profile.species ?? [];
    onChange({ species: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] });
  };

  const errors = {
    species:   (profile.species?.length ?? 0) === 0,
    huntType:  !profile.huntType,
    residency: !profile.residency,
    goal:      !profile.goal,
  };
  const valid = !Object.values(errors).some(Boolean);

  const handleNext = () => {
    if (!valid) {
      setAttempted(true);
      document.querySelector("[data-error='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onNext();
  };

  const fieldErr = (k: keyof typeof errors) => attempted && errors[k];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

      {/* Species */}
      <div data-error={fieldErr("species") ? "true" : undefined}>
        <label className="field-label">
          Target Species <span className="req">*</span>
        </label>
        {fieldErr("species") && (
          <p style={{ fontSize: 12, color: "var(--danger)", marginBottom: 10, marginTop: -4 }}>
            Select at least one species.
          </p>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
          {ALL_SPECIES.map(s => {
            const sel = profile.species?.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSpecies(s)}
                className={`choice-btn${sel ? " selected" : ""}`}
                style={{ borderColor: fieldErr("species") && !sel ? "var(--danger-border)" : undefined }}
              >
                <div className="check">{sel ? "✓" : ""}</div>
                <span style={{ fontSize: "1.1rem" }}>{SPECIES_EMOJI[s]}</span>
                <span style={{ fontSize: 13, flex: 1 }}>{SPECIES_LABELS[s]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hunt Type */}
      <div data-error={fieldErr("huntType") ? "true" : undefined}>
        <label className="field-label">
          Preferred Method <span className="req">*</span>
        </label>
        {fieldErr("huntType") && (
          <p style={{ fontSize: 12, color: "var(--danger)", marginBottom: 10, marginTop: -4 }}>
            Select a hunt method.
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {HUNT_TYPES.map(ht => (
            <button
              key={ht.value}
              onClick={() => onChange({ huntType: ht.value })}
              className={`pill-btn${profile.huntType === ht.value ? " selected" : ""}`}
            >
              {ht.emoji} {ht.label}
            </button>
          ))}
        </div>
      </div>

      {/* Residency */}
      <div data-error={fieldErr("residency") ? "true" : undefined}>
        <label className="field-label">
          Your State of Residency <span className="req">*</span>
        </label>
        {fieldErr("residency") && (
          <p style={{ fontSize: 12, color: "var(--danger)", marginBottom: 10, marginTop: -4 }}>
            Select your home state.
          </p>
        )}
        <select
          value={profile.residency ?? ""}
          onChange={e => onChange({ residency: e.target.value })}
          className="input"
          style={{
            maxWidth: 280,
            borderColor: fieldErr("residency") ? "var(--danger)" : undefined,
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
        <label className="field-label">
          Annual Application Budget:{" "}
          <span style={{ color: "var(--amber)", fontWeight: 800, fontSize: 13 }}>
            ${(profile.budget ?? 500).toLocaleString()}
          </span>
        </label>
        <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 14, marginTop: -6 }}>
          Total NR fees across all applications per year
        </p>
        <input
          type="range"
          min={100}
          max={5000}
          step={50}
          value={profile.budget ?? 500}
          onChange={e => onChange({ budget: Number(e.target.value) })}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-3)", marginTop: 6 }}>
          <span>$100</span>
          <span>$5,000</span>
        </div>
      </div>

      {/* Goal */}
      <div data-error={fieldErr("goal") ? "true" : undefined}>
        <label className="field-label">
          My Hunting Goal <span className="req">*</span>
        </label>
        {fieldErr("goal") && (
          <p style={{ fontSize: 12, color: "var(--danger)", marginBottom: 10, marginTop: -4 }}>
            Choose a goal to continue.
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {GOALS.map(g => {
            const sel = profile.goal === g.value;
            return (
              <button
                key={g.value}
                onClick={() => onChange({ goal: g.value })}
                className={`choice-btn${sel ? " selected" : ""}`}
                style={{ borderColor: fieldErr("goal") && !sel ? "var(--danger-border)" : undefined }}
              >
                <div className="check">{sel ? "✓" : ""}</div>
                <span style={{ fontSize: "1.2rem" }}>{g.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: sel ? "var(--amber)" : "var(--text)" }}>
                    {g.label}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{g.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Planning Years */}
      <div>
        <label className="field-label">Planning Horizon</label>
        <div style={{ display: "flex", gap: 8 }}>
          {PLANNING_YEARS.map(y => (
            <button
              key={y}
              onClick={() => onChange({ planningYears: y })}
              className={`pill-btn${profile.planningYears === y ? " selected" : ""}`}
            >
              {y} years
            </button>
          ))}
        </div>
      </div>

      {attempted && !valid && (
        <div className="card" style={{ padding: 14, background: "var(--danger-bg)", borderColor: "var(--danger-border)" }}>
          <p style={{ fontSize: 13, color: "var(--danger)" }}>
            Please fill in the required fields above before continuing.
          </p>
        </div>
      )}

      <button onClick={handleNext} className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15, justifyContent: "center" }}>
        Next: Enter Your Points →
      </button>
    </div>
  );
}
