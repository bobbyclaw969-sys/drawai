"use client";
import { useState, CSSProperties } from "react";
import { HunterProfile, SpeciesKey, HuntType, Goal, PlanningYears } from "@/lib/types";
import { SPECIES_LABELS, ALL_STATES, STATE_NAMES } from "@/lib/huntingData";

// ── Design tokens ───────────────────────────────────────────────────────────
const SOIL = "#0F0D0A";
const BARK = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";
const DANGER = "#C4513A";

const DISPLAY = "var(--font-display), Georgia, serif";
const MONO = "var(--font-dm-mono), monospace";

const ALL_SPECIES: SpeciesKey[] = [
  "elk", "mule_deer", "whitetail", "pronghorn",
  "bighorn_sheep", "mountain_goat", "moose", "black_bear", "bison", "mountain_lion",
];

const HUNT_TYPES: { value: HuntType; label: string }[] = [
  { value: "archery",      label: "Archery" },
  { value: "rifle",        label: "Rifle" },
  { value: "muzzleloader", label: "Muzzleloader" },
  { value: "any",          label: "Any / All" },
];

const GOALS: { value: Goal; label: string; desc: string }[] = [
  { value: "hunt_often",  label: "Hunt as often as possible", desc: "Quantity over rarity — I'll take any quality tag I can get." },
  { value: "one_trophy",  label: "One trophy hunt",           desc: "I'll wait years for a premium unit. I want the absolute best." },
  { value: "balance",     label: "Balance",                   desc: "Decent hunts now while building toward something special." },
];

const PLANNING_YEARS: PlanningYears[] = [5, 10, 15];

interface Props {
  profile: Partial<HunterProfile>;
  onChange: (updates: Partial<HunterProfile>) => void;
  onNext: () => void;
}

// ── Shared styles ───────────────────────────────────────────────────────────
const sectionLabel: CSSProperties = {
  fontFamily: MONO,
  fontSize: 11,
  color: DUST,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  marginBottom: 12,
  display: "block",
};

const errorText: CSSProperties = {
  fontFamily: MONO,
  fontSize: 12,
  color: DANGER,
  marginTop: -4,
  marginBottom: 10,
};

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

  // Square checkbox indicator
  const Checkbox = ({ selected }: { selected: boolean }) => (
    <div
      style={{
        width: 14,
        height: 14,
        background: selected ? AMBER : "transparent",
        border: `1px solid ${selected ? AMBER : FENCE}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {selected && (
        <div style={{ width: 6, height: 6, background: SOIL }} />
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

      {/* ── Species ─────────────────────────────────────────────────────── */}
      <div data-error={fieldErr("species") ? "true" : undefined}>
        <label style={sectionLabel}>Target Species *</label>
        {fieldErr("species") && (
          <p style={errorText}>Select at least one species.</p>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 8,
          }}
        >
          {ALL_SPECIES.map(s => {
            const sel = profile.species?.includes(s) ?? false;
            const borderColor = fieldErr("species") && !sel ? DANGER : sel ? AMBER : FENCE;
            return (
              <button
                key={s}
                onClick={() => toggleSpecies(s)}
                style={{
                  background: sel ? BARK : SOIL,
                  border: `1px solid ${borderColor}`,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  borderRadius: 0,
                  transition: "border-color 0.15s, background 0.15s",
                  textAlign: "left",
                }}
                onMouseEnter={e => {
                  if (!sel) e.currentTarget.style.borderColor = AMBER;
                }}
                onMouseLeave={e => {
                  if (!sel) e.currentTarget.style.borderColor = borderColor;
                }}
              >
                <Checkbox selected={sel} />
                <span
                  style={{
                    fontFamily: MONO,
                    fontWeight: 500,
                    fontSize: 14,
                    color: BONE,
                    flex: 1,
                  }}
                >
                  {SPECIES_LABELS[s]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Hunt Type ───────────────────────────────────────────────────── */}
      <div data-error={fieldErr("huntType") ? "true" : undefined}>
        <label style={sectionLabel}>Preferred Method *</label>
        {fieldErr("huntType") && (
          <p style={errorText}>Select a hunt method.</p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {HUNT_TYPES.map(ht => {
            const sel = profile.huntType === ht.value;
            return (
              <button
                key={ht.value}
                onClick={() => onChange({ huntType: ht.value })}
                style={{
                  background: sel ? AMBER : "transparent",
                  border: `1px solid ${sel ? AMBER : FENCE}`,
                  color: sel ? SOIL : DUST,
                  fontFamily: MONO,
                  fontSize: 13,
                  padding: "10px 18px",
                  cursor: "pointer",
                  borderRadius: 0,
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={e => {
                  if (!sel) {
                    e.currentTarget.style.borderColor = AMBER;
                    e.currentTarget.style.color = AMBER;
                  }
                }}
                onMouseLeave={e => {
                  if (!sel) {
                    e.currentTarget.style.borderColor = FENCE;
                    e.currentTarget.style.color = DUST;
                  }
                }}
              >
                {ht.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Residency ───────────────────────────────────────────────────── */}
      <div data-error={fieldErr("residency") ? "true" : undefined}>
        <label style={sectionLabel}>Your State of Residency *</label>
        {fieldErr("residency") && (
          <p style={errorText}>Select your home state.</p>
        )}
        <select
          value={profile.residency ?? ""}
          onChange={e => onChange({ residency: e.target.value })}
          aria-label="Your state of residency"
          style={{
            background: SOIL,
            border: `1px solid ${fieldErr("residency") ? DANGER : FENCE}`,
            color: BONE,
            fontFamily: MONO,
            fontSize: 14,
            padding: "10px 14px",
            height: 44,
            maxWidth: 320,
            width: "100%",
            borderRadius: 0,
            outline: "none",
            cursor: "pointer",
            appearance: "none",
          }}
        >
          <option value="">Select your state...</option>
          {ALL_STATES.map(s => (
            <option key={s} value={s}>{STATE_NAMES[s]} ({s})</option>
          ))}
        </select>
      </div>

      {/* ── Budget ──────────────────────────────────────────────────────── */}
      <div>
        <label style={sectionLabel}>Annual Application Budget</label>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 16,
            fontWeight: 500,
            color: AMBER,
            marginBottom: 14,
          }}
        >
          ${(profile.budget ?? 500).toLocaleString()}
        </div>
        <input
          type="range"
          min={100}
          max={5000}
          step={50}
          value={profile.budget ?? 500}
          onChange={e => onChange({ budget: Number(e.target.value) })}
          aria-label="Annual application budget"
          className="plan-slider"
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: MONO,
            fontSize: 10,
            color: DUST,
            marginTop: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ color: BONE }}>$100 – $600</div>
            <div style={{ marginTop: 2 }}>Single state</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: BONE }}>$800 – $1,500</div>
            <div style={{ marginTop: 2 }}>2–3 states</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: BONE }}>$2,500+</div>
            <div style={{ marginTop: 2 }}>All-in portfolio</div>
          </div>
        </div>
      </div>

      {/* ── Goal ────────────────────────────────────────────────────────── */}
      <div data-error={fieldErr("goal") ? "true" : undefined}>
        <label style={sectionLabel}>My Hunting Goal *</label>
        {fieldErr("goal") && (
          <p style={errorText}>Choose a goal to continue.</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {GOALS.map(g => {
            const sel = profile.goal === g.value;
            const borderColor = fieldErr("goal") && !sel ? DANGER : sel ? AMBER : FENCE;
            return (
              <button
                key={g.value}
                onClick={() => onChange({ goal: g.value })}
                style={{
                  background: sel ? BARK : SOIL,
                  border: `1px solid ${borderColor}`,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  cursor: "pointer",
                  borderRadius: 0,
                  textAlign: "left",
                  transition: "border-color 0.15s, background 0.15s",
                }}
                onMouseEnter={e => {
                  if (!sel) e.currentTarget.style.borderColor = AMBER;
                }}
                onMouseLeave={e => {
                  if (!sel) e.currentTarget.style.borderColor = borderColor;
                }}
              >
                <div style={{ marginTop: 3 }}>
                  <Checkbox selected={sel} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontWeight: 500,
                      fontSize: 14,
                      color: sel ? AMBER : BONE,
                    }}
                  >
                    {g.label}
                  </div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      color: DUST,
                      marginTop: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    {g.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Planning Years ──────────────────────────────────────────────── */}
      <div>
        <label style={sectionLabel}>Planning Horizon</label>
        <div style={{ display: "flex", gap: 8 }}>
          {PLANNING_YEARS.map(y => {
            const sel = profile.planningYears === y;
            return (
              <button
                key={y}
                onClick={() => onChange({ planningYears: y })}
                style={{
                  background: sel ? AMBER : "transparent",
                  border: `1px solid ${sel ? AMBER : FENCE}`,
                  color: sel ? SOIL : DUST,
                  fontFamily: MONO,
                  fontSize: 13,
                  padding: "10px 18px",
                  cursor: "pointer",
                  borderRadius: 0,
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={e => {
                  if (!sel) {
                    e.currentTarget.style.borderColor = AMBER;
                    e.currentTarget.style.color = AMBER;
                  }
                }}
                onMouseLeave={e => {
                  if (!sel) {
                    e.currentTarget.style.borderColor = FENCE;
                    e.currentTarget.style.color = DUST;
                  }
                }}
              >
                {y} years
              </button>
            );
          })}
        </div>
      </div>

      {/* Error summary */}
      {attempted && !valid && (
        <div
          style={{
            background: "transparent",
            border: `1px solid ${DANGER}`,
            padding: 14,
            borderRadius: 0,
          }}
        >
          <p
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: DANGER,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: 0,
            }}
          >
            Please fill in the required fields above before continuing.
          </p>
        </div>
      )}

      {/* Next button */}
      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
        <button
          onClick={handleNext}
          style={{
            background: AMBER,
            color: SOIL,
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 14,
            padding: "12px 32px",
            height: 48,
            border: "none",
            borderRadius: 0,
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#F0A040")}
          onMouseLeave={e => (e.currentTarget.style.background = AMBER)}
        >
          Next: Enter Your Points
        </button>
      </div>
    </div>
  );
}
